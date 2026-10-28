import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { AlgorithmPattern } from './patterns';

import Box from '@mui/material/Box';

import { resolveAlgorithmPattern } from './patterns';

function Node({
  x,
  y,
  label,
  active = false,
}: {
  x: number;
  y: number;
  label?: string;
  active?: boolean;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="12" className={active ? 'algo-fill' : 'algo-node'} />
      {label && (
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          className={active ? 'algo-label-inverse' : 'algo-label'}
        >
          {label}
        </text>
      )}
    </g>
  );
}

const diagrams: Record<AlgorithmPattern, ReactNode> = {
  graphs: (
    <>
      <path className="algo-muted" d="m35 90 51-54 65 13 53 45-77 22-92-26 116-41M86 36l41 80" />
      <path className="algo-line" d="m35 90 51-54 65 13 53 45" />
      <text x="52" y="57">
        3
      </text>
      <text x="117" y="34">
        2
      </text>
      <text x="183" y="60">
        4
      </text>
      <Node x={35} y={90} label="s" active />
      <Node x={86} y={36} label="a" active />
      <Node x={151} y={49} label="b" active />
      <Node x={204} y={94} label="t" active />
      <Node x={127} y={116} label="c" />
    </>
  ),
  'data-structures': (
    <>
      <path
        className="algo-muted"
        d="M120 35 65 67m55-32 55 32M65 79l-30 30m30-30 27 30m83-30-27 30m27-30 30 30"
      />
      <path className="algo-line" d="m120 35 55 32-27 42m27-42 30 42" />
      <rect x="91" y="14" width="58" height="25" rx="5" className="algo-node" />
      <rect x="43" y="57" width="44" height="25" rx="5" className="algo-node" />
      <rect x="153" y="57" width="44" height="25" rx="5" className="algo-fill" />
      <text x="120" y="31" textAnchor="middle" className="algo-label">
        [0, 7]
      </text>
      <text x="65" y="74" textAnchor="middle" className="algo-label">
        [0, 3]
      </text>
      <text x="175" y="74" textAnchor="middle" className="algo-label-inverse">
        [4, 7]
      </text>
      {[35, 92, 148, 205].map((x, i) => (
        <Node key={x} x={x} y={118} label={String(i * 2)} active={i > 1} />
      ))}
    </>
  ),
  'dynamic-programming': (
    <>
      {Array.from({ length: 5 }, (_, x) =>
        Array.from({ length: 3 }, (__, y) => {
          const active = (y === 0 && x < 2) || (y === 1 && x > 0 && x < 4) || (y === 2 && x > 2);
          return (
            <rect
              key={`${x}-${y}`}
              x={40 + x * 33}
              y={21 + y * 33}
              width="27"
              height="27"
              rx="5"
              className={active ? 'algo-soft' : 'algo-cell'}
            />
          );
        })
      )}
      <path className="algo-line" d="M53 34h33v33h66v33h33m-6-5 6 5-6 5" />
      <text x="120" y="133" textAnchor="middle">
        dp[i] ← dp[i − 1]
      </text>
    </>
  ),
  algebra: (
    <>
      <circle cx="120" cy="69" r="44" className="algo-muted" strokeDasharray="3 5" />
      <path className="algo-line" d="M120 25a44 44 0 0 1 38 66m-1-9 1 9 9-2" />
      {[
        [120, 25],
        [158, 47],
        [158, 91],
        [120, 113],
        [82, 91],
        [82, 47],
      ].map(([x, y], i) => (
        <Node key={i} x={x} y={y} label={String(i)} active={i === 0 || i === 2} />
      ))}
      <text x="120" y="73" textAnchor="middle" className="algo-formula">
        mod 6
      </text>
      <text x="24" y="31">
        aⁿ
      </text>
      <text x="190" y="119">
        gcd
      </text>
    </>
  ),
  combinatorics: (
    <>
      <path
        className="algo-muted"
        d="m120 19-23 31m23-31 23 31M97 50 74 81m23-31 23 31m23-31-23 31m23-31 23 31M74 81l-23 31m23-31 23 31m23-31-23 31m23-31 23 31m46-31-23 31m23-31 23 31"
      />
      {[[120], [97, 143], [74, 120, 166], [51, 97, 143, 189]].flatMap((row, y) =>
        row.map((x, i) => (
          <Node
            key={`${x}-${y}`}
            x={x}
            y={19 + y * 31}
            label={String([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]][y][i])}
            active={y === 3 && (i === 1 || i === 2)}
          />
        ))
      )}
      <text x="205" y="43">
        Cⁿₖ
      </text>
    </>
  ),
  geometry: (
    <>
      <path className="algo-muted" d="M29 17v104h186m-190-5 4 5 4-5m177 1 5 4-5 4" />
      <path className="algo-soft" d="m54 100 47-72 79 13 19 62-85 12Z" />
      <path className="algo-line" d="m54 100 47-72 79 13 19 62-85 12Z" />
      <path className="algo-muted" d="m101 28 13 87m-60-15L180 41" strokeDasharray="4 4" />
      {[
        [54, 100],
        [101, 28],
        [180, 41],
        [199, 103],
        [114, 115],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" className="algo-fill" />
      ))}
      <circle cx="129" cy="67" r="3" className="algo-muted" />
      <text x="135" y="88">
        (x, y)
      </text>
    </>
  ),
  'linear-algebra': (
    <>
      <path className="algo-line" d="M47 22H36v99h11M133 22h11v99h-11" />
      {[
        [1, 0, 2],
        [0, 1, 3],
        [0, 0, 1],
      ].flatMap((row, y) =>
        row.map((value, x) => (
          <g key={`${x}-${y}`}>
            {x === y && (
              <rect
                x={49 + x * 30}
                y={29 + y * 30}
                width="24"
                height="24"
                rx="5"
                className="algo-soft"
              />
            )}
            <text x={61 + x * 30} y={46 + y * 30} textAnchor="middle" className="algo-label">
              {value}
            </text>
          </g>
        ))
      )}
      <path className="algo-line" d="M160 72h42m-7-6 7 6-7 6" />
      <text x="181" y="55" textAnchor="middle">
        Ax
      </text>
      <text x="181" y="103" textAnchor="middle">
        = b
      </text>
    </>
  ),
  'numerical-methods': (
    <>
      {[0, 1, 2].map((row) => (
        <g key={row} opacity={1 - row * 0.15}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x={25 + i * 24}
              y={24 + row * 35}
              width="19"
              height="24"
              rx="4"
              className={i >= [0, 2, 3][row] && i < [8, 6, 5][row] ? 'algo-soft' : 'algo-cell'}
            />
          ))}
        </g>
      ))}
      <path className="algo-line" d="M37 59h166m-130 35h106" />
      <circle cx="106" cy="106" r="5" className="algo-fill" />
      <text x="120" y="138" textAnchor="middle">
        l ≤ mid ≤ r
      </text>
    </>
  ),
  'string-processing': (
    <>
      {'abacaba'.split('').map((char, i) => (
        <g key={i}>
          <rect
            x={19 + i * 29}
            y="25"
            width="25"
            height="30"
            rx="5"
            className={i < 3 ? 'algo-soft' : 'algo-cell'}
          />
          <text x={31.5 + i * 29} y="45" textAnchor="middle" className="algo-label">
            {char}
          </text>
          <text x={31.5 + i * 29} y="19" textAnchor="middle">
            {i}
          </text>
        </g>
      ))}
      {'aba'.split('').map((char, i) => (
        <g key={i}>
          <rect x={135 + i * 29} y="78" width="25" height="30" rx="5" className="algo-soft" />
          <text x={147.5 + i * 29} y="98" textAnchor="middle" className="algo-label">
            {char}
          </text>
        </g>
      ))}
      <path className="algo-line" d="M19 62v5h83v-5m33 53v5h83v-5" />
      <path className="algo-muted" d="m61 78 48 17h16m-5-4 5 4-5 4" strokeDasharray="3 4" />
      <text x="31" y="101">
        π[i]
      </text>
    </>
  ),
  miscellaneous: (
    <>
      <path className="algo-muted" d="M30 119h185M30 119V22" />
      {[24, 40, 32, 68, 50, 84, 71].map((h, i) => (
        <rect
          key={i}
          x={44 + i * 23}
          y={117 - h}
          width="14"
          height={h}
          rx="3"
          className={i === 3 || i === 5 ? 'algo-fill' : 'algo-soft'}
        />
      ))}
      <path className="algo-line" d="m144 23 12-10 12 10m-12-10v20" />
      <text x="72" y="22">
        O(n log n)
      </text>
    </>
  ),
  roadmap: (
    <>
      <path
        className="algo-muted"
        d="M33 111h128a23 23 0 0 0 0-46H79a23 23 0 0 1 0-46h113"
        strokeDasharray="4 5"
      />
      <path className="algo-line" d="M33 111h61" />
      <Node x={33} y={111} label="1" active />
      <Node x={94} y={111} label="2" active />
      <Node x={184} y={88} label="3" />
      <Node x={120} y={65} label="4" />
      <Node x={56} y={42} label="5" />
      <path className="algo-line" d="M192 36V9l23 8-23 8" />
      <text x="124" y="41" textAnchor="middle">
        O‘rganish yo‘li
      </text>
    </>
  ),
  search: (
    <>
      <rect x="29" y="25" width="125" height="92" rx="8" className="algo-cell" />
      <path className="algo-muted" d="M46 47h54M46 65h33M46 83h45M46 101h23" />
      <circle cx="147" cy="73" r="35" className="algo-node" />
      <circle cx="147" cy="73" r="26" className="algo-soft" />
      <path className="algo-line" d="m172 99 28 29m-64-55h22" />
      <path className="algo-muted" d="m187 25 5-6m13 24 8-2M80 130h8" />
    </>
  ),
};

