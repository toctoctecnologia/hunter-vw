import { useParams, Navigate } from 'react-router-dom';
export default function ImovelEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/imoveis/${id}/atualizar`} replace />;
}
