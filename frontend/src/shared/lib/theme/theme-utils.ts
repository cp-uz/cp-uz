const SYSTEM_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export function hexToRgbChannel(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Invalid hex color: ${hex}`);
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(' ');
}

export function createPaletteChannel<T extends Record<string, string>>(palette: T) {
  const channels = Object.fromEntries(
    Object.entries(palette)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => [`${key}Channel`, hexToRgbChannel(value)])
  );
  return { ...palette, ...channels };
}

function alphaPercent(alpha: number | string) {
  if (typeof alpha === 'string') {
    if (alpha.trim().endsWith('%')) return alpha.trim();
    if (alpha.includes('var(--')) return `calc(${alpha} * 100%)`;
  }
  const value = typeof alpha === 'number' ? alpha : Number.parseFloat(alpha);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`Opacity must be between 0 and 1: ${alpha}`);
  }
  return `${Number((value * 100).toFixed(2))}%`;
}

export function varAlpha(channel: string, alpha: number | string = 1) {
  if (!channel?.trim()) throw new Error('Color channel is required.');
  if (channel.toLowerCase() === 'currentcolor') {
    return `color-mix(in srgb, currentColor ${alphaPercent(alpha)}, transparent)`;
  }
  return `rgba(${channel} / ${alphaPercent(alpha)})`;
}

export function parseCssVar(value: string) {
  return value.match(/var\(\s*(--[\w-]+)(?:\s*,[^)]*)?\s*\)/)?.[1] ?? '';
}

export function setFont(fontFamily?: string) {
  return fontFamily ? `"${fontFamily}", ${SYSTEM_FONT_STACK}` : SYSTEM_FONT_STACK;
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function remToPx(value: string) {
  return Math.round(Number.parseFloat(value) * 16);
}

export function noRtlFlip(value: string) {
  const normalized = value.trim();
  return normalized.includes('/* @noflip */') ? normalized : `${normalized} /* @noflip */`;
}

export function mergeClasses(
  base: string | Array<string | undefined> | undefined,
  states?: Record<string, boolean | [boolean, string | undefined] | undefined>
) {
  const baseClasses = base ? (Array.isArray(base) ? base : [base]) : [];
  const stateClasses = Object.entries(states ?? {}).flatMap(([name, state]) => {
    if (Array.isArray(state)) return state[0] && state[1] ? [state[1]] : [];
    return state ? [name] : [];
  });
  return [...baseClasses, ...stateClasses].filter(Boolean).join(' ');
}
