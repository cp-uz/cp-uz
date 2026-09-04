import type { PDFDocumentProxy } from 'pdfjs-dist';

import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PdfPage } from '../src/modules/problems/ui/PdfPage';
import { PdfStatement } from '../src/modules/problems/ui/PdfStatement';
import { ProblemStatement } from '../src/modules/problems/ui/ProblemStatement';

const engine = vi.hoisted(() => ({
  getDocument: vi.fn(),
  createWorker: vi.fn(),
  ports: [] as { terminate: ReturnType<typeof vi.fn> }[],
  layers: [] as { cancel: ReturnType<typeof vi.fn>; container: HTMLElement }[],
}));
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?worker&inline', () => ({
  default: class Worker {
    terminate = vi.fn();
    constructor() {
      engine.ports.push(this);
    }
  },
}));
vi.mock('pdfjs-dist', () => ({
  getDocument: engine.getDocument,
  PDFWorker: { create: engine.createWorker },
  TextLayer: class TextLayer {
    cancel = vi.fn();
    container: HTMLElement;
    content: { items: { str: string }[] };
    constructor({
      container,
      textContentSource,
    }: {
      container: HTMLElement;
      textContentSource: { items: { str: string }[] };
    }) {
      this.container = container;
      this.content = textContentSource;
      engine.layers.push(this);
    }
    async render() {
      for (const item of this.content.items) {
        const span = document.createElement('span');
        span.textContent = item.str;
        this.container.append(span);
      }
    }
  },
}));
vi.mock('modules/learning/markdown', () => ({
  RichMarkdown: ({ children }: { children: React.ReactNode }) => <article>{children}</article>,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

const observers: {
  callback: IntersectionObserverCallback;
  node?: Element;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];
beforeEach(() => {
  engine.ports.length = 0;
  engine.layers.length = 0;
  observers.length = 0;
  engine.getDocument.mockReset();
  engine.createWorker.mockReset().mockImplementation(() => ({ destroy: vi.fn() }));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    {} as CanvasRenderingContext2D
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600);
  vi.stubGlobal(
    'IntersectionObserver',
    class Observer {
      callback: IntersectionObserverCallback;
      node?: Element;
      disconnect = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(node: Element) {
        this.node = node;
      }
    }
  );
  vi.stubGlobal(
    'ResizeObserver',
    class Observer {
      observe() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function pageFixture(text = 'Read and select this statement', userUnit = 1) {
  const cancel = vi.fn();
  const page = {
    getViewport: vi.fn(({ scale }: { scale: number }) => ({
      scale,
      userUnit,
      width: 600 * userUnit * scale,
      height: 800 * userUnit * scale,
      convertToViewportRectangle: (rect: number[]) => rect.map((value) => value * scale * userUnit),
    })),
    render: vi.fn(() => ({ promise: Promise.resolve(), cancel })),
    getTextContent: vi.fn(async () => ({ items: [{ str: text }] })),
    getAnnotations: vi.fn(async (): Promise<{ url?: string; rect?: number[] }[]> => []),
  };
  return { page, cancel };
}
function documentFixture(numPages = 1, fixture = pageFixture()) {
  const getPage = vi.fn(async () => fixture.page);
  const document = { numPages, getPage } as unknown as PDFDocumentProxy;
  const task = { promise: Promise.resolve(document), destroy: vi.fn(async () => {}) };
  engine.getDocument.mockReturnValue(task);
  return { ...fixture, getPage, document, task };
}
function visibility(node: Element, isIntersecting: boolean) {
  const observer = observers.find((item) => item.node === node)!;
  expect(observer).toBeTruthy();
  act(() =>
    observer.callback(
      [{ isIntersecting, target: node } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  );
}

describe('PDF page lifecycle and accessible content', () => {
  it('defers offscreen pages and releases canvas/text rendering when they leave the viewport', async () => {
    const fixture = documentFixture(2);
    const view = render(
      <PdfPage document={fixture.document} pageNumber={2} width={600} onError={vi.fn()} />
    );
    const group = screen.getByRole('group', { name: '2-sahifa' });
    expect(fixture.getPage).not.toHaveBeenCalled();
    expect(group.querySelector('canvas')).toBeNull();
    visibility(group, true);
    await screen.findByText('Read and select this statement');
    expect(fixture.getPage).toHaveBeenCalledWith(2);
    const canvas = group.querySelector('canvas')!;
    expect(canvas.width).toBeGreaterThan(0);
    visibility(group, false);
    expect(fixture.cancel).toHaveBeenCalledOnce();
    expect(engine.layers[0].cancel).toHaveBeenCalledOnce();
    expect(canvas.width).toBe(0);
    expect(canvas.height).toBe(0);
    expect(group.querySelector('canvas')).toBeNull();
    expect(screen.queryByText('Read and select this statement')).toBeNull();
    visibility(group, true);
    await screen.findByText('Read and select this statement');
    expect(fixture.getPage).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
  });

  it('keeps selectable text aligned for scaled PDF units and allows only valid HTTP links', async () => {
    const fixture = documentFixture(1, pageFixture('Selectable Uzbek statement', 2));
    fixture.page.getAnnotations.mockResolvedValue([
      { url: 'https://example.com/solution', rect: [20, 40, 80, 60] },
      { url: 'http://example.com/reference', rect: [80, 100, 20, 80] },
      { url: 'javascript:alert(1)', rect: [0, 0, 10, 10] },
      { url: 'data:text/html,hello', rect: [0, 0, 10, 10] },
      { url: 'https://[invalid', rect: [0, 0, 10, 10] },
      { url: 'https://example.com/bad-box', rect: [0, 0, Number.NaN, 10] },
      { url: 'https://example.com/short-box', rect: [0, 0] },
    ]);
    const view = render(
      <PdfPage document={fixture.document} pageNumber={1} width={600} onError={vi.fn()} />
    );
    const span = await screen.findByText('Selectable Uzbek statement');
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(2));
    const range = document.createRange();
    range.selectNodeContents(span);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    expect(window.getSelection()!.toString()).toBe('Selectable Uzbek statement');
    expect(span.parentElement?.style.getPropertyValue('--total-scale-factor')).toBe('1');
    const canvas = view.container.querySelector('canvas')!;
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
    expect(canvas.style.width).toBe('600px');
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it.each(['getPage', 'render', 'text', 'annotations'] as const)(
    'reports a %s failure to the fallback owner',
    async (stage) => {
      const fixture = documentFixture();
      const error = new Error(`${stage} failed`);
      if (stage === 'getPage') fixture.getPage.mockRejectedValue(error);
      if (stage === 'render')
        fixture.page.render.mockImplementation(() => ({
          promise: Promise.reject(error),
          cancel: fixture.cancel,
        }));
      if (stage === 'text') fixture.page.getTextContent.mockRejectedValue(error);
      if (stage === 'annotations') fixture.page.getAnnotations.mockRejectedValue(error);
      const onError = vi.fn();
      render(<PdfPage document={fixture.document} pageNumber={1} width={600} onError={onError} />);
      await waitFor(() => expect(onError).toHaveBeenCalledOnce());
    }
  );

  it('cancels a drawing immediately while text is still loading without reporting stale failures', async () => {
    const fixture = documentFixture();
    const drawing = deferred<void>();
    const text = deferred<{ items: { str: string }[] }>();
    fixture.page.render.mockReturnValue({ promise: drawing.promise, cancel: fixture.cancel });
    fixture.page.getTextContent.mockReturnValue(text.promise);
    const onError = vi.fn();
    const view = render(
      <PdfPage document={fixture.document} pageNumber={1} width={600} onError={onError} />
    );
    await waitFor(() => expect(fixture.page.render).toHaveBeenCalledOnce());
    view.unmount();
    expect(fixture.cancel).toHaveBeenCalledOnce();
    await act(async () => {
      drawing.reject(new Error('late render failure'));
      text.resolve({ items: [{ str: 'late text' }] });
    });
    expect(onError).not.toHaveBeenCalled();
    expect(engine.layers).toHaveLength(0);
  });

  it('renders every page when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const fixture = documentFixture(2);
    render(<PdfPage document={fixture.document} pageNumber={2} width={600} onError={vi.fn()} />);
    await screen.findByText('Read and select this statement');
    expect(fixture.getPage).toHaveBeenCalledWith(2);
  });
});

describe('PDF document ownership, failure fallback and view switching', () => {
  it('shows a direct fallback on load failure and destroys the task, worker and port once', async () => {
    const loading = deferred<PDFDocumentProxy>();
    const fixture = documentFixture();
    fixture.task.promise = loading.promise;
    const view = render(<PdfStatement source="/statement.pdf" title="BFS" />);
    expect(screen.getByRole('document').getAttribute('aria-busy')).toBe('true');
    await act(async () => loading.reject(new Error('network unavailable')));
    expect(screen.getByRole('alert').textContent).toContain('yuklab bo‘lmadi');
    expect(screen.getByRole('link', { name: 'PDF’ni alohida ochish' }).getAttribute('href')).toBe(
      '/statement.pdf'
    );
    await waitFor(() => expect(engine.ports[0].terminate).toHaveBeenCalledOnce());
    expect(fixture.task.destroy).toHaveBeenCalledOnce();
    expect(engine.createWorker.mock.results[0].value.destroy).toHaveBeenCalledOnce();
    view.unmount();
    expect(fixture.task.destroy).toHaveBeenCalledOnce();
  });

  it.each(['worker', 'document'] as const)(
    'releases partially constructed resources if %s construction throws',
    async (stage) => {
      const fixture = documentFixture();
      if (stage === 'worker')
        engine.createWorker.mockImplementation(() => {
          throw new Error('blocked worker');
        });
      else
        engine.getDocument.mockImplementation(() => {
          throw new Error('invalid PDF');
        });
      const view = render(<PdfStatement source="/statement.pdf" title="BFS" />);
      await screen.findByRole('alert');
      expect(engine.ports[0].terminate).toHaveBeenCalledOnce();
      if (stage === 'document')
        expect(engine.createWorker.mock.results[0].value.destroy).toHaveBeenCalledOnce();
      expect(fixture.task.destroy).not.toHaveBeenCalled();
      view.unmount();
      expect(engine.ports[0].terminate).toHaveBeenCalledOnce();
    }
  );

  it('disposes a loaded PDF on page failure while keeping its direct download available', async () => {
    const fixture = documentFixture();
    fixture.getPage.mockRejectedValue(new Error('damaged page'));
    render(<PdfStatement source="https://example.com/statement.pdf" title="BFS" />);
    await screen.findByRole('alert');
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com/statement.pdf');
    await waitFor(() => expect(engine.ports[0].terminate).toHaveBeenCalledOnce());
  });

  it('does not show a previous document or accept a late load after changing the PDF source', async () => {
    const first = documentFixture(1, pageFixture('First statement'));
    const second = documentFixture(1, pageFixture('Second statement'));
    const loading = deferred<PDFDocumentProxy>();
    engine.getDocument
      .mockReturnValueOnce({ ...first.task, promise: loading.promise })
      .mockReturnValueOnce(second.task);
    const view = render(<PdfStatement source="/first.pdf" title="First" />);
    view.rerender(<PdfStatement source="/second.pdf" title="Second" />);
    await screen.findByText('Second statement');
    await act(async () => loading.resolve(first.document));
    expect(screen.queryByText('First statement')).toBeNull();
    expect(first.getPage).not.toHaveBeenCalled();
    expect(engine.ports[0].terminate).toHaveBeenCalledOnce();
    expect(engine.ports[1].terminate).not.toHaveBeenCalled();
    view.unmount();
    await waitFor(() => expect(engine.ports[1].terminate).toHaveBeenCalledOnce());
  });

  it('unmounts and destroys PDF rendering when switching to the textual statement', async () => {
    const fixture = documentFixture();
    render(
      <ProblemStatement
        pdfUrl="/statement.pdf"
        title="BFS"
        markdown="Alternative Uzbek statement"
        sourcePath="bfs/README.md"
      />
    );
    await screen.findByText('Read and select this statement');
    fireEvent.click(screen.getByRole('button', { name: 'Matn ko‘rinishi' }));
    await screen.findByText('Alternative Uzbek statement');
    expect(screen.queryByRole('document')).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Matn ko‘rinishi' }).getAttribute('aria-pressed')
    ).toBe('true');
    await waitFor(() => expect(fixture.task.destroy).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('button', { name: 'PDF', exact: true }));
    await screen.findByText('Read and select this statement');
    expect(engine.getDocument).toHaveBeenCalledTimes(2);
  });

  it('rejects non-HTTP attachments and still offers the textual statement', async () => {
    documentFixture();
    render(
      <ProblemStatement
        pdfUrl="javascript:alert(1)"
        title="BFS"
        markdown="Safe alternative"
        sourcePath="bfs/README.md"
      />
    );
    await screen.findByText('Safe alternative');
    expect(screen.queryByRole('link')).toBeNull();
    expect(engine.getDocument).not.toHaveBeenCalled();
  });
});
