#!/usr/bin/env python3
"""
Export an OpenRateLab content draft (blog.md + linkedin.md) to a Google Doc.

Simple, readable layout only: doc title, then the blog post, then the
LinkedIn post. No metadata tables, no per-email structure — this is a
review doc, not a structured data export.

USAGE
-----
  python export-to-gdoc.py --draft ../drafts/2026-09-07-topic-slug
  python export-to-gdoc.py --draft ../drafts/2026-09-07-topic-slug --open

Doc ID is saved to {draft-folder}/gdoc-id.txt on first run. Subsequent runs
find that doc and fully replace its body (no diffing — the content here is
short enough that a full rebuild is simpler and safer than patching).
"""

import argparse
import re
import sys
import webbrowser
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCRIPTS_DIR      = Path(__file__).parent
CREDENTIALS_FILE = SCRIPTS_DIR / "credentials.json"
TOKEN_FILE       = SCRIPTS_DIR / "token.json"
DEFAULT_FOLDER_ID_FILE = SCRIPTS_DIR / "drive-folder-id.txt"

SCOPES = [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
]


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

def get_credentials():
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                print(f"[error] Missing {CREDENTIALS_FILE}", file=sys.stderr)
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.write_text(creds.to_json())
    return creds


# ---------------------------------------------------------------------------
# Content parsing — frontmatter title + markdown body, nothing more
# ---------------------------------------------------------------------------

def parse_content_file(path: Path) -> tuple[str | None, str]:
    """Return (title_or_None, body_markdown). Frontmatter fields other than
    `title` are ignored — this doc is for reading the draft, not the schema."""
    text = path.read_text(encoding="utf-8")
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            fm_text, body = parts[1], parts[2]
            title = None
            m = re.search(r'^title:\s*"?(.*?)"?\s*$', fm_text, re.MULTILINE)
            if m:
                title = m.group(1).strip()
            return title, body.strip("\n")
    return None, text.strip("\n")


# ---------------------------------------------------------------------------
# DocBuilder — minimal: headings, paragraphs with inline bold/italic, bullets
# ---------------------------------------------------------------------------

class DocBuilder:
    def __init__(self, start_index: int = 1):
        self.requests: list[dict] = []
        self.index = start_index

    def _insert(self, text: str) -> tuple[int, int]:
        s = self.index
        self.requests.append({"insertText": {"location": {"index": s}, "text": text}})
        self.index += len(text)
        return s, self.index

    def _para_style(self, s: int, e: int, named_style: str):
        self.requests.append({
            "updateParagraphStyle": {
                "range": {"startIndex": s, "endIndex": e},
                "paragraphStyle": {"namedStyleType": named_style},
                "fields": "namedStyleType",
            }
        })

    def _text_style(self, s: int, e: int, **kwargs):
        style, fields = {}, []
        for k in ("bold", "italic"):
            if k in kwargs:
                style[k] = kwargs[k]
                fields.append(k)
        if "link" in kwargs:
            style["link"] = {"url": kwargs["link"]}
            fields.append("link")
        if not fields:
            return
        self.requests.append({
            "updateTextStyle": {
                "range": {"startIndex": s, "endIndex": e},
                "textStyle": style,
                "fields": ",".join(fields),
            }
        })

    def heading(self, text: str, level: int):
        s, e = self._insert(text + "\n")
        self._para_style(s, e, f"HEADING_{level}")

    def blank(self):
        self._insert("\n")

    @staticmethod
    def _parse_inline(text: str) -> list[tuple[str, bool, bool]]:
        """**bold**, *italic* → [(text, bold, italic), ...]."""
        pattern = re.compile(r'\*\*(.+?)\*\*|\*([^*\n]+)\*')
        pos, segments = 0, []
        for m in pattern.finditer(text):
            if m.start() > pos:
                segments.append((text[pos:m.start()], False, False))
            if m.group(1) is not None:
                segments.append((m.group(1), True, False))
            else:
                segments.append((m.group(2), False, True))
            pos = m.end()
        if pos < len(text):
            segments.append((text[pos:], False, False))
        return segments or [(text, False, False)]

    def paragraph(self, text: str):
        """Plain paragraph with inline **bold**/*italic* support."""
        for seg_text, seg_bold, seg_italic in self._parse_inline(text):
            if not seg_text:
                continue
            s, e = self._insert(seg_text)
            self._text_style(s, e, bold=seg_bold, italic=seg_italic)
        self._insert("\n")

    def bullet_list(self, items: list[str]):
        start = self.index
        for item in items:
            for seg_text, seg_bold, seg_italic in self._parse_inline(item):
                if not seg_text:
                    continue
                s, e = self._insert(seg_text)
                self._text_style(s, e, bold=seg_bold, italic=seg_italic)
            self._insert("\n")
        end = self.index
        self.requests.append({
            "createParagraphBullets": {
                "range": {"startIndex": start, "endIndex": end},
                "bulletPreset": "BULLET_DISC_CIRCLE_SQUARE",
            }
        })


