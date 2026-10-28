import type { SVGProps } from 'react';

import { resolveAlgorithmPattern } from './patterns';

type AlgorithmIconProps = SVGProps<SVGSVGElement> & { topic?: string; size?: number | string };

const paths = {
  algebra: (
    <>
      <path d="M15 10 9 38M29 10l-6 28M7 19h29M5 29h29" />
      <circle cx="38" cy="36" r="5" fill="currentColor" fillOpacity=".12" />
      <path d="m36 36 1.5 1.5L40 34" />
    </>
  ),
  combinatorics: (
    <>
      <path d="m24 9-9 12m9-12 9 12M15 23 8 36m7-13 9 13m9-13-9 13m9-13 7 13" />
      {[
        [24, 8],
        [15, 23],
        [33, 23],
        [8, 38],
        [24, 38],
        [40, 38],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="var(--palette-background-paper)" />
      ))}
    </>
  ),
  'data-structures': (
    <>
      <path d="M24 14v5M13 26v-7h22v7M7 38v-6h12v6m10 0v-6h12v6M13 29v3m22-3v3" />
      <rect x="18" y="5" width="12" height="9" rx="2" fill="currentColor" fillOpacity=".12" />
      <rect x="8" y="23" width="10" height="7" rx="1.5" />
      <rect x="30" y="23" width="10" height="7" rx="1.5" />
      {[4, 16, 26, 38].map((x) => (
        <rect key={x} x={x} y="38" width="6" height="5" rx="1" />
      ))}
    </>
  ),
  'dynamic-programming': (
    <>
      <rect x="7" y="7" width="34" height="34" rx="4" />
      <path d="M7 18h34M7 29h34M18 7v34M29 7v34" opacity=".4" />
      <path d="M12 12h12v12h12v12" strokeWidth="3" />
      <path d="m32 33 4 4 4-4" />
    </>
  ),
  geometry: (
    <>
      <path d="m9 36 11-26 20 24L9 36Zm11-26 7 25" />
      <path d="M7 10v30h35" opacity=".35" />
      {[
        [9, 36],
        [20, 10],
        [40, 34],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill="var(--palette-background-paper)" />
      ))}
    </>
  ),
  graphs: (
    <>
      <path d="m10 29 12-18 16 8-7 20-21-10 28-10M22 11l9 28" />
      {[
        [10, 29],
        [22, 11],
        [38, 19],
        [31, 39],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" fill="var(--palette-background-paper)" />
      ))}
      <circle cx="22" cy="11" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  'linear-algebra': (
    <>
      <path d="M12 7H7v34h5M36 7h5v34h-5" />
      {[14, 24, 34].flatMap((x) =>
        [14, 24, 34].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x - 2}
            y={y - 2}
            width="4"
            height="4"
            rx="1"
            fill="currentColor"
            stroke="none"
            opacity={x === y ? 1 : 0.4}
          />
        ))
      )}
    </>
  ),
  miscellaneous: (
    <>
      <path d="m16 14-10 10 10 10m16-20 10 10-10 10M28 8l-8 32" />
      <circle cx="39" cy="8" r="3" fill="currentColor" fillOpacity=".15" />
    </>
  ),
  'numerical-methods': (
    <>
      <path d="M6 34h36M11 29v10m26-10v10M18 17h20M22 12v10m12-10v10" />
      <path d="m18 14-4-4 4-4m-4 4h23" opacity=".5" />
      <circle cx="24" cy="34" r="4" fill="var(--palette-background-paper)" />
      <path d="M28 27v-4" />
    </>
  ),
  'string-processing': (
    <>
      <rect x="4" y="9" width="40" height="13" rx="3" />
      <path d="M14 9v13M24 9v13M34 9v13" opacity=".4" />
      <rect x="14" y="27" width="20" height="12" rx="3" fill="currentColor" fillOpacity=".12" />
      <path d="M24 27v12m-5 5h10M14 4h10" />
    </>
  ),
  roadmap: (
    <>
      <path d="M10 38h22a8 8 0 0 0 0-16H18a8 8 0 0 1 0-16h18" strokeDasharray="3 4" />
      <circle cx="10" cy="38" r="4" fill="var(--palette-background-paper)" />
      <circle cx="24" cy="22" r="4" fill="var(--palette-background-paper)" />
      <path d="M36 13V4l7 3-7 3" />
    </>
  ),
  search: (
    <>
      <path d="M7 12h18M7 21h10M7 30h10" opacity=".5" />
      <circle cx="29" cy="26" r="10" fill="currentColor" fillOpacity=".08" />
      <path d="m36 34 7 8m-18-16h8" />
    </>
  ),
};

export function AlgorithmIcon({ topic, size = 24, ...other }: AlgorithmIconProps) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...other}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[resolveAlgorithmPattern(topic)]}
    </svg>
  );
}
