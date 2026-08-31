import { useRef, useState, useEffect, useCallback } from 'react';

export function useScrollOffsetTop(offset = 0) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [offsetTop, setOffsetTop] = useState(false);

  const update = useCallback(() => {
    const threshold = elementRef.current ? elementRef.current.offsetTop - offset : offset;
    setOffsetTop(window.scrollY > threshold);
  }, [offset]);

  useEffect(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [update]);

  return { elementRef, offsetTop };
}
