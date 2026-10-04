#!/usr/bin/env python3
"""Stage licensed APIO 2023/24 and EGOI 2024/25 official Uzbek task archives.

Upstream revisions are pinned. Original PDFs are cached and their verified mirror
metadata is included in the candidate; publication of the corpus and promotion
remain separate release steps.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

from problem_staging import stage_catalog
from pypdf import PdfReader
from sync_ioi_2026_archive import clean_pdf_text, fetch

ROOT = Path(__file__).resolve().parents[1]
VERIFIED_ON = "2026-10-04"
MIRROR_ROOT = "https://raw.githubusercontent.com/cp-uz/problem-statements/main"
REPOSITORIES = {
    "apio-2023": (
        "apio2023/apio2023_tasks",
        "af6519ce925e3489a07ed4248a4fb10860246e8a",
    ),
    "apio-2024": (
        "APIO-2024/apio2024_tasks",
        "01679c43ad7cdd9514bc2e74681b71c63ef90eb1",
    ),
    "egoi-2024": (
        "zehnsechs/egoi-2024-testdata",
        "47fefa0ff64124f7fd8421aa12b77ad689a0fb29",
    ),
    "egoi-2025": ("egoi-org/egoi-2025", "e3bb2be66c3a837c57c7f8eac3b5173f40129e13"),
}
DATES = {
    ("apio-2023", 0): "20-may, 2023",
    ("apio-2024", 0): "18-may, 2024",
    ("egoi-2024", 1): "23-iyul, 2024",
    ("egoi-2024", 2): "25-iyul, 2024",
    ("egoi-2025", 1): "16-iyul, 2025",
    ("egoi-2025", 2): "18-iyul, 2025",
}
SAMPLE_COUNTS = {
    ("egoi-2024", "infiniterace2"): 5,
    ("egoi-2024", "bouquet"): 5,
    ("egoi-2024", "teamcoding"): 4,
    ("egoi-2024", "circlepassing"): 5,
    ("egoi-2024", "bikeparking"): 5,
    ("egoi-2024", "makethemmeet"): 1,
    ("egoi-2025", "giftboxes"): 6,
    ("egoi-2025", "monstergo"): 1,
    ("egoi-2025", "windturbines"): 7,
    ("egoi-2025", "stringproblem"): 4,
    ("egoi-2025", "currents"): 4,
    ("egoi-2025", "imo"): 4,
}


@dataclass(frozen=True)
class Task:
    event: str
    day: int
    order: int
    archive_slug: str
    title: str
    original_title: str
    time_limit_ms: int
    memory_limit_mb: int = 1024
    problem_type: str = "standard"

    @property
    def year(self) -> int:
        return int(self.event.rsplit("-", 1)[1])

    @property
    def season(self) -> str:
        return f"{self.year - 1}-{self.year}"

    @property
    def slug(self) -> str:
        return "infiniterace" if self.archive_slug == "infiniterace2" else self.archive_slug

    @property
    def set_slug(self) -> str:
        return f"day-{self.day}" if self.day else "contest"

    @property
    def code(self) -> str:
        return chr(ord("A") + self.order - 1)

    @property
    def label(self) -> str:
        return self.event.replace("-", " ").upper()

    @property
    def raw_root(self) -> str:
        repo, revision = REPOSITORIES[self.event]
        return f"https://raw.githubusercontent.com/{repo}/{revision}"

    @property
    def repository_url(self) -> str:
        repo, revision = REPOSITORIES[self.event]
        return f"https://github.com/{repo}/tree/{revision}"

    @property
    def statement_url(self) -> str:
        if self.event.startswith("apio"):
            return f"{self.raw_root}/statements/{self.archive_slug}/uz_UZ.pdf"
        return f"{self.raw_root}/day{self.day}/{self.archive_slug}/attachments/statement_uz-UZ.pdf"

    @property
    def original_url(self) -> str:
        if self.event.startswith("apio"):
            return f"{self.raw_root}/statements/{self.archive_slug}/ISC.pdf"
        if self.year == 2025:
            return f"https://www.egoi2025.de/wp-content/uploads/2025/07/{self.archive_slug}-ISC.pdf"
        return f"{self.raw_root}/day{self.day}/{self.archive_slug}/attachments/statement-ISC.pdf"

    @property
    def practice_url(self) -> str:
        if self.archive_slug == "gardendecorations":
            return "https://qoj.ac/problem/9185"
        prefix = self.event.split("-", 1)[0].upper()
        return f"https://oj.uz/problem/view/{prefix}{self.year % 100:02d}_{self.archive_slug}"


TASKS = (
    Task("apio-2023", 0, 1, "cyberland", "Cyberland", "Cyberland", 2500, 2048),
    Task("apio-2023", 0, 2, "sequence", "Ketma-ketlik", "Sequence", 1500, 2048),
    Task(
        "apio-2023",
        0,
        3,
        "abc",
        "Alisa, Bob va Sxema",
        "Alice, Bob and Circuit",
        10000,
        2048,
        "two_step",
    ),
    Task("apio-2024", 0, 1, "september", "September", "September", 1000),
    Task("apio-2024", 0, 2, "train", "Train", "Train", 1000),
    Task(
        "apio-2024",
        0,
        3,
        "show",
        "Magic Show",
        "Magic Show",
        1000,
        problem_type="two_step",
    ),
    Task("egoi-2024", 1, 1, "infiniterace2", "Cheksiz poyga", "Infinite Race", 1000),
    Task("egoi-2024", 1, 2, "bouquet", "Buket", "Bouquet", 3000),
    Task("egoi-2024", 1, 3, "teamcoding", "Jamoaviy dasturlash", "Team Coding", 4000),
    Task(
        "egoi-2024",
        1,
        4,
        "gardendecorations",
        "Bog‘ dekoratsiyalari",
        "Garden Decorations",
        7000,
        problem_type="communication",
    ),
    Task(
        "egoi-2024",
        2,
        1,
        "circlepassing",
        "Aylana bo‘ylab uzatmalar",
        "Circle Passing",
        2000,
    ),
    Task("egoi-2024", 2, 2, "bikeparking", "Velosiped turargohi", "Bikeparking", 1000),
    Task(
        "egoi-2024",
        2,
        3,
        "lightbulbs",
        "Chiroqlar",
        "Light Bulbs",
        4000,
        problem_type="interactive",
    ),
    Task(
        "egoi-2024",
        2,
        4,
        "makethemmeet",
        "Uchrashuv tashkillashtiring",
        "Make them Meet",
        9000,
    ),
    Task("egoi-2025", 1, 1, "giftboxes", "Sovg‘a qutilari", "Gift Boxes", 2000),
    Task(
        "egoi-2025",
        1,
        2,
        "darkride",
        "Qorong‘uda sayohat",
        "Dark Ride",
        1000,
        problem_type="interactive",
    ),
    Task("egoi-2025", 1, 3, "monstergo", "Monster-Go", "Monster-Go", 1000),
    Task("egoi-2025", 1, 4, "windturbines", "Shamol turbinalari", "Wind Turbines", 4000),
    Task("egoi-2025", 2, 1, "stringproblem", "Torlar masalasi", "A String Problem", 2000),
    Task("egoi-2025", 2, 2, "currents", "Oqimlar", "Currents", 3000),
    Task("egoi-2025", 2, 3, "imo", "IMO", "IMO", 6000),
    Task(
        "egoi-2025",
        2,
        4,
        "laserstrike",
        "Laser Strike",
        "Laser Strike",
        3000,
        problem_type="two_step",
    ),
)


def dump(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def cached_pdf(task: Task, cache_root: Path) -> bytes:
    path = cache_root / task.event / f"{task.archive_slug}.uz.pdf"
    if path.exists():
        payload = path.read_bytes()
    else:
        payload = fetch(task.statement_url)
        if not payload.startswith(b"%PDF"):
            raise ValueError(f"Not a PDF: {task.statement_url}")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
    PdfReader(io.BytesIO(payload))
    return payload


def finish_statement(task: Task, payload: bytes, body: str) -> str:
    # Historical EGOI PDFs use several header/footer variants, including the
    # public code `infiniterace` in the directory called `infiniterace2`.
    aliases = {task.archive_slug, task.slug}
    if task.archive_slug == "gardendecorations":
        aliases.add("gardendecoration")
    for alias in aliases:
        body = re.sub(
            rf"(?im)^\s*(?:\*\*)?{re.escape(alias)}\s*\(\d+ of \d+\)(?:\*\*)?\s*$",
            "",
            body,
        )
    body = re.sub(
        r"(?im)^\s*(?:\*\*)?(?:Day\s*[12]\s+Tasks|Uzbek\s*\([^)]*\)|"
        r"APIO(?:20\d\d)?\s+Tasks|European Girls['’]?|Olympiad in Informatics|"
        r"The Netherlands|21\s*[–-]\s*27 July 2024)(?:\*\*)?\s*$",
        "",
        body,
    )
    body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"
    # Remove the redundant limit table; the same verified values are metadata.
    body = re.sub(r"(?m)^\|\*\*(?:Problem Name|Masala nomi).*\n(?:\|.*\n){3}", "", body)
    source_text = "\n".join(
        page.extract_text() or "" for page in PdfReader(io.BytesIO(payload)).pages
    )
    source_words = set(re.findall(r"[A-Za-zʻ’']{5,}", source_text.lower()))
    missing = source_words - set(re.findall(r"[A-Za-zʻ’']{5,}", body.lower()))
    # Header boilerplate and normalized apostrophes may differ. Large loss is a
    # parsing error and must never silently publish an abbreviated statement.
    if len(body) < 1000 or len(missing) > max(25, len(source_words) // 5):
        raise ValueError(
            f"Incomplete extraction for {task.event}/{task.slug}: {len(missing)} missing words"
        )
    body = repair_math(task, body)
    # Avoid leaking a section's first sentence into its Markdown heading.
    body = re.sub(r"(?m)^(## (?:Chiquvchi ma[^\n]*?|Chiqish)) (\$Q\$.*)$", r"\1\n\n\2", body)
    if task.event.startswith("egoi"):
        license_url = (
            f"{task.repository_url.replace('/tree/', '/blob/')}"
            f"/day{task.day}/{task.archive_slug}/problem.yaml"
        )
        body += (
            f"\n---\n\nManba: [{task.label} rasmiy masalalar arxivi]({task.repository_url}). "
            f"[Litsenziya: CC BY-SA]({license_url}).\n"
        )
    elif task.year in (2023, 2024):
        body += (
            f"\n---\n\nManba: [{task.label} rasmiy masalalar arxivi]({task.repository_url}). "
            f"[Litsenziya: CC0 1.0]({task.repository_url.replace('/tree/', '/blob/')}/LICENSE).\n"
        )
    return body


def extract_statement(task: Task, payload: bytes) -> str:
    body = clean_pdf_text(task, payload, source_name=f"{task.label} rasmiy arxividagi")
    return finish_statement(task, payload, body)


def repair_math(task: Task, body: str) -> str:
    """Restore formula layout verified against the original rendered PDFs."""
    # These source PDFs encode exponents as positioned glyphs; PDF text readers
    # otherwise concatenate them into an entirely different numerical bound.
    body = re.sub(r"(?<![\w])10(100|18|9|8|7|6|5|4|3|2)(?!\d)", r"10^{\1}", body)
    parts = re.split(r"(\$\$[\s\S]*?\$\$|\$[^$\n]*\$)", body)
    for index in range(0, len(parts), 2):
        parts[index] = re.sub(r"10\^\{(\d+)\}", r"$10^{\1}$", parts[index])
    body = "".join(parts)
    for _ in range(3):
        body = re.sub(
            r"(\$[^$\n]*\b\d+)\$[ \t]+(\d{3})(?!\d)",
            lambda match: match.group(1) + match.group(2) + "$",
            body,
        )
    body = re.sub(r"(\$[\d.]+)\$\s*[×⋅]\s*\$(10\^\{\d+\})\$", r"\1 \\cdot \2$", body)
    body = re.sub(
        r"(?m)^## (Cheklovlar|Chegaralar)\s*\n\s*va baholash",
        r"## \1 va baholash",
        body,
    )
    body = re.sub(
        r"(?m)^## Amalga oshirish\s*\n\s*tafsilotlari",
        "## Amalga oshirish tafsilotlari",
        body,
    )
    body = re.sub(r"(?m)^(## (?:Cheklovlar|Chegaralar) va baholash) (\$.*)$", r"\1\n\n\2", body)
    body = re.sub(r"_([a-z])i_", lambda match: "$" + match.group(1) + "_i$", body)
    if task.event == "apio-2023" and task.slug == "cyberland":
        bounds = r"""## Chegaralar

