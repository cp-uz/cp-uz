import type { PDFDocumentProxy } from 'pdfjs-dist';

import { PDFWorker, getDocument } from 'pdfjs-dist';
import { useRef, useState, useEffect, useCallback } from 'react';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

import { PdfPage } from './PdfPage';
import { pdfHttpUrl } from './pdf-links';

export function PdfStatement({ source, title }: { source: string; title: string }) {
  // Each source owns one loading task and one worker; never render the previous document for it.
  return <PdfDocument key={source} source={source} title={title} />;
}

function PdfDocument({ source, title }: { source: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(0);
  const failRef = useRef(() => {});
  const onError = useCallback(() => failRef.current(), []);
  const safeSource = pdfHttpUrl(source, true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const updateWidth = () => setWidth(Math.max(0, Math.floor(node.clientWidth)));
    updateWidth();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    let disposed = false;
    let dispose = () => {};
    const release = () => {
      if (disposed) return;
      disposed = true;
      dispose();
    };
    const fail = () => {
      if (!active) return;
      active = false;
      setError(true);
      release();
    };
    failRef.current = fail;
    setDocument(null);
    setError(false);
    try {
      if (!safeSource) throw new Error('Unsupported PDF URL');
      const port = new PdfWorker();
      dispose = () => port.terminate();
      const worker = PDFWorker.create({ port });
      dispose = () => {
        worker.destroy();
        port.terminate();
      };
      const task = getDocument({ url: source, withCredentials: false, worker });
      dispose = () => {
        void Promise.resolve()
          .then(() => task.destroy())
          .catch(() => undefined)
          .finally(() => {
            worker.destroy();
            port.terminate();
          });
      };
      void task.promise
        .then((value) => {
          if (active) setDocument(value);
        })
        .catch(fail);
    } catch {
      fail();
    }
    return () => {
      active = false;
      release();
    };
  }, [source, safeSource]);

  return (
    <Box
      ref={containerRef}
      role="document"
      aria-label={`${title} masala sharti`}
      aria-busy={!document && !error}
      sx={{ overflow: 'hidden', bgcolor: '#fff' }}
    >
      {error && (
        <Alert severity="error">
          Masala PDF’ini yuklab bo‘lmadi.{' '}
          {safeSource && (
            <Link href={safeSource} target="_blank" rel="noopener noreferrer">
              PDF’ni alohida ochish
            </Link>
          )}
        </Alert>
      )}
      {!error && !document && (
        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: 0.707 }} />
      )}
      {!error && document && width > 0 && (
        <Box sx={{ display: 'grid', gap: '1px', bgcolor: 'divider' }}>
          {Array.from({ length: document.numPages }, (_, index) => (
            <PdfPage
              key={`${source}-${index}`}
              document={document}
              onError={onError}
              pageNumber={index + 1}
              width={width}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
