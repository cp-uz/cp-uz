"""Strict whole-snapshot checksum verification shared across entry points."""

from __future__ import annotations

import hashlib
import re


def verify_checksums(root):
    root = root.resolve()
    expected = {}
    for line in (root / "MANIFEST.sha256").read_text(encoding="utf-8").splitlines():
        digest, separator, relative = line.partition("  ")
        path = root / relative
        if not separator or not re.fullmatch("[a-f0-9]{64}", digest):
            raise ValueError(f"invalid checksum row: {line!r}")
        if relative in expected:
            raise ValueError(f"duplicate checksum path: {relative!r}")
        if not path.resolve().is_relative_to(root) or path.is_symlink():
            raise ValueError(f"unsafe checksum path: {relative!r}")
        expected[relative] = digest
    actual = {}
    for path in sorted(root.rglob("*")):
        if path.is_symlink():
            raise ValueError(f"snapshot must not contain symbolic links: {path}")
        if path.is_file() and path.name != "MANIFEST.sha256":
            actual[path.relative_to(root).as_posix()] = hashlib.sha256(
                path.read_bytes()
            ).hexdigest()
    missing, unlisted = (
        sorted(expected.keys() - actual.keys()),
        sorted(actual.keys() - expected.keys()),
    )
    changed = sorted(key for key in expected.keys() & actual.keys() if expected[key] != actual[key])
    if missing or unlisted or changed:
        raise ValueError(
            "checksum validation failed: "
            f"missing={missing[:5]}, unlisted={unlisted[:5]}, changed={changed[:5]}"
        )
