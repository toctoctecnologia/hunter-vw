export function LoadingState() {
  return (
    <div className="p-10 text-center" role="status">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-b-2 border-orange-600" />
      <p className="mt-4 text-gray-600">Carregando…</p>
    </div>
  )
}

export default LoadingState
