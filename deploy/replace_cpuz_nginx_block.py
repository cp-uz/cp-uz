#!/usr/bin/env python3
"""Replace only the exact cp.uz TLS server block in a shared Nginx config.

The server hosts several unrelated applications, so broad text replacement is
not acceptable. This utility parses top-level `server { ... }` blocks, requires
exactly one block with `server_name cp.uz www.cp.uz;`, and leaves every other
byte outside that block untouched.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

TARGET_SERVER_NAME = re.compile(r"(?m)^\s*server_name\s+cp\.uz\s+www\.cp\.uz\s*;\s*(?:#.*)?$")
TLS_LISTEN = re.compile(r"(?m)^\s*listen\s+(?:\[::\]:)?443\s+[^;]*\bssl\b[^;]*;")
SERVER_START = re.compile(r"(?m)^\s*server\s*\{")


def _matching_brace(text: str, opening_index: int) -> int:
    depth = 0
    quote: str | None = None
    escaped = False
    in_comment = False

    for index in range(opening_index, len(text)):
        char = text[index]

        if in_comment:
            if char == "\n":
                in_comment = False
            continue

        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue

        if char == "#":
            in_comment = True
        elif char in {'"', "'"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index

    raise ValueError("Unbalanced braces in Nginx configuration")


def replace_cpuz_block(source: str, replacement: str) -> str:
    matches: list[tuple[int, int]] = []

    for start in SERVER_START.finditer(source):
        opening = source.find("{", start.start(), start.end())
        end = _matching_brace(source, opening) + 1
        block = source[start.start() : end]
        if TARGET_SERVER_NAME.search(block):
            if not TLS_LISTEN.search(block):
                raise ValueError("The exact cp.uz server block is not a TLS :443 block")
            matches.append((start.start(), end))

    if len(matches) != 1:
        raise ValueError(f"Expected exactly one exact cp.uz TLS server block; found {len(matches)}")

    replacement = replacement.strip() + "\n"
    if not TARGET_SERVER_NAME.search(replacement):
        raise ValueError("Replacement does not contain the exact cp.uz server_name")
    if not TLS_LISTEN.search(replacement):
        raise ValueError("Replacement is not a TLS :443 server block")

    start, end = matches[0]
    return source[:start] + replacement + source[end:]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("replacement", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    source = args.source.read_text(encoding="utf-8")
    replacement = args.replacement.read_text(encoding="utf-8")
    rendered = replace_cpuz_block(source, replacement)
    args.output.write_text(rendered, encoding="utf-8")


if __name__ == "__main__":
    main()
