import 'pdfjs-dist/web/pdf_viewer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';

import { TextLayer } from 'pdfjs-dist';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { pdfHttpUrl } from './pdf-links';

type PdfPageProps = {
  document: PDFDocumentProxy;
  onError: () => void;
  pageNumber: number;
  width: number;
};
type PdfLink = { url: string; left: number; top: number; width: number; height: number };

export function PdfPage({ document, onError, pageNumber, width }: PdfPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(pageNumber === 1);
  const [height, setHeight] = useState(Math.round(width * 1.414));
  const [rendered, setRendered] = useState(false);
  const [links, setLinks] = useState<PdfLink[]>([]);

  useEffect(() => {
    if (!pageRef.current) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: '800px',
    });
    observer.observe(pageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return undefined;
    let active = true;
    let cancelRender = () => {};
    let textLayer: TextLayer | undefined;
    setRendered(false);
    setLinks([]);
    async function render() {
      try {
        const page = await document.getPage(pageNumber);
        if (!active || !canvasRef.current || !textRef.current) return;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: width / base.width });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas unavailable');
        setHeight(Math.round(viewport.height));
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const layerContainer = textRef.current;
        layerContainer.replaceChildren();
        layerContainer.style.setProperty(
          '--total-scale-factor',
          String(viewport.scale * viewport.userUnit)
        );
        const task = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
        });
        cancelRender = () => task.cancel();
        const renderText = async () => {
          const text = await page.getTextContent();
          if (!active) return;
          textLayer = new TextLayer({
            textContentSource: text,
            container: layerContainer,
            viewport,
          });
          await textLayer.render();
        };
        await Promise.all([task.promise, renderText()]);
        const annotations = await page.getAnnotations({ intent: 'display' });
        if (!active) return;
        setLinks(
          annotations.flatMap((annotation: { url?: string; rect?: number[] }) => {
            const url = annotation.url && pdfHttpUrl(annotation.url);
            if (!url || annotation.rect?.length !== 4 || !annotation.rect.every(Number.isFinite))
              return [];
            const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(annotation.rect);
            return [
              {
                url,
                left: Math.min(x1, x2),
                top: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
              },
            ];
          })
        );
        setRendered(true);
      } catch (error) {
        if (active && !(error instanceof Error && error.name === 'RenderingCancelledException'))
          onError();
      }
    }
    void render();
    const canvas = canvasRef.current;
    return () => {
      active = false;
      cancelRender();
      textLayer?.cancel();
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [document, near, onError, pageNumber, width]);

  return (
    <Box
      ref={pageRef}
      role="group"
      aria-label={`${pageNumber}-sahifa`}
      sx={{ position: 'relative', minHeight: height, bgcolor: '#fff' }}
    >
      {(!near || !rendered) && (
        <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, height: '100%' }} />
      )}
      {near && (
        <>
          <Box
            ref={canvasRef}
            component="canvas"
            aria-hidden="true"
            sx={{ display: 'block', maxWidth: '100%', opacity: rendered ? 1 : 0 }}
          />
          <div ref={textRef} className="textLayer" />
          {links.map((link, index) => (
            <Box
              component="a"
              key={`${link.url}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.url}
              sx={{
                position: 'absolute',
                left: link.left,
                top: link.top,
                width: link.width,
                height: link.height,
                zIndex: 2,
                '&:focus-visible': { outline: '2px solid #0877e1' },
              }}
            />
          ))}
        </>
      )}
    </Box>
  );
}