def render_markdown_body(b: DocBuilder, md_text: str, level_offset: int = 1):
    """Very small markdown subset: ## / ### headings, - / * bullet blocks,
    everything else as a plain paragraph (wrapped lines joined). Enough for
    what /orl-write actually produces — not a general markdown renderer."""
    blocks = re.split(r"\n\s*\n", md_text.strip())
    for block in blocks:
        block = block.strip("\n")
        if not block.strip():
            continue
        lines = block.splitlines()
        first = lines[0].strip()

        if first.startswith("### "):
            b.heading(first[4:].strip(), min(2 + level_offset, 6))
        elif first.startswith("## "):
            b.heading(first[3:].strip(), min(1 + level_offset, 6))
        elif all(re.match(r"^[-*]\s+", l.strip()) for l in lines if l.strip()):
            items = [re.sub(r"^[-*]\s+", "", l.strip()) for l in lines if l.strip()]
            b.bullet_list(items)
        else:
            b.paragraph(" ".join(l.strip() for l in lines))
        b.blank()


# ---------------------------------------------------------------------------
# Doc ID persistence — one file per draft folder
# ---------------------------------------------------------------------------

def _docid_path(draft_dir: Path) -> Path:
    return draft_dir / "gdoc-id.txt"


def load_doc_id(draft_dir: Path) -> str | None:
    p = _docid_path(draft_dir)
    return p.read_text(encoding="utf-8").strip() if p.exists() else None


def save_doc_id(draft_dir: Path, doc_id: str):
    p = _docid_path(draft_dir)
    p.write_text(doc_id, encoding="utf-8")
    print(f"[gdoc] Doc ID saved -> {p}")


# ---------------------------------------------------------------------------
# Build + send
# ---------------------------------------------------------------------------

def _batch_update(docs_service, doc_id: str, requests: list[dict]):
    import time
    for attempt in range(5):
        try:
            return docs_service.documents().batchUpdate(
                documentId=doc_id, body={"requests": requests}
            ).execute()
        except HttpError as e:
            if e.resp.status == 429 and attempt < 4:
                wait = 15 * (2 ** attempt)
                print(f"  [rate limit] waiting {wait}s before retry {attempt + 1}/4...")
                time.sleep(wait)
            else:
                raise


def _send_requests(docs_service, doc_id: str, requests: list[dict], chunk: int = 50):
    import time
    total = len(requests)
    for i in range(0, total, chunk):
        _batch_update(docs_service, doc_id, requests[i:i + chunk])
        print(f"  ...{min(i + chunk, total)}/{total}")
        time.sleep(1)


def build_requests(doc_title: str, blog_body: str | None, linkedin_body: str | None) -> list[dict]:
    b = DocBuilder()
    b.heading(doc_title, 1)
    b.blank()
    if blog_body:
        b.heading("BLOG POST", 2)
        b.blank()
        render_markdown_body(b, blog_body, level_offset=1)
    if linkedin_body:
        b.heading("LINKEDIN POST", 2)
        b.blank()
        render_markdown_body(b, linkedin_body, level_offset=1)
    return b.requests


