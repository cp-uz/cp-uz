"""Private username/access-code roster. Never store cleartext codes on the server."""

import csv
import os
import re
import secrets
from pathlib import Path

from werkzeug.security import generate_password_hash


def read_roster(path):
    if not Path(path).exists():
        return {}
    with Path(path).open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    accounts = {}
    for row in rows:
        username = row["username"]
        if not re.fullmatch(r"[a-z0-9_]{1,32}", username):
            raise ValueError("Invalid roster username")
        if username in accounts or row["role"] not in {"student", "admin"}:
            raise ValueError("Duplicate username or invalid role")
        accounts[username] = row
    return accounts


def read_ids(path):
    role = "student"
    accounts = {}
    for line in Path(path).read_text(encoding="utf-8-sig").splitlines():
        username = line.strip().lower()
        if not username:
            continue
        if username in {"staff:", "students:"}:
            role = "admin" if username == "staff:" else "student"
            continue
        if not re.fullmatch(r"[a-z0-9_]{1,32}", username):
            raise ValueError(f"Invalid username: {username}")
        if username in accounts:
            raise ValueError(f"Duplicate username: {username}")
        accounts[username] = role
    if not accounts:
        raise ValueError("The username list is empty")
    return accounts


def provision(ids_path, roster_path, credentials_path):
    roster_path, credentials_path = Path(roster_path), Path(credentials_path)
    if credentials_path.exists():
        raise ValueError(
            "Choose a new credentials output path; existing codes are preserved"
        )
    accounts = read_roster(roster_path)
    credentials = []
    for username, role in read_ids(ids_path).items():
        if username not in accounts:
            code = secrets.token_urlsafe(15)
            accounts[username] = {
                "username": username,
                "code_hash": generate_password_hash(code),
                "role": role,
            }
            credentials.append(
                {"username": username, "access_code": code, "role": role}
            )
        else:
            accounts[username]["role"] = role
    roster_path.parent.mkdir(parents=True, exist_ok=True)
    credentials_path.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation prevents accidentally replacing the only cleartext code export.
    with credentials_path.open("x", encoding="utf-8", newline="") as stream:
        os.chmod(credentials_path, 0o600)
        writer = csv.DictWriter(stream, fieldnames=["username", "access_code", "role"])
        writer.writeheader()
        writer.writerows(credentials)
    temporary = roster_path.with_suffix(".tmp")
    with temporary.open("w", encoding="utf-8", newline="") as stream:
        os.chmod(temporary, 0o600)
        writer = csv.DictWriter(stream, fieldnames=["username", "code_hash", "role"])
        writer.writeheader()
        writer.writerows(accounts[name] for name in sorted(accounts))
    temporary.replace(roster_path)
    return accounts, len(credentials)
