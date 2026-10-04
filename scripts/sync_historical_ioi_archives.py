"""Stage 18 officially translated IOI 2023–2025 final tasks (CC BY).

IOI 2025 publishes translations as ZIPs; the corpus builder extracts the exact
uz_UZ.pdf member without modifying it. Existing canonical content is untouched.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import io
import re
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

import pymupdf
from problem_staging import stage_catalog
from sync_ioi_2026_archive import Task as ExtractionTask
from sync_ioi_2026_archive import clean_pdf_text, dump

ROOT = Path(__file__).resolve().parents[1]
VERIFIED_ON = "2026-10-04"


@dataclass(frozen=True)
class Task:
    year: int
    day: int
    order: int
    code: str
    original_title: str
    title: str
    problem_type: str = "standard"
    archive_folder: str = ""

    @property
    def archive_root(self) -> str:
        return f"https://ioi.te.lv/locations/ioi{self.year % 100}/contest"

    @property
    def pdf_source(self) -> str:
        if self.year == 2025:
            return f"{self.archive_root}/day{self.day}/{self.code}_pdf.zip"
        folder = self.archive_folder or self.code
        prefix = f"{self.archive_root}/day{self.day}/{folder}"
        return f"{prefix}/{'statements/' if self.year == 2024 else ''}uz_UZ.pdf"

    @property
    def original_url(self) -> str:
        if self.year == 2025:
            return f"{self.archive_root}/day{self.day}/{self.code}-ISC.pdf"
        prefix = f"{self.archive_root}/day{self.day}/{self.archive_folder or self.code}"
        suffix = f"d{self.day}-{self.code}-ISC.pdf" if self.year == 2023 else "statements/en.pdf"
        return f"{prefix}/{suffix}"


TASKS = (
    Task(2023, 1, 1, "closing", "Closing Time", "Yopilish vaqti", archive_folder="Closing"),
    Task(
        2023, 1, 2, "longesttrip", "Longest Trip", "Eng uzun sayohat", "interactive", "Longesttrip"
    ),
    Task(2023, 1, 3, "soccer", "Soccer Stadium", "Futbol stadioni", archive_folder="Soccer"),
    Task(2023, 2, 1, "beechtree", "Beech Tree", "Olxa daraxti", archive_folder="Beechtree"),
    Task(2023, 2, 2, "overtaking", "Overtaking", "Quvib o‘tish", archive_folder="Overtaking"),
    Task(2023, 2, 3, "robot", "Robot Contest", "Robotlar musobaqasi", archive_folder="Robot"),
    Task(2024, 1, 1, "nile", "Nile", "Nil"),
    Task(2024, 1, 2, "message", "Message", "Xabar", "communication"),
    Task(2024, 1, 3, "tree", "Tree", "Daraxt"),
    Task(2024, 2, 1, "hieroglyphs", "Hieroglyphs", "Iyerogliflar"),
    Task(2024, 2, 2, "mosaic", "Mosaic", "Mozaika"),
    Task(2024, 2, 3, "sphinx", "Sphinx's Riddle", "Sfinksning topishmog‘i", "interactive"),
    Task(2025, 1, 1, "souvenirs", "Souvenirs", "Suvenirlar", "interactive"),
    Task(2025, 1, 2, "triples", "Triple Peaks", "Uchta cho‘qqi"),
    Task(2025, 1, 3, "worldmap", "World Map", "Dunyo xaritasi"),
    Task(2025, 2, 1, "festival", "Festival", "Festival"),
    Task(2025, 2, 2, "migrations", "Migrations", "Migratsiyalar", "two_step"),
    Task(2025, 2, 3, "obstacles", "Obstacles for a Llama", "Lama uchun to‘siqlar"),
)


# Exact repairs checked against the official Uzbek PDFs, not numeric guesses.
# Nile p2: the three 9s use 8.45pt at y=324.49/340.99/357.49, 4.5pt
# above the 12.07pt baselines. Mosaic p1 has the same raised 2 after N.
# Message p3 raises Q-66 above 0.95. Sphinx p2/p3 place N(N-1) above 2.
# Closing p4 raises 18/6 above 10; Overtaking p5 similarly raises 9/18/6.
# PDF extraction otherwise loses these exponents/fractions as ordinary digits.
PDF_MATH_REPAIRS = {
    (2023, "closing"): (
        (r"$0 \le K \le 1018$", r"$0 \le K \le 10^{18}$"),
        (r"$1 \le W[j] \le 106$", r"$1 \le W[j] \le 10^6$"),
        ("$p $ $0 = a$", "$p_0 = a$"),
        ("$ p $ $0 = a $", "$p_0 = a$"),
        ("_pi_ +1", "$p_{i+1}$"),
        ("_pi_", "$p_i$"),
        ("_pt_", "$p_t$"),
        ("_SN_", "$S_N$"),
    ),
    (2023, "longesttrip"): (
        (
            "3. (25 points) $D = 1$. Let $ l$ ⋆ denote the length of a longest trip. "
            "Procedure  longest_trip does ⋆\n\n"
            "not have to return a trip of length $l$ . Instead, it should return a trip "
            "of length at least . ⌈ _<u>l</u>_ 2<sup>⋆</sup> ⌉",
            "3. (25 points) $D = 1$. Let $l^\\star$ denote the length of a longest trip. "
            "Procedure `longest_trip` does not have to return a trip of length $l^\\star$. "
            "Instead, it should return a trip of length at least $\\lceil l^\\star/2 \\rceil$.",
        ),
        (r"|2 $750 < q \le 32\,640$|20|", r"|$2\,750 < q \le 32\,640$|20|"),
        (
            "line 1 + $i $ ($1 \\le i < N $ ): $ U[0]$ _i U_ [1] $ i $ … $ U$ [ _i i_ −1]",
            r"line $1+i$ ($1 \le i < N$): $U_i[0]\;U_i[1]\;\ldots\;U_i[i-1]$",
        ),
        ("_Ui_", "$U_i$"),
        ("$U$ [ _i j_ ]", "$U_i[j]$"),
        ("$ U$ [ _i j_ ]", "$U_i[j]$"),
    ),
    (2023, "beechtree"): (
        (
            "$s = r$ x tugun T(r) ga tegishli bo'lsa, "
            "x ning barcha bolalari ham T(r) ga tegishlidir.",
            "- $s = r$.\n\n- $x$ tugun $T(r)$ ga tegishli bo'lsa, "
            "$x$ ning barcha bolalari ham $T(r)$ ga tegishlidir.",
        ),
        (
            "$ v $ 0, $ v $ 1,… , $ v $ ∣ $ T $ ( $ r$ )∣−1",
            r"$v_0,v_1,\ldots,v_{|T(r)|-1}$",
        ),
        (
            "har bir $i$ ($1 \\le i $ < ∣ $ T $ ( $ r $ )∣) uchun, "
            "$ f $ ( $ i $ ) ning qiymati $ i - 1$ ta $ C$ [ $ v $ 1], "
            "$ C $ [ $ v $ 2],… , $ C $ [ _vi_ −1] ranglar ketmaketligidagi "
            "$ C$ [ _vi_ ] takrorlanishlar soni bo'lsin.",
            r"Har bir $i$ ($1 \le i < |T(r)|$) uchun, $f(i)$ ning qiymati "
            r"$i-1$ ta $C[v_1],C[v_2],\ldots,C[v_{i-1}]$ ranglar ketma-ketligidagi "
            r"$C[v_i]$ takrorlanishlar soni bo'lsin.",
        ),
        (
            "[ $v $ 0, $ v $ 1,… , $ v $ ∣ $ T $ ( $ r$ )∣−1]",
            r"$[v_0,v_1,\ldots,v_{|T(r)|-1}]$",
        ),
        (
            "$v $ $0 = r $ . har bir $ i $ ($1 \\le i $ < ∣ $ T $ ( $ r $ )∣) uchun, "
            "_vi_ - tugunning otasi _vf_ ( $ i$ ) ga teng.",
            r"- $v_0=r$."
            + "\n\n"
            + (
                r"- Har bir $i$ ($1 \le i < |T(r)|$) uchun, "
                r"$v_i$ tugunning otasi $v_{f(i)}$ ga teng."
            ),
        ),
        ("$v $ $0 = r = 1$.\n\n- 0", "$v_0=r=1$."),
    ),
    (2023, "soccer"): (
        (
            "( $ r $ 0, $ c$ 0),… ,( _rs_ −1, _cs_ −1)",
            r"$(r_0,c_0),\ldots,(r_{s-1},c_{s-1})$",
        ),
        ("( _ri_ , $c $ ) $ i$", "$(r_i,c_i)$"),
        ("_ri_ ≠ _rj_ yoki _ci_ ≠ _cj_", r"$r_i \ne r_j$ yoki $c_i \ne c_j$"),
        (
            "|biggest_stadium(5, [[0,|0, 0, 0, 0],|\n|---|---|\n"
            "|[1,|0, 0, 0, 0],|\n|[0,|0, 0, 0, 0],|\n"
            "|[0,|0, 0, 0, 0],|\n|[0,|0, 1, 0, 0]])|",
            "```\nbiggest_stadium(5, [[0, 0, 0, 0, 0],\n"
            "                    [1, 0, 0, 0, 0],\n"
            "                    [0, 0, 0, 0, 0],\n"
            "                    [0, 0, 0, 0, 0],\n"
            "                    [0, 0, 1, 0, 0]])\n```",
        ),
    ),
    (2023, "overtaking"): (
        (r"$1 \le L \le 109$", r"$1 \le L \le 10^9$"),
        (r"$0 \le T[i] \le 1018$", r"$0 \le T[i] \le 10^{18}$"),
        (r"$1 \le W[i] \le 109$", r"$1 \le W[i] \le 10^9$"),
        (r"$1 \le X \le 109$", r"$1 \le X \le 10^9$"),
        (r"$1 \le Q \le 106$", r"$1 \le Q \le 10^6$"),
        (r"$0 \le Y \le 1018$", r"$0 \le Y \le 10^{18}$"),
        (
            "|$i $|$ t $<br>$ i $,0|$ e $<br>$ i $,1|$ t $<br>$ i $,1|"
            "$ e $<br>$ i $,2|$ t $<br>$ i $,2|$ e $<br>$ i $,3|$ t $<br>$ i$,3|",
            "|$i$|$t_{i,0}$|$e_{i,1}$|$t_{i,1}$|$e_{i,2}$|$t_{i,2}$|$e_{i,3}$|$t_{i,3}$|",
        ),
    ),
    (2023, "robot"): (
        (
            "( $r $ 0, $ c $ 0) katakdan ( $ r $ ℓ, $ c $ ℓ) katagiga ℓ (ℓ> 0) "
            "uzunlikdagi **yo‘l** deb bir biridan farqli ( $ r $ 0, $ c $ 0),"
            "( $ r $ 1, $ c $ 1),… ,( $ r $ ℓ, $ c $ ℓ) juftliklardan tashkil topgan "
            "hamda har bir $ i $ ($0 \\le i $ < ℓ) uchun ( _ri_ , $ c $ ) $ i$ va "
            "( _ri_ +1, _ci_ +1) kataklari qoʻshni qo'shni bo'lgan ketma-ketlikka aytiladi.",
            r"$(r_0,c_0)$ katakdan $(r_\ell,c_\ell)$ katagiga $\ell$ ($\ell>0$) "
            r"uzunlikdagi **yo‘l** deb bir-biridan farqli $(r_0,c_0),(r_1,c_1),"
            r"\ldots,(r_\ell,c_\ell)$ juftliklardan tashkil topgan hamda har bir $i$ "
            r"($0 \le i < \ell$) uchun $(r_i,c_i)$ va $(r_{i+1},c_{i+1})$ "
            r"kataklari qoʻshni bo'lgan ketma-ketlikka aytiladi.",
        ),
        ("_ZMAX_", r"$Z_{\mathrm{MAX}}$"),
        ("$Z $ ⋆", r"$Z^\star$"),
        (
            "|$11 \\le Z \\le 19$<br>⋆|20 + (19 −$ Z $ )<br>⋆|12 + (19 −$ Z$ )<br>⋆|",
            r"|$11 \le Z^\star \le 19$|$20+(19-Z^\star)$|$12+(19-Z^\star)$|",
        ),
        ("|$Z = 10$<br>⋆|31|23|", r"|$Z^\star = 10$|31|23|"),
        ("|$Z = 9$<br>⋆|34|26|", r"|$Z^\star = 9$|34|26|"),
        ("|$Z = 8$<br>⋆|38|29|", r"|$Z^\star = 8$|38|29|"),
        ("|$Z = 7$<br>⋆|42|32|", r"|$Z^\star = 7$|42|32|"),
        ("|$Z \\le 6$<br>⋆|46|36|", r"|$Z^\star \le 6$|46|36|"),
    ),
    (2024, "nile"): (
        (r"$1 \le W[i] \le 109$", r"$1 \le W[i] \le 10^9$"),
        (r"$1 \le B[i] < A[i] \le 109$", r"$1 \le B[i] < A[i] \le 10^9$"),
        (r"$1 \le E[j] \le 109$", r"$1 \le E[j] \le 10^9$"),
    ),
    (2024, "message"): (
        ("## Qism masalalar\n\nva baholash", "## Qism masalalar va baholash"),
        (r"0.95 $Q - 66$", r"$0.95^{Q - 66}$"),
    ),
    (2024, "mosaic"): (("$ N $ 2 ta dastlab", "$N^2$ ta dastlab"),),
    (2024, "sphinx"): (
        (
            "$v $ 0, $ v $ 1,… , _vk_",
            r"$v_0, v_1, \ldots, v_k$",
        ),
        ("_vl_ va _vl_ +1", "$v_l$ va $v_{l+1}$"),
        ("$v$ 0, $ v $ 1,… , _vk_", r"$v_0, v_1, \ldots, v_k$"),
        ("$ v$ 0 va _vk_", "$v_0$ va $v_k$"),
        ("$ C[v]$ = _l C_ [ _vl_ +1]", "$C[v_l] = C[v_{l+1}]$"),
        (
            "- $N $ ⋅( $ N - 1$)\n\n- $N - 1 \\le M \\le 2$",
            r"- $N - 1 \le M \le \frac{N(N-1)}{2}$",
        ),
        (
            "|4|21|Graf to'liq:$M $ =<br>va ixtiyoriy ikki tugun bog'langan.<br>"
            "2<br>$ N $⋅($ N - 1$)|",
            r"|4|21|Graf to'liq: $M = \frac{N(N-1)}{2}$ va ixtiyoriy ikki tugun bog'langan.|",
        ),
    ),
}


def decode_fenced_code_entities(body: str) -> str:
    """Official MD escapes C++ angle brackets; fenced code needs literal ones."""
    output = []
    fence = None
    for line in body.splitlines():
        marker = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if fence is not None:
            if (
                marker
                and marker[1][0] == fence[0]
                and len(marker[1]) >= len(fence)
                and not marker[2].strip()
            ):
                fence = None
            else:
                line = html.unescape(line)
        elif marker:
            fence = marker[1]
        output.append(line)
    return "\n".join(output) + "\n"


def repair_2023_indices(task: Task, body: str) -> str:
    """Restore indices visually checked in each task's official definition."""
    if task.code == "closing":
        body = re.sub(r"\$\s*p\s*\$\s*([012])", r"$p_\1$", body)
        body = re.sub(
            r"\$S_N\$\s*≤(\d+(?:\s+\d{3})*)",
            lambda match: "$S_N \\le " + match[1].replace(" ", r"\,") + "$",
            body,
        )
        # Several numbered subtasks were joined into the preceding paragraph.
        body = re.sub(r" (?=[4-7]\. \(\d+ points\))", "\n\n", body)
    elif task.code == "beechtree":
        body = re.sub(r"\$\s*v\s*\$\s*([0-6])", r"$v_\1$", body)
        body = re.sub(r"_vf_\s*\(([1-6])\)", r"$v_{f(\1)}$", body)
    elif task.code == "overtaking":
        index_fragments = {
            "_ti_ ,$0 = T[i]$": "$t_{i,0} = T[i]$",
            "_tN_ ,$0 = Y $": "$t_{N,0} = Y$",
            "_ti_ , $ j - 1$": "$t_{i,j-1}$",
            "_tN_ , $ j - 1$": "$t_{N,j-1}$",
            "_tk_ , $ j - 1$": "$t_{k,j-1}$",
            "_ti_ , $ j $": "$t_{i,j}$",
            "_ti_ , $j $": "$t_{i,j}$",
            "_ei_ , $j $": "$e_{i,j}$",
            "_eN_ , $j $": "$e_{N,j}$",
            "_ek_ , $j $": "$e_{k,j}$",
            "$S[j] < S$ [ $ j $ + 1]": "$S[j] < S[j+1]$",
            "$0 = S[0] < S[1]$ < ⋯< $ S $ [ $ M - 1$] = $ L$": (
                r"$0 = S[0] < S[1] < \cdots < S[M-1] = L$"
            ),
        }
        for original, corrected in index_fragments.items():
            body = body.replace(original, corrected)
        body = re.sub(
            r"\$\s*([te])\s*\$\s*([0-3]),\s*\$([0-3])\s*=\s*([te])\s*\$\s*([0-3]),([0-3])",
            r"$\1_{\2,\3} = \4_{\5,\6}$",
            body,
        )
        body = re.sub(r"\$\s*([te])\s*\$\s*([0-3]),([0-3])", r"$\1_{\2,\3}$", body)
        body = re.sub(
            r"\$\s*S\s*\$\s*\[\s*\$\s*([^$\n]+)\$\s*\]",
            r"$S[\1]$",
            body,
        )
    elif task.code == "robot":
        body = body.replace(r"−$1 \le r \le H $", r"$-1 \le r \le H$")
        body = body.replace(r"−$1 \le c \le W $", r"$-1 \le c \le W$")
    # Only source-verified path/permutation arrays, not arbitrary italic tokens.
    if task.code in ("closing", "beechtree"):
        body = re.sub(
            r"\$\s*([CPc])\s*\$\s*\[\s*\$([^$\n]+)\$\s*\]",
            r"$\1[\2]$",
            body,
        )
        while True:
            merged = re.sub(r"\$([^$\n]+)\$\s*=\s*\$\s*([^$\n]+)\$", r"$\1 = \2$", body)
            if merged == body:
                break
            body = merged
    return body


