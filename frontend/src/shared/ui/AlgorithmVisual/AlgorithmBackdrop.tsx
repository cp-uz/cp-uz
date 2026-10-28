import type { BoxProps } from '@mui/material/Box';

import { useId } from 'react';

import Box from '@mui/material/Box';

import { AlgorithmIcon } from './AlgorithmIcon';
import { AlgorithmIllustration } from './AlgorithmIllustration';

type AlgorithmBackdropProps = BoxProps & {
  variant?: 'page' | 'section' | 'card';
  topic?: string;
};

export function AlgorithmBackdrop({
  variant = 'page',
  topic,
  className = '',
  sx,
  ...other
}: AlgorithmBackdropProps) {
  const patternId = `cp-pattern-${useId().replace(/:/g, '')}`;
  const card = variant === 'card';

  return (
    <Box
      {...other}
      aria-hidden="true"
      className={`cp-pattern-layer cp-pattern-layer--${variant} ${className}`}
      sx={[
        (theme) => ({
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          color: 'primary.main',
          opacity: card ? 0.14 : variant === 'section' ? 0.13 : 0.08,
          transition: 'opacity 300ms ease, transform 500ms ease',
          ...theme.applyStyles('dark', {
            opacity: card ? 0.19 : variant === 'section' ? 0.19 : 0.13,
          }),
          '& > svg': { display: 'block', width: '100%', height: '100%' },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <svg width="100%" height="100%" focusable="false" fill="none" opacity={topic ? 0.3 : 1}>
        <defs>
          <pattern
            id={patternId}
            width={card ? 300 : 600}
            height={card ? 220 : 380}
            patternUnits="userSpaceOnUse"
          >
            {card ? (
              <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path
                  d="M8 40h264M8 80h264M8 120h264M8 160h264M40 8v184M80 8v184M120 8v184M160 8v184M200 8v184M240 8v184"
                  opacity=".25"
                />
                <path d="m177 141 24-33 34 16 24-38" />
                {[
                  [177, 141],
                  [201, 108],
                  [235, 124],
                  [259, 86],
                ].map(([x, y]) => (
                  <circle key={x} cx={x} cy={y} r="3" fill="var(--palette-background-paper)" />
                ))}
                <AlgorithmIcon topic={topic} size={42} x="207" y="17" />
                <g
                  stroke="none"
                  fill="currentColor"
                  fontFamily="JetBrains Mono Variable, monospace"
                  fontSize="10"
                >
                  <text x="152" y="183">
                    {'{ 0, 1 }'}
                  </text>
                  <text x="34" y="56">
                    O(log n)
                  </text>
                </g>
              </g>
            ) : (
              <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                {Array.from({ length: 8 }, (_, x) =>
                  Array.from({ length: 5 }, (__, y) => (
                    <circle
                      key={`${x}-${y}`}
                      cx={20 + x * 65}
                      cy={20 + y * 65}
                      r=".8"
                      fill="currentColor"
                      stroke="none"
                    />
                  ))
                )}
                <path d="m35 98 34-46 51 22 36-41m-87 19 24 74 63-93M35 98l58 28" />
                {[
                  [35, 98],
                  [69, 52],
                  [120, 74],
                  [156, 33],
                  [93, 126],
                ].map(([x, y]) => (
                  <circle key={x} cx={x} cy={y} r="4" fill="var(--palette-background-default)" />
                ))}
                <path d="M337 221v-18h-40v18m40-18h40v18M297 238v12h-20m20 0h20m60-12v12h-20m20 0h20" />
                <rect x="326" y="180" width="22" height="13" rx="2" />
                <path d="M337 193v10" />
                {[286, 366].map((x) => (
                  <rect key={x} x={x} y="221" width="22" height="16" rx="2" />
                ))}
                <path d="M233 118h16v16h16v16h16m-4-4 4 4 4-4M403 37l-7 7 7 7m18-14 7 7-7 7m-3-17-11 20" />
                <g
                  stroke="none"
                  fill="currentColor"
                  fontFamily="JetBrains Mono Variable, monospace"
                  fontSize="12"
                >
                  <text x="228" y="57">
                    O(log n)
                  </text>
                  <text x="52" y="257">
                    dp[i] ← dp[i − 1]
                  </text>
                  <text x="407" y="149">
                    {'{ u, v }'}
                  </text>
                  <text x="214" y="289">
                    0 1 1 2 3 5
                  </text>
                </g>
              </g>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {topic && (
        <AlgorithmIllustration
          topic={topic}
          className="cp-backdrop-art"
          sx={{
            position: 'absolute',
            width: card ? 240 : { xs: 320, md: 460 },
            maxWidth: 'none',
            right: card ? -28 : { xs: -70, md: -12 },
            top: card ? 'auto' : '50%',
            bottom: card ? -20 : 'auto',
            transform: card ? 'rotate(-8deg)' : 'translateY(-50%) rotate(-6deg)',
            '& .algo-cell, & .algo-node': { fill: 'none', stroke: 'currentColor' },
            '& .algo-muted': { stroke: 'currentColor' },
            '& text, & .algo-label, & .algo-formula': { fill: 'currentColor' },
          }}
        />
      )}
    </Box>
  );
}
