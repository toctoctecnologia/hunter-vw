import { Navigate, useParams } from 'react-router-dom';

import { ROUTES } from './appRoutes';

export function LegacyCondoNewRedirect() {
  return <Navigate to={ROUTES.CONDO_NEW} replace />;
}

export function LegacyCondoEditRedirect() {
  const { id } = useParams<{ id: string }>();
  const targetId = id?.trim();
  return <Navigate to={targetId ? ROUTES.CONDO_EDIT(targetId) : ROUTES.CONDO_NEW} replace />;
}

export function LegacyCondoSlugRedirect() {
  const { rest } = useParams<{ rest: string }>();
  const targetId = rest ? `u${rest}` : null;
  return (
    <Navigate to={targetId ? ROUTES.CONDO_EDIT(targetId) : ROUTES.CONDO_NEW} replace />
  );
}

export function LegacyGestaoImoveisRedirect() {
  return <Navigate to={ROUTES.GESTAO_IMOVEIS} replace />;
}