- $2\le N\le10^5$, barcha chaqiruvlardagi $N$ lar yig‘indisi $10^5$ dan oshmaydi.

- $0\le M\le\min(10^5,N(N-1)/2)$, barcha chaqiruvlardagi $M$ lar yig‘indisi $10^5$ dan oshmaydi.

- $1\le K\le10^6$ va $1\le H<N$.

- $0\le x[i],y[i]<N$, $x[i]\ne y[i]$ va $1\le c[i]\le10^9$.

- $arr[i]\in\{0,1,2\}$.

Ikki mamlakat ko‘pi bilan bitta yo‘l bilan bog‘langanligi kafolatlanadi.

"""
        body = re.sub(r"(?ms)^## Chegaralar.*?(?=^## Qism masalalar)", lambda _: bounds, body)
        body = re.sub(
            r"(?m)^\*\*Aytaylik sizning dasturingiz qaytargan javob.*$",
            lambda _: (
                r"Dasturingiz qaytargan javob $ans_1$, asl natija $ans_2$ bo‘lsin. "
                r"Javob $\frac{|ans_1-ans_2|}{\max(ans_2,1)}\le10^{-6}$ "
                r"bo‘lsa to‘g‘ri hisoblanadi."
            ),
            body,
        )
    if task.event == "apio-2023" and task.slug == "abc":
        body = body.replace("ya'ni, 216", "ya'ni, $2^{16}$")
        body = body.replace("_<u>n</u>_ $2 \\le m \\le n$ 2", r"$n/2\le m\le n^2$")
        formula = r"$$f(p,x_0,x_1)=\left\lfloor\frac{p}{2^{x_0+2x_1}}\right\rfloor\bmod 2.$$"
        body = body.replace(
            "Quyida sizga foydali bo'lishi",
            formula + "\n\nQuyida sizga foydali bo'lishi",
        )
        body = re.sub(
            r"(?ms)^\|\$x .*?\n(?=## Kod yozish)",
            "| $x_0$ | $x_1$ | AND ($p=8$) | OR ($p=14$) | XOR ($p=6$) | NOT $x_0$ ($p=5$) |\n"
            "|---|---|---|---|---|---|\n| 0 | 0 | 0 | 0 | 0 | 1 |\n"
            "| 1 | 0 | 0 | 1 | 1 | 0 |\n| 0 | 1 | 0 | 1 | 1 | 1 |\n"
            "| 1 | 1 | 1 | 1 | 0 | 0 |\n\n",
            body,
        )
    if task.event == "apio-2023" and task.slug == "sequence":
        definitions = (
            r"- $W(l,r,x)=\sum_{i=l}^{r} I[A[i]=x]$: $A[l],\ldots,A[r]$ "
            r"ichida $x$ ning uchrashlar soni."
            "\n\n"
            r"- Bo‘sh bo‘lmagan $B[0],\ldots,B[k-1]$ ketma-ketlikni o‘sish tartibida saralab, "
            r"$C[0],\ldots,C[k-1]$ ni hosil qiling. Uning medianalari to‘plami:"
            "\n\n"
            r"$$S(\{B[0],\ldots,B[k-1]\})=\left\{C\left[\left\lfloor\frac{k-1}{2}"
            r"\right\rfloor\right],C\left[\left\lceil\frac{k-1}{2}\right\rceil\right]\right\}.$$"
            "\n\n"
            r"Masalan, $S(\{6,3,5,4,6,2,3\})=\{4\}$, $S(\{4,2,3,1\})=\{2,3\}$ "
            r"va $S(\{5,4,2,4\})=\{4\}$."
            "\n\n"
            r"$S(l,r)$ orqali $A[l],\ldots,A[r]$ ketma-ketligining medianalari to‘plamini "
            r"belgilaymiz. Alisa quyidagi eng katta qiymatni topishni istaydi:"
            "\n\n"
            r"$$\max_{0\le l\le r\le N-1}\ \max_{x\in S(l,r)} W(l,r,x).$$"
            "\n\n"
            r"Alisa javobni topib bo‘lgan bo‘lsa-da, natijasini tasdiqlash uchun yordam izlamoqda. "
            r"Sizdan shu javobni hisoblovchi dastur yozish so‘raladi."
            "\n\n"
        )
        body = re.sub(r"(?ms)^- \$r\$.*?(?=^## Kod yozish)", lambda _: definitions, body)
    if task.event == "apio-2024" and task.slug == "september":
        body = body.replace(
            "int solve(int N, int M, std::vector F, std::vector> S);",
            "int solve(int N, int M, std::vector<int> F, std::vector<std::vector<int>> S);",
        )
        body = re.sub(
            r"(?m)^- ∑ _NM_.*$",
            lambda _: (
                r"- Barcha chaqiruvlardagi $N\cdot M$ lar yig‘indisi $8\cdot10^5$ dan oshmaydi."
            ),
            body,
        )
    if task.event == "apio-2024" and task.slug == "show":
        body = re.sub(
            r"⌊ _<u>n</u>_ −2 <u>2</u> ⌋",
            lambda _: r"$\left\lfloor(n-2)/2\right\rfloor$",
            body,
        )
        body = body.replace("18 $1 \\le X \\le 10$ .", r"$1\le X\le10^{18}$.")
    if task.event.startswith("apio"):
        body = re.sub(
            r"(?m)^((?:double|int|long long|std::vector)[^\n]*\);)$",
            lambda match: "```cpp\n" + match.group(1) + "\n```",
            body,
        )
    formulas = {
        "gardendecorations": (
            r"$$\mathrm{score}=S_g\left(1-\frac12\log_{10}"
            r"\frac{\max(W_g,3)}{3}\right).$$"
        ),
        "makethemmeet": (
            r"$$\mathrm{score}=\left\lfloor S_g\min\left(1,"
            r"\frac{2000}{K_g+1900}+\frac15\right)\right\rfloor.$$"
        ),
        "laserstrike": r"$$\mathrm{score}=S_g\left(1-0.3\log_{10}\max(K,1)\right).$$",
        "lightbulbs": (
            r"$$\mathrm{score}=\begin{cases}(2000-Q)\cdot29/900,&200\le Q\le2000,"
            r"\\58+(200-Q)\cdot4/23,&85\le Q\le200,\\78,&Q\le85.\end{cases}$$"
        ),
    }
    if task.slug in formulas:
        # The layout reader classifies these display equations as picture text.
        body = re.sub(
            r"((?:quyidagi formula (?:bo'yicha (?:ball|baho) olasiz|orqali hisoblanadi)"
            r"|quyidagicha ball olasiz):)\s*",
            lambda m: m.group(1) + "\n\n" + formulas[task.slug] + "\n\n",
            body,
            count=1,
        )
        body = body.replace("_Sg_", "$S_g$").replace("_Wg_", "$W_g$").replace("_Kg_", "$K_g$")
    if task.slug == "lightbulbs":
        body = body.replace("$ N$ 2 ta chiroq", "$N^2$ ta chiroq")
    if task.slug == "makethemmeet":
        body = re.sub(r"(?m)^- \$N \$ <u>\(</u> \$ N - 1\$\)\s*\n", "", body)
        body = re.sub(r"(?m)^- \$N - 1.*?\.$", lambda _: r"- $N-1\le M\le N(N-1)/2$.", body)
        body = re.sub(
            r"(?m)^\|2\|13\|.*$",
            lambda _: r"|2|13|$M=N(N-1)/2$, ya’ni graf to‘liq.|",
            body,
        )
    if task.slug == "circlepassing":
        body = re.sub(r"(?m)^\|3\|22\|.*$", lambda _: r"|3|22|$N\le10^7$ va $M,Q\le1000$.|", body)
        body = re.sub(
            r"(?ms)^- \$2 \\le N.*?(?=Yechimingiz)",
            lambda _: (
                r"""- $2\le N\le5\cdot10^8$.