def protect_2023_code_lines(body: str) -> str:
    output = []
    fence = False
    for line in body.splitlines():
        if line.startswith("```"):
            fence = not fence
        declaration = re.fullmatch(r"(?:void|bool|int(?:64)?(?:\[\])*) [a-z_]+\(.*\)", line)
        call = re.fullmatch(
            r"(?:max_score|longest_trip|are_connected|biggest_stadium|beechtree|init|arrival_time|program_pulibot|set_instruction)\(.*\)",
            line,
        )
        if not fence and (declaration or call):
            output.extend(("```", line, "```"))
        else:
            output.append(line)
    return "\n".join(output) + "\n"


def repair_pdf_markdown(task: Task, body: str) -> str:
    for original, corrected in PDF_MATH_REPAIRS.get((task.year, task.code), ()):
        if original in body:
            body = body.replace(original, corrected)
        elif corrected not in body:
            raise ValueError(
                f"Verified PDF math fragment missing: {task.year}/{task.code}: {original}"
            )
    if task.year == 2023:
        body = protect_2023_code_lines(repair_2023_indices(task, body))
    # Restore only grouped integer *bounds* split by the PDF math extractor;
    # this never interprets an unmarked 109/1018 as an exponent.
    body = re.sub(
        r"\$([^$\n]*(?:\\le|\\ge|[<>=])\s+)(\d{1,3})\$((?:[ \u00a0]+\d{3})+)(?!\d)",
        lambda match: "$" + match[1] + match[2] + re.sub(r"\s+", r"\\,", match[3]) + "$",
        body,
    )
    # <MSG> is a grader placeholder, not an HTML tag; preserve it in code.
    if task.year == 2023 and task.code in ("robot", "longesttrip"):
        body = re.sub(r"(?<!`)Protocol Violation: <MSG>(?!`)", "`Protocol Violation: <MSG>`", body)
        body = re.sub(r"(?<![:`]) <MSG>(?!`)", " `<MSG>`", body)
    body = re.sub(
        r"\A>[^\n]+",
        f"> IOI {task.year} rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). "
        "PDF - asosiy manba: diagrammalar, indekslar va murakkab formulalarni "
        "rasmiy PDFdan tekshiring.",
        body,
    )
    return body


