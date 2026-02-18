import { FILES_BASEURL } from './env';

export function resolveFileUrl(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url;
  }

  const base = FILES_BASEURL.replace(/\/+$/, '');
  const path = url.replace(/^\/+/, '');
  return `${base}/${path}`;
}
