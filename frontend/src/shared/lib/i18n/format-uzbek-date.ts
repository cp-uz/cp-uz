const UZBEK_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
] as const;

type DateInput = Date | string | number | null | undefined;

function renderDate(year: number, month: number, day: number) {
  const monthName = UZBEK_MONTHS[month - 1];
  if (!monthName) return '';

  const candidate = new Date(Date.UTC(year, month - 1, day));
  const valid =
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day;

  return valid ? `${day}-${monthName}, ${year}` : '';
}

/** Formats visible dates consistently without relying on browser locale data. */
export function formatUzbekDate(value: DateInput) {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'string') {
    const source = value.trim();
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})(?:T|\s|$)/.exec(source);
    const legacyIntlDate = /^(\d{4})\s+M(\d{2})\s+(\d{1,2})$/i.exec(source);
    const match = isoDate ?? legacyIntlDate;

    if (match) {
      const formatted = renderDate(Number(match[1]), Number(match[2]), Number(match[3]));
      return formatted || source;
    }

    const parsed = new Date(source);
    if (Number.isNaN(parsed.getTime())) return source;
    return renderDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate()) || source;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return renderDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate());
}
