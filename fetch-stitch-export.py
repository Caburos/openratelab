#!/usr/bin/env python3
"""
One-shot script: finds the Stitch export email and downloads the zip attachment.
"""

import base64
import os
import sys
import zipfile
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

CREDENTIALS_FILE = Path(r"C:\Users\AI\AI-OS\DC\scripts\credentials.json")
TOKEN_FILE       = Path(r"C:\Users\AI\AI-OS\DC\scripts\token.json")
DEST_DIR         = Path(r"C:\Users\AI\AI-OS\my-brands\openratelab\stitch-export")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
]


def get_credentials():
    creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            TOKEN_FILE.write_text(creds.to_json())
        else:
            print("[error] Token invalid and cannot be refreshed. Re-run reauth.py.")
            sys.exit(1)
    return creds


def search_messages(service, query):
    result = service.users().messages().list(userId="me", q=query, maxResults=20).execute()
    return result.get("messages", [])


def get_message(service, msg_id):
    return service.users().messages().get(userId="me", id=msg_id, format="full").execute()


def get_header(headers, name):
    for h in headers:
        if h["name"].lower() == name.lower():
            return h["value"]
    return ""


def collect_parts(payload, parts_out):
    filename = payload.get("filename") or ""
    body = payload.get("body", {})
    attachment_id = body.get("attachmentId")
    if filename and attachment_id:
        parts_out.append({
            "filename": filename,
            "mimeType": payload.get("mimeType", ""),
            "attachmentId": attachment_id,
        })
    for part in payload.get("parts", []):
        collect_parts(part, parts_out)


def download_attachment(service, msg_id, attachment_id):
    result = service.users().messages().attachments().get(
        userId="me", messageId=msg_id, id=attachment_id
    ).execute()
    return base64.urlsafe_b64decode(result["data"])


def main():
    print("[fetch-stitch] Authenticating...")
    creds = get_credentials()
    service = build("gmail", "v1", credentials=creds)
    print("[fetch-stitch] Auth OK.")

    queries = [
        'subject:"open rate lab"',
        'subject:"openratelab"',
        'subject:"stitch" openratelab',
        'subject:"stitch" "open rate lab"',
        'filename:zip openratelab',
        'filename:zip "open rate lab"',
        'filename:zip stitch',
    ]

    found_msg = None
    found_zip_part = None

    for q in queries:
        print(f"[fetch-stitch] Searching: {q}")
        messages = search_messages(service, q)
        if not messages:
            continue

        for ref in messages:
            msg = get_message(service, ref["id"])
            headers = msg["payload"]["headers"]
            subject = get_header(headers, "Subject")
            sender  = get_header(headers, "From")
            print(f"  Found: '{subject}' from {sender}")

            parts = []
            collect_parts(msg["payload"], parts)
            zip_parts = [p for p in parts if p["filename"].lower().endswith(".zip")]

            if zip_parts:
                found_msg = msg
                found_zip_part = zip_parts[0]
                print(f"  ZIP attachment: {found_zip_part['filename']}")
                break

        if found_zip_part:
            break

    if not found_zip_part:
        print("[fetch-stitch] No email with a zip attachment found matching any query.")
        print("  Try forwarding the Stitch export email to korene.uros@gmail.com.")
        sys.exit(1)

    # Download
    print(f"\n[fetch-stitch] Downloading {found_zip_part['filename']}...")
    raw = download_attachment(service, found_msg["id"], found_zip_part["attachmentId"])
    print(f"  Downloaded {len(raw):,} bytes.")

    # Save
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    zip_path = DEST_DIR / found_zip_part["filename"]
    zip_path.write_bytes(raw)
    print(f"  Saved -> {zip_path}")

    # Unzip
    print(f"\n[fetch-stitch] Extracting...")
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(DEST_DIR)
        names = zf.namelist()

    print(f"\n[fetch-stitch] Done. {len(names)} files extracted to {DEST_DIR}\n")
    print("FILE STRUCTURE:")
    print("-" * 60)

    # Print tree
    seen_dirs = set()
    for name in sorted(names):
        parts = Path(name).parts
        for i, part in enumerate(parts):
            prefix = "  " * i
            path_so_far = "/".join(parts[:i+1])
            if i < len(parts) - 1:
                if path_so_far not in seen_dirs:
                    print(f"{prefix}[dir] {part}/")
                    seen_dirs.add(path_so_far)
            else:
                ext = Path(part).suffix.lower()
                icon = {".html": "[html]", ".css": "[css]", ".js": "[js]",
                        ".json": "[json]", ".svg": "[img]", ".png": "[img]", ".jpg": "[img]",
                        ".jpeg": "[img]", ".webp": "[img]", ".ts": "[ts]", ".tsx": "[tsx]",
                        ".md": "[md]", ".txt": "[txt]"}.get(ext, "[file]")
                print(f"{prefix}{icon} {part}")

    print("-" * 60)

    # Tech stack detection
    all_exts = {Path(n).suffix.lower() for n in names}
    has_html = ".html" in all_exts
    has_css  = ".css" in all_exts
    has_js   = ".js" in all_exts
    has_ts   = ".ts" in all_exts or ".tsx" in all_exts
    has_json = ".json" in all_exts

    pkg_json = next((n for n in names if Path(n).name == "package.json"), None)
    framework = "unknown"
    if pkg_json:
        try:
            import json
            pkg = json.loads((DEST_DIR / pkg_json).read_text(encoding="utf-8"))
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if "next" in deps:      framework = "Next.js"
            elif "react" in deps:   framework = "React"
            elif "vue" in deps:     framework = "Vue"
            elif "astro" in deps:   framework = "Astro"
            elif "svelte" in deps:  framework = "Svelte"
        except Exception:
            pass

    print(f"\nTECH STACK SUMMARY:")
    print(f"  HTML: {has_html} | CSS: {has_css} | JS: {has_js} | TS/TSX: {has_ts}")
    print(f"  package.json: {bool(pkg_json)} | Framework: {framework}")
    print(f"  All extensions: {sorted(all_exts)}")


if __name__ == "__main__":
    main()
