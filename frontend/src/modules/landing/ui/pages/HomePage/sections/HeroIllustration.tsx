import Box from '@mui/material/Box';

const graphPath = 'M 91 239 L 143 160 L 218 202 L 286 111';
const nodes = [
  [91, 239],
  [143, 160],
  [218, 202],
  [286, 111],
];

export function HeroIllustration() {
  return (
    <Box
      aria-hidden="true"
      className="cp-hero-graph"
      sx={{
        height: 360,
        display: { xs: 'none', md: 'block' },
        position: 'relative',
        color: 'text.secondary',
        '& .cp-grid-line': { stroke: 'var(--palette-divider)' },
        '& .cp-axis-line': { stroke: 'var(--palette-text-secondary)' },
        '& .cp-graph-line': { stroke: 'var(--palette-primary-main)' },
        '& .cp-graph-node': {
          fill: 'var(--palette-background-paper)',
          stroke: 'var(--palette-primary-main)',
        },
        '& .cp-graph-node-muted': {
          fill: 'var(--palette-background-paper)',
          stroke: 'var(--palette-text-secondary)',
        },
        '& .cp-token': {
          fill: 'var(--palette-text-secondary)',
          fontSize: 13,
          fontFamily: 'JetBrains Mono Variable, monospace',
        },
        '& .cp-token-primary': { fill: 'var(--palette-primary-main)' },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 360 360"
        role="presentation"
        focusable="false"
        sx={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <g className="cp-grid-line" fill="none" strokeWidth="1">
          {[52, 104, 156, 208, 260, 312].map((position) => (
            <path key={`vertical-${position}`} d={`M ${position} 28 V 332`} />
          ))}
          {[48, 100, 152, 204, 256, 308].map((position) => (
            <path key={`horizontal-${position}`} d={`M 28 ${position} H 332`} />
          ))}
        </g>
        <g className="cp-axis-line" fill="none" strokeWidth="1.2">
          <path d="M 28 308 H 338" />
          <path d="M 52 332 V 22" />
          <path d="m 331 303 7 5-7 5" />
          <path d="m 47 29 5-7 5 7" />
        </g>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            className="cp-graph-line cp-graph-trace"
            d={graphPath}
            strokeWidth="1.8"
            pathLength="1"
          />
          <path
            className="cp-graph-line cp-graph-flow"
            d={graphPath}
            strokeWidth="3"
            pathLength="100"
            opacity=".45"
          />
          <path
            className="cp-grid-line"
            d="M 91 239 L 218 202 M 143 160 L 286 111"
            strokeWidth="1.2"
          />
          <path
            className="cp-grid-line"
            d="M 218 202 L 297 257"
            strokeWidth="1.2"
            strokeDasharray="5 6"
          />
        </g>
        <g className="cp-graph-line" fill="none" strokeWidth="1">
          {nodes.map(([x, y]) => (
            <circle key={x} className="cp-graph-halo" cx={x} cy={y} r="10" />
          ))}
        </g>
        <g strokeWidth="2">
          {nodes.map(([x, y]) => (
            <circle key={x} className="cp-graph-node" cx={x} cy={y} r="7" />
          ))}
          <circle className="cp-graph-node-muted" cx="297" cy="257" r="6" />
        </g>
        <g className="cp-token">
          <text x="64" y="269">
            (1, 2)
          </text>
          <text className="cp-token-primary" x="110" y="135">
            dp[i]
          </text>
          <text x="233" y="195">
            O(log n)
          </text>
          <text className="cp-token-primary" x="255" y="86">
            {'{ u, v }'}
          </text>
          <text x="306" y="281">
            ∞
          </text>
        </g>
      </Box>
    </Box>
  );
}
