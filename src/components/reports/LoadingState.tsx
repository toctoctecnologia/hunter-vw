import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="p-4 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  )
}

export default LoadingState