export function AlgorithmIllustration({ topic, sx, ...other }: BoxProps & { topic?: string }) {
  const pattern = resolveAlgorithmPattern(topic);
  return (
    <Box
      aria-hidden="true"
      {...other}
      sx={[
        {
          width: 240,
          maxWidth: '100%',
          flexShrink: 0,
          color: 'primary.main',
          lineHeight: 0,
          '& svg': { width: '100%', height: 'auto', overflow: 'visible' },
          '& text': {
            fill: 'var(--palette-text-secondary)',
            stroke: 'none',
            fontSize: 10,
            fontFamily: 'JetBrains Mono Variable, monospace',
          },
          '& .algo-line': { stroke: 'currentColor', strokeWidth: 2 },
          '& .algo-muted': {
            stroke: 'var(--palette-text-disabled)',
            strokeWidth: 1.25,
            fill: 'none',
          },
          '& .algo-cell': {
            fill: 'var(--palette-background-paper)',
            stroke: 'var(--palette-divider)',
          },
          '& .algo-node': {
            fill: 'var(--palette-background-paper)',
            stroke: 'currentColor',
            strokeWidth: 1.5,
          },
          '& .algo-fill': { fill: 'currentColor', stroke: 'currentColor' },
          '& .algo-soft': {
            fill: 'currentColor',
            fillOpacity: 0.1,
            stroke: 'currentColor',
            strokeOpacity: 0.25,
          },
          '& .algo-label': { fill: 'var(--palette-text-primary)', fontSize: 10 },
          '& .algo-label-inverse': { fill: 'var(--palette-primary-contrastText)', fontSize: 10 },
          '& .algo-formula': { fill: 'currentColor', fontSize: 12 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <svg
        viewBox="0 0 240 144"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        data-algorithm-pattern={pattern}
      >
        {diagrams[pattern]}
      </svg>
    </Box>
  );
}
