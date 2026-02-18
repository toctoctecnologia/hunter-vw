'use client';

import { LucideIcon, Plus, X } from 'lucide-react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface FloatingActionButtonContextValue {
  isOpen: boolean;
  toggle: () => void;
}

const FloatingActionButtonContext = createContext<FloatingActionButtonContextValue | null>(null);

function useFloatingActionButton() {
  const context = useContext(FloatingActionButtonContext);
  if (!context) {
    throw new Error('FloatingActionButton compound components must be used within FloatingActionButton');
  }
  return context;
}

interface FloatingActionButtonRootProps {
  children: ReactNode;
  className?: string;
}

function FloatingActionButtonRoot({ children, className }: FloatingActionButtonRootProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <FloatingActionButtonContext.Provider value={{ isOpen, toggle }}>
      <div className={cn('fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3', className)}>{children}</div>
    </FloatingActionButtonContext.Provider>
  );
}

interface FloatingActionButtonTriggerProps {
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

function FloatingActionButtonTrigger({
  label = 'Criar novo',
  icon: Icon = Plus,
  onClick,
}: FloatingActionButtonTriggerProps) {
  const { isOpen, toggle } = useFloatingActionButton();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggle();
    }
  };

  const ActiveIcon = isOpen ? X : Icon;

  return (
    <Button onClick={handleClick} className="rounded-full shadow-lg hover:shadow-xl transition-all gap-2" size="lg">
      <ActiveIcon className="size-4" />
      {!isOpen && label}
    </Button>
  );
}

interface FloatingActionButtonItemProps {
  onClick: () => void;
  label: string;
  icon: LucideIcon;
  className?: string;
}

function FloatingActionButtonItem({ onClick, label, icon: Icon, className }: FloatingActionButtonItemProps) {
  const { isOpen, toggle } = useFloatingActionButton();

  const handleClick = () => {
    onClick();
    toggle();
  };

  if (!isOpen) return null;

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="text-sm font-medium bg-background px-3 py-1.5 rounded-md shadow-md border">{label}</span>
      <Button
        onClick={handleClick}
        className={cn('rounded-full shadow-lg hover:shadow-xl transition-all size-12', className)}
        size="icon"
      >
        <Icon className="size-5" />
      </Button>
    </div>
  );
}

export const FloatingActionButton = Object.assign(FloatingActionButtonRoot, {
  Trigger: FloatingActionButtonTrigger,
  Item: FloatingActionButtonItem,
});
