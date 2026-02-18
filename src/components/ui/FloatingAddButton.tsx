import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingAddButton = ({ className, ...props }: FloatingAddButtonProps) => {
  return (
    <button
      {...props}
      aria-label="Adicionar"
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center shadow-lg z-[1000]',
        className
      )}
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        <Plus size={24} className="text-[hsl(var(--accent))]" />
      </div>
    </button>
  );
};

export default FloatingAddButton;
