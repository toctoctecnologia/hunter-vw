'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>
    </div>
  );
}
