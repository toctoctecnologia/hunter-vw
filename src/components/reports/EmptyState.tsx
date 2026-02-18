interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'Nenhum registro com os filtros atuais' }: EmptyStateProps) {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">{message}</div>
  )
}

export default EmptyState
