export type AppView = 'home' | 'fryzjerzy' | 'salon' | 'uslugi';

export interface ParsedRoute {
  view: AppView;
  serviceSlug?: string;
}

export const NAV_EVENT = 'app:navigate';

export interface NavigateDetail {
  path: string;
  scrollTo?: string;
}

export function normalizePathname(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  return cleaned.toLowerCase();
}

export function parseRoute(pathname: string): ParsedRoute {
  const rawNormalized = pathname.replace(/\/+$/, '') || '/';
  const lower = rawNormalized.toLowerCase();

  if (lower === '/fryzjerzy') {
    return { view: 'fryzjerzy' };
  }

  if (lower === '/salon') {
    return { view: 'salon' };
  }

  if (lower === '/uslugi') {
    return { view: 'uslugi', serviceSlug: undefined };
  }

  if (lower.startsWith('/uslugi/')) {
    const slug = rawNormalized.slice('/uslugi/'.length).split('/')[0];
    return { view: 'uslugi', serviceSlug: slug || undefined };
  }

  return { view: 'home' };
}

export function navigateTo(path: string, scrollTo?: string): void {
  const targetPath = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname !== targetPath || window.location.hash) {
    window.history.pushState({ scrollTo: scrollTo ?? null }, '', targetPath);
  }
  window.dispatchEvent(
    new CustomEvent<NavigateDetail>(NAV_EVENT, {
      detail: { path: targetPath, scrollTo },
    })
  );
}

export function updatePageSeo(title: string, description: string, canonicalPath?: string): void {
  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  if (canonicalPath) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const cleanPath = canonicalPath === '/' ? '' : canonicalPath;
    canonical.setAttribute('href', `https://www.fryzjer-polski.pl${cleanPath}`);
  }
}
