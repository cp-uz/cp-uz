import type { RenderTask, PDFDocumentProxy } from 'pdfjs-dist';

import { PDFWorker, getDocument } from 'pdfjs-dist';
import { useRef, useState, useEffect, useCallback } from 'react';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

type PdfCanvasPageProps = {
  document: PDFDocumentProxy;
  onError: () => void;
  pageNumber: number;
  width: number;
};

function PdfCanvasPage({ document, onError, pageNumber, width }: PdfCanvasPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [height, setHeight] = useState(Math.round(width * 1.414));
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let active = true;

    async function renderPage() {
      const page = await document.getPage(pageNumber);
      if (!active || !canvasRef.current) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const scale = width / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      setRendered(false);
      setHeight(Math.round(viewport.height));
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      renderTaskRef.current?.cancel();
      const task = page.render({
        canvas,
        canvasContext: context,
        viewport,
        transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
      });
      renderTaskRef.current = task;

      try {
        await task.promise;
        if (active) setRendered(true);
      } catch (renderError) {
        if (
          active &&
          !(renderError instanceof Error && renderError.name === 'RenderingCancelledException')
        ) {
          onError();
        }
      }
    }

    void renderPage();
    return () => {
      active = false;
      renderTaskRef.current?.cancel();
    };
  }, [document, onError, pageNumber, width]);

  return (
    <Box sx={{ position: 'relative', minHeight: height, bgcolor: '#fff' }}>
      {!rendered && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      )}
      <Box
        ref={canvasRef}
        component="canvas"
        aria-label={`${pageNumber}-sahifa`}
        sx={{ display: 'block', maxWidth: '100%', opacity: rendered ? 1 : 0 }}
      />
    </Box>
  );
}

type PdfStatementProps = {
  source: string;
  title: string;
};

export function PdfStatement({ source, title }: PdfStatementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(0);
  const handleRenderError = useCallback(() => setError(true), []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const updateWidth = () => setWidth(Math.max(0, Math.floor(node.clientWidth)));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    setDocument(null);
    setError(false);
    const workerPort = new PdfWorker();
    const worker = PDFWorker.create({ port: workerPort });
    const task = getDocument({ url: source, withCredentials: false, worker });

    void task.promise
      .then((loaded) => {
        if (active) setDocument(loaded);
        else void loaded.destroy();
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
      void task.destroy().finally(() => {
        worker.destroy();
        workerPort.terminate();
      });
    };
  }, [source]);

  return (
    <Box
      ref={containerRef}
      id="problem-statement"
      role="document"
      aria-label={`${title} masala sharti`}
      aria-busy={!document && !error}
      sx={{ mt: 4, overflow: 'hidden', bgcolor: '#fff' }}
    >
      {error && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          <Typography component="span">Masala PDF’ini yuklab bo‘lmadi. </Typography>
          <Link href={source} target="_blank" rel="noopener noreferrer">
            PDF’ni alohida ochish
          </Link>
        </Alert>
      )}
      {!error && width > 0 && !document && (
        <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', aspectRatio: 0.707 }} />
      )}
      {document && width > 0 && (
        <Box sx={{ display: 'grid', gap: '1px', bgcolor: 'divider' }}>
          {Array.from({ length: document.numPages }, (_, index) => (
            <PdfCanvasPage
              key={`${source}-${index + 1}`}
              document={document}
              onError={handleRenderError}
              pageNumber={index + 1}
              width={width}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