- $1\le M\le5\cdot10^5$, $M\le N$ va $1\le Q\le2\cdot10^4$.

- $0\le k_0<k_1<\cdots<k_{M-1}<N$.

- $0\le x_i,y_i<2N$ va $x_i\ne y_i$.

"""
            ),
            body,
        )
    if task.slug == "teamcoding":
        body = body.replace(
            "## Cheklovlar va baholash\n\n",
            "## Cheklovlar va baholash\n\n" + r"- $1\le N\le10^5$ va $1\le K\le N$." + "\n\n",
            1,
        )
    if task.slug == "bikeparking":
        body = re.sub(
            r"(?ms)^- \$1 \\le N.*?(?=Yechimingiz)",
            lambda _: (
                r"""- $1\le N\le3\cdot10^5$.

- $0\le x_i,y_i\le10^9$ barcha $0\le i<N$ uchun.

- $\sum_{i=0}^{N-1}y_i\le\sum_{i=0}^{N-1}x_i\le10^9$.

"""
            ),
            body,
        )
    if task.slug == "darkride":
        body = body.replace(
            "## Chegaralar va baholash\n\n",
            "## Chegaralar va baholash\n\n"
            + r"- $3\le N\le30000$."
            + "\n\n- Ko‘pi bilan 30 ta sayohat amalga oshirishingiz mumkin; "
            "yakuniy javob sayohat hisoblanmaydi. "
            "Limitdan oshilsa, `Wrong Answer` beriladi.\n\n",
            1,
        )
        body = re.sub(
            r"(?m)^\|4\|16\|.*$",
            lambda _: (
                r"|4|16|$N$ juft; bir chekka xona o‘tkazgichi $0\le A<N/2$, "
                r"ikkinchisi $N/2\le B<N$ oralig‘ida.|"
            ),
            body,
        )
        body = re.sub(r"(?m)^### \$3 \\le N \\le 30000\$\.\s*\n", "", body)
        body = re.sub(r"(?m)^- Siz koʻpi bilan 30 ta sayohat.*\n", "", body)
        body = re.sub(r"(?m)^\|\|\|\$N \$ juft son.*\n", "", body)
    if task.slug == "windturbines":
        # The Uzbek PDF accidentally uses a strict bound for endpoint N-1.
        # Match the official English statement and the sample with vertex N-1.
        body = re.sub(
            r"(?m)^- 0 ≤ \$u_i\$ , \$v_i\$ < \$N - 1\$\.$",
            lambda _: r"- $0\le u_i,v_i\le N-1$.",
            body,
        )
        body = re.sub(
            r"(?ms)^- 0 ≤ℓ≤.*?(?=Sizning yechimingiz)",
            lambda _: r"- $0\le\ell_i\le r_i\le N-1$." + "\n\n",
            body,
        )
        body = re.sub(
            r"(?m)^\|2\|11\|.*$",
            lambda _: r"|2|11|$N,M,Q\le2000$ va $\sum_i(r_i-\ell_i+1)\le2000$.|",
            body,
        )
        body = re.sub(
            r"(?m)^\|5\|16\|.*$",
            lambda _: r"|5|16|$\sum_i(r_i-\ell_i+1)\le400000$.|",
            body,
        )
    return body


def add_standard_samples(task: Task, body: str, cache_root: Path) -> str:
    count = SAMPLE_COUNTS.get((task.event, task.archive_slug), 0)
    if not count:
        return body
    # Preserve all explanatory paragraphs; replace only the PDF table, which
    # often interleaves input and output columns during extraction.
    heading = re.search(r"(?m)^## (?:Misollar|Namunalar)\s*$", body)
    if heading:
        before, examples = body[: heading.end()], body[heading.end() :]
        examples = re.sub(
            r"(?m)(?:^\|[^\n]*\n)+",
            lambda match: "" if "**Input**" in match.group() else match.group(),
            examples,
        )
        body = before + examples
    source_note = body.find("\n---\n\nManba:")
    footer = body[source_note:] if source_note >= 0 else ""
    body = body[:source_note] if source_note >= 0 else body

    def sample_file(item: tuple[int, str]) -> tuple[int, str, str]:
        index, suffix = item
        cache = cache_root / task.event / task.archive_slug / f"sample-{index}.{suffix}"
        if not cache.exists():
            url = f"{task.raw_root}/day{task.day}/{task.archive_slug}/data/sample/{index}.{suffix}"
            payload = fetch(url)
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_bytes(payload)
        return index, suffix, cache.read_text(encoding="utf-8").strip()

    items = [(index, suffix) for index in range(1, count + 1) for suffix in ("in", "ans")]
    with ThreadPoolExecutor(max_workers=8) as pool:
        values = {(index, suffix): value for index, suffix, value in pool.map(sample_file, items)}
    blocks = ["", "## Namuna testlar", ""]
    for index in range(1, count + 1):
        blocks.extend(
            [
                f"### {index}-misol",
                "",
                "**Kiruvchi ma’lumotlar**",
                "",
                "```text",
                values[index, "in"],
                "```",
                "",
                "**Chiquvchi ma’lumotlar**",
                "",
                "```text",
                values[index, "ans"],
                "```",
                "",
            ]
        )
    return body.rstrip() + "\n" + "\n".join(blocks) + footer


def links_for(task: Task) -> list[dict]:
    result = [
        {
            "kind": "original",
            "title": "Rasmiy inglizcha shart",
            "url": task.original_url,
            "platform": task.event.split("-", 1)[0].upper(),
            "is_official": True,
            "is_primary": True,
            "order": 0,
        },
        {
            "kind": "practice",
            "title": "Onlayn judge’da ishlash",
            "url": task.practice_url,
            "platform": "QOJ" if task.archive_slug == "gardendecorations" else "OJ.uz",
            "is_official": False,
            "is_primary": True,
            "order": 1,
        },
        {
            "kind": "package",
            "title": "Rasmiy testlar, grader va yechimlar",
            "url": task.repository_url,
            "platform": "GitHub",
            "is_official": True,
            "order": 2,
        },
    ]
    editorial = None
    if task.event == "egoi-2025":
        editorial = (
            f"https://www.egoi2025.de/wp-content/uploads/2025/07/{task.archive_slug}-editorial.pdf"
        )
    elif task.event == "egoi-2024" and task.archive_slug != "lightbulbs":
        code = task.slug
        editorial = f"https://stats.egoi.org/media/task_solution/{code}-editorial.pdf"
    elif task.event == "apio-2024" and task.archive_slug == "train":
        editorial = f"{task.raw_root}/train/train%20solution-EN.pdf"
    if editorial:
        result.append(
            {
                "kind": "editorial",
                "title": "Rasmiy yechim tahlili (inglizcha)",
                "url": editorial,
                "is_official": True,
                "is_primary": False,
                "order": 3,
            }
        )
    return result


def write_catalog(output_root: Path, cache_root: Path) -> None:
    for event in REPOSITORIES:
        event_tasks = [task for task in TASKS if task.event == event]
        first = event_tasks[0]
        event_root = output_root / first.season / event
        sets = list(dict.fromkeys(task.set_slug for task in event_tasks))
        dump(
            event_root / "event.json",
            {
                "document_type": "event",
                "schema_version": 1,
                "season_slug": first.season,
                "event_slug": event,
                "sets": sets,
            },
        )
        for set_slug in sets:
            tasks = [task for task in event_tasks if task.set_slug == set_slug]
            day = tasks[0].day
            set_root = event_root / set_slug
            title = f"{day}-kun" if day else "Musobaqa"
            dump(
                set_root / "set.json",
                {
                    "document_type": "problem_set",
                    "schema_version": 1,
                    "slug": set_slug,
                    "title": title,
                    "description": f"{first.label} — {title.lower()}ning rasmiy masalalari.",
                    "date_label": DATES[event, day],
                    "order": day or 1,
                    "publication_status": "published",
                    "problems": [task.slug for task in tasks],
                },
            )
            for task in tasks:
                payload = cached_pdf(task, cache_root)
                statement = extract_statement(task, payload)
                statement = add_standard_samples(task, statement, cache_root)
                problem_root = set_root / task.slug
                problem_root.mkdir(parents=True, exist_ok=True)
                (problem_root / "statement.uz.md").write_text(
                    statement, encoding="utf-8", newline="\n"
                )
                relative = f"{task.season}/{event}/{set_slug}/{task.slug}"
                dump(
                    problem_root / "problem.json",
                    {
                        "document_type": "problem",
                        "schema_version": 1,
                        "slug": task.slug,
                        "code": task.code,
                        "title": task.title,
                        "original_title": task.original_title,
                        "statement_file": "statement.uz.md",
                        "translation_status": "reviewed_translation",
                        "problem_type": task.problem_type,
                        "time_limit_ms": task.time_limit_ms,
                        "memory_limit_mb": task.memory_limit_mb,
                        "max_score": 100,
                        "difficulty_label": "Xalqaro olimpiada",
                        "tags": [task.label],
                        "order": task.order,
                        "publication_status": "published",
                        "last_verified_on": VERIFIED_ON,
                        "links": links_for(task),
                        "attachments": [
                            {
                                "title": "Rasmiy o‘zbekcha shart (PDF)",
                                "url": task.statement_url,
                                "content_type": "application/pdf",
                                "size_bytes": len(payload),
                                "order": 0,
                            }
                        ],
                        "statement_pdf": {
                            "url": f"{MIRROR_ROOT}/{relative}/statement.pdf",
                            "sha256": hashlib.sha256(payload).hexdigest(),
                            "size_bytes": len(payload),
                            "page_count": len(PdfReader(io.BytesIO(payload)).pages),
                            "language": "uz",
                            "provenance": "official",
                        },
                    },
                )
                print(
                    f"{task.label}/{set_slug}/{task.slug}: {len(statement)} characters",
                    flush=True,
                )


def repair_existing_candidate(output_root: Path, cache_root: Path) -> None:
    """Apply source-verified repairs without repeating costly layout extraction."""
    candidate_root = (ROOT / "tmp/candidates").resolve()
    if candidate_root not in output_root.resolve().parents:
        raise ValueError("Repair mode writes only an existing tmp/candidates catalog")
    for task in TASKS:
        path = (
            output_root / task.season / task.event / task.set_slug / task.slug / "statement.uz.md"
        )
        unreviewed = cache_root / task.event / f"{task.archive_slug}.extracted.uz.md"
        if not unreviewed.exists():
            source = path.read_text(encoding="utf-8").split("\n---\n\nManba:", 1)[0]
            unreviewed.parent.mkdir(parents=True, exist_ok=True)
            unreviewed.write_text(source, encoding="utf-8", newline="\n")
        body = finish_statement(
            task, cached_pdf(task, cache_root), unreviewed.read_text(encoding="utf-8")
        )
        body = add_standard_samples(task, body, cache_root)
        path.write_text(body, encoding="utf-8", newline="\n")
        print(f"Reviewed {task.event}/{task.slug}: {len(body)} characters", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-root",
        type=Path,
        default=ROOT / "tmp/candidates/historical-apio-egoi-20261004",
    )
    parser.add_argument(
        "--cache-root",
        type=Path,
        default=ROOT / "tmp/historical-task-archives/apio-egoi",
    )
    parser.add_argument("--repair-existing", action="store_true")
    args = parser.parse_args()
    if args.repair_existing:
        repair_existing_candidate(args.output_root, args.cache_root)
    else:
        stage_catalog(args.output_root, lambda root: write_catalog(root, args.cache_root))
    print(f"APIO/EGOI: {len(TASKS)} official Uzbek statements staged.")


if __name__ == "__main__":
    main()