def fetch(url: str, cache: Path) -> bytes:
    path = cache / hashlib.sha256(url.encode()).hexdigest()
    if not path.exists():
        request = urllib.request.Request(
            url, headers={"User-Agent": "cp.uz historical task archive"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = response.read()
        path.write_bytes(payload)
    return path.read_bytes()


def zip_member(payload: bytes, name: str) -> bytes:
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        return archive.read(name)


def statement(task: Task, pdf: bytes, cache: Path) -> str:
    if task.year == 2025:
        md_url = task.pdf_source.replace("_pdf.zip", "_md.zip")
        body = zip_member(fetch(md_url, cache), "uz_UZ.md").decode("utf-8")
        body = decode_fenced_code_entities(re.sub(r"^# .+\n", "", body, count=1))
        # Official PDFs remain authoritative for diagrams; do not publish broken
        # local image references from the translation-only Markdown archive.
        body = re.sub(r"!\[[^\]]*\]\([^)]*\)", "_Diagramma rasmiy PDFda keltirilgan._", body)
        body = "\n".join(line.rstrip() for line in body.splitlines())
        return (
            f"> IOI {task.year} rasmiy arxividagi o‘zbekcha tarjima (CC BY). "
            "Diagrammalar va asl sahifa tartibi uchun rasmiy PDFdan foydalaning.\n\n"
            + body.strip()
            + "\n"
        )
    extraction = ExtractionTask(
        task.day,
        task.order,
        task.code,
        task.code,
        task.title,
        task.original_title,
        task.problem_type,
        1,
    )
    body = clean_pdf_text(extraction, pdf, f"IOI {task.year} rasmiy arxividagi")
    body = re.sub(r"^.*(?:IOI 20\d\d Day \d Tasks|Uzbek \(UZB\)).*$", "", body, flags=re.M)
    # A PDF extraction is not a new editorial translation or technical review.
    body = re.sub(
        r"\A>[^\n]+",
        f"> IOI {task.year} rasmiy arxividagi o‘zbekcha PDFdan olingan matn (CC BY). "
        "Diagrammalar uchun rasmiy PDFdan foydalaning.",
        body,
    )
    return repair_pdf_markdown(task, body)


def write_catalog(output: Path, cache: Path) -> None:
    def download(task: Task):
        payload = fetch(task.pdf_source, cache)
        pdf = zip_member(payload, "uz_UZ.pdf") if task.year == 2025 else payload
        with pymupdf.open(stream=pdf, filetype="pdf") as document:
            if len(document) == 0 or "Uzbek" not in document[0].get_text():
                raise ValueError(f"Official Uzbek PDF could not be verified: {task.pdf_source}")
            print(f"IOI {task.year} {task.code}: {len(document)} pages", flush=True)
        return task, pdf

    with ThreadPoolExecutor(max_workers=6) as pool:
        pdfs = dict(pool.map(download, TASKS))
    for year in (2023, 2024, 2025):
        season = f"{year - 1}-{year}"
        event = f"ioi-{year}"
        event_root = output / season / event
        dump(
            event_root / "event.json",
            {
                "document_type": "event",
                "schema_version": 1,
                "season_slug": season,
                "event_slug": event,
                "sets": ["day-1", "day-2"],
            },
        )
        for day in (1, 2):
            tasks = [task for task in TASKS if task.year == year and task.day == day]
            set_root = event_root / f"day-{day}"
            dump(
                set_root / "set.json",
                {
                    "document_type": "problem_set",
                    "schema_version": 1,
                    "slug": f"day-{day}",
                    "title": f"{day}-kun",
                    "description": f"IOI {year} — {day}-musobaqa kuni, rasmiy o‘zbekcha shartlar.",
                    "order": day,
                    "publication_status": "published",
                    "problems": [task.code for task in tasks],
                },
            )
            for task in tasks:
                directory = set_root / task.code
                directory.mkdir(parents=True, exist_ok=True)
                (directory / "statement.uz.md").write_text(
                    statement(task, pdfs[task], cache), encoding="utf-8", newline="\n"
                )
                dump(
                    directory / "problem.json",
                    {
                        "document_type": "problem",
                        "schema_version": 1,
                        "slug": task.code,
                        "code": chr(64 + task.order),
                        "title": task.title,
                        "original_title": task.original_title,
                        "statement_file": "statement.uz.md",
                        "translation_status": "reviewed_translation",
                        "problem_type": task.problem_type,
                        "max_score": 100,
                        "difficulty_label": "Xalqaro olimpiada",
                        "tags": [f"IOI {year}"],
                        "order": task.order,
                        "publication_status": "published",
                        "last_verified_on": VERIFIED_ON,
                        "links": [
                            {
                                "kind": "original",
                                "title": "IOI rasmiy inglizcha sharti",
                                "url": task.original_url,
                                "platform": "IOI",
                                "is_official": True,
                                "is_primary": True,
                                "order": 0,
                            },
                            {
                                "kind": "practice",
                                "title": "OJ.uz’da ishlash",
                                "url": f"https://oj.uz/problem/view/IOI{year % 100}_{task.code}",
                                "platform": "OJ.uz",
                                "is_official": False,
                                "is_primary": True,
                                "order": 1,
                            },
                            {
                                "kind": "original",
                                "title": "Rasmiy task arxivi va CC BY litsenziyasi",
                                "url": f"{task.archive_root}/",
                                "platform": "IOI",
                                "is_official": True,
                                "is_primary": False,
                                "order": 2,
                            },
                            {
                                "kind": "editorial",
                                "title": "IOI rasmiy yechimlari (ZIP)",
                                "url": f"https://ioinformatics.org/files/ioi{year}solutions.zip",
                                "platform": "IOI",
                                "is_official": True,
                                "is_primary": False,
                                "order": 3,
                            },
                        ],
                        "attachments": [
                            {
                                "title": "Rasmiy o‘zbekcha statementlar (ZIP)"
                                if year == 2025
                                else "Rasmiy o‘zbekcha statement (PDF)",
                                "url": task.pdf_source,
                                "content_type": "application/zip"
                                if year == 2025
                                else "application/pdf",
                                "order": 0,
                            }
                        ],
                    },
                )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-root", type=Path, default=ROOT / "tmp/candidates/historical-ioi-20261004"
    )
    parser.add_argument("--cache-root", type=Path, default=ROOT / "tmp/historical-ioi-source")
    args = parser.parse_args()
    args.cache_root.mkdir(parents=True, exist_ok=True)
    stage_catalog(args.output_root, lambda output: write_catalog(output, args.cache_root))
    print(f"IOI 2023–2025: {len(TASKS)} official Uzbek tasks staged.")


if __name__ == "__main__":
    main()
