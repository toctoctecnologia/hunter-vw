interface EmptyStateProps {
  title: string
  subtitle: string
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm">{subtitle}</p>
    </div>
  )
}

export default EmptyState