def wipe_doc(docs_service, doc_id: str):
    doc = docs_service.documents().get(documentId=doc_id).execute()
    content = doc.get("body", {}).get("content", [])
    body_end = content[-1]["endIndex"] if content else 1
    if body_end > 2:
        _batch_update(docs_service, doc_id, [
            {"deleteContentRange": {"range": {"startIndex": 1, "endIndex": body_end - 1}}}
        ])


def move_to_folder(drive_service, doc_id: str, folder_id: str):
    meta    = drive_service.files().get(fileId=doc_id, fields="parents").execute()
    parents = meta.get("parents", [])
    drive_service.files().update(
        fileId=doc_id,
        addParents=folder_id,
        removeParents=",".join(parents),
        fields="id,parents",
    ).execute()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Export an OpenRateLab draft folder -> Google Doc")
    parser.add_argument("--draft", required=True, help="Path to the draft folder (contains blog.md and/or linkedin.md)")
    parser.add_argument("--folder-id", default=None, help="Drive folder ID to place the doc in (else uses drive-folder-id.txt, else Drive root)")
    parser.add_argument("--open", action="store_true", help="Open doc in browser after export")
    args = parser.parse_args()

    draft_dir = Path(args.draft)
    if not draft_dir.exists():
        print(f"[error] Draft folder not found: {draft_dir}", file=sys.stderr)
        sys.exit(1)

    blog_path = draft_dir / "blog.md"
    linkedin_path = draft_dir / "linkedin.md"
    if not blog_path.exists() and not linkedin_path.exists():
        print(f"[error] No blog.md or linkedin.md found in {draft_dir}", file=sys.stderr)
        sys.exit(1)

    blog_title, blog_body = (None, None)
    if blog_path.exists():
        blog_title, blog_body = parse_content_file(blog_path)

    linkedin_body = None
    if linkedin_path.exists():
        _, linkedin_body = parse_content_file(linkedin_path)

    doc_title = blog_title or draft_dir.name
    print(f"[gdoc] {draft_dir.name} -> '{doc_title}'")

    print("[gdoc] Authenticating...")
    creds        = get_credentials()
    docs_service = build("docs", "v1", credentials=creds)
    drive_service = build("drive", "v3", credentials=creds)

    existing_doc_id = load_doc_id(draft_dir)
    doc_id = None
    if existing_doc_id:
        try:
            docs_service.documents().get(documentId=existing_doc_id).execute()
            doc_id = existing_doc_id
            print(f"[gdoc] Found existing doc ({doc_id}) -> rebuilding body...")
            wipe_doc(docs_service, doc_id)
        except HttpError:
            print("[gdoc] Saved doc ID not accessible -> creating a new document.")
            doc_id = None

    if not doc_id:
        print(f"[gdoc] Creating new document: '{doc_title}'...")
        doc    = docs_service.documents().create(body={"title": doc_title}).execute()
        doc_id = doc["documentId"]
        save_doc_id(draft_dir, doc_id)

        folder_id = args.folder_id
        if not folder_id and DEFAULT_FOLDER_ID_FILE.exists():
            folder_id = DEFAULT_FOLDER_ID_FILE.read_text(encoding="utf-8").strip()
        if folder_id:
            print(f"[gdoc] Moving to folder {folder_id}...")
            move_to_folder(drive_service, doc_id, folder_id)
        else:
            print("[gdoc] No folder set — doc created at Drive root. "
                  f"Pass --folder-id or save one to {DEFAULT_FOLDER_ID_FILE.name} to auto-place future docs.")

    requests = build_requests(doc_title, blog_body, linkedin_body)
    print(f"[gdoc] Sending {len(requests)} requests...")
    _send_requests(docs_service, doc_id, requests)

    doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
    print(f"\n[ok] Done")
    print(f"  Title: {doc_title}")
    print(f"  URL:   {doc_url}\n")

    if args.open:
        webbrowser.open(doc_url)


if __name__ == "__main__":
    main()
