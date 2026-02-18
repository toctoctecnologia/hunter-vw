import { PropsWithChildren, useEffect, useState } from 'react';
import { FilterIcon, LucideIcon, Search } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface FilterAddButtonProps extends React.ComponentProps<'button'> {
  icon: LucideIcon;
}

function FilterAddButton({ icon: Icon, children, className, ...rest }: FilterAddButtonProps) {
  return (
    <>
      <Button className={cn('w-full md:w-auto', className)} {...rest}>
        <Icon className="size-4" />
        {children}
      </Button>
    </>
  );
}

interface FilterSearchInputProps extends React.ComponentProps<'input'> {
  showFilterButton?: boolean;
  onFilter?: () => void;
  debounceMs?: number;
}

function FilterSearchInput({
  onFilter,
  showFilterButton = true,
  debounceMs = 500,
  onChange,
  value,
  ...rest
}: FilterSearchInputProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        const event = {
          target: { value: internalValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      <Input
        icon={Search}
        placeholder="Pesquisar..."
        containerClassName="w-full"
        value={internalValue}
        onChange={handleChange}
        {...rest}
      />
      {showFilterButton && (
        <Button size="icon" onClick={() => onFilter?.()}>
          <FilterIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}

interface FilterProps extends PropsWithChildren {
  className?: string;
}

function Filter({ children, className }: FilterProps) {
  return <div className={cn('flex gap-4 flex-wrap', className)}>{children}</div>;
}

export { Filter, FilterSearchInput, FilterAddButton };
