import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PropertyPreviewSkeletonProps {
  compact?: boolean;
  showUpdateButton?: boolean;
}

export function PropertyPreviewSkeleton({ compact = false, showUpdateButton = false }: PropertyPreviewSkeletonProps) {
  return (
    <div className={cn('border rounded-lg', compact ? 'p-4 space-y-3' : 'p-6 space-y-4')}>
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-24" />
      <div className="flex gap-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {showUpdateButton && <Skeleton className="h-10 w-32" />}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default PropertyPreviewSkeleton;

