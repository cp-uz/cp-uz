import type { ReactNode } from 'react';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

export function DeferredViewport({
  children,
  minHeight,
}: {
  children: () => ReactNode;
  minHeight: number;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: '120px 0px' }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={hostRef} sx={{ minHeight: visible ? 0 : minHeight }}>
      {visible ? children() : null}
    </Box>
  );
}
