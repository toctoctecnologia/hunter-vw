// Compatibility shim for next/navigation -> react-router-dom
import { useNavigate, useLocation, useSearchParams as useRRSearchParams, useParams } from 'react-router-dom';
import { useMemo } from 'react';

export function useRouter() {
  const navigate = useNavigate();
  return useMemo(() => ({
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  }), [navigate]);
}

export function usePathname() {
  const { pathname } = useLocation();
  return pathname;
}

export function useSearchParams() {
  const [searchParams] = useRRSearchParams();
  return searchParams;
}

export { useParams };
