import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

function setMeta(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({ title, description, path = '' }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes('cp.uz') || title.startsWith('cp uz;') ? title : `${title} — cp.uz`;
    const url = `https://cp.uz${path}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [description, path, title]);

  return null;
}
