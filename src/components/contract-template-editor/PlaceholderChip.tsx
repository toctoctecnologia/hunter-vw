import { cn } from '@/lib/utils';

interface PlaceholderChipProps {
  label: string;
  placeholder: string;
  onClick?: () => void;
  variant?: 'inline' | 'sidebar';
  className?: string;
}

export const PlaceholderChip = ({
  label,
  placeholder,
  onClick,
  variant = 'sidebar',
  className
}: PlaceholderChipProps) => {
  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md',
          'bg-orange-100 text-orange-700 border border-orange-200',
          'font-mono text-sm cursor-default select-none',
          'transition-colors hover:bg-orange-150',
          className
        )}
        data-placeholder={placeholder}
        contentEditable={false}
      >
        {placeholder}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-lg',
        'text-sm text-left transition-all duration-150',
        'bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300',
        'group',
        className
      )}
    >
      <span className="text-gray-700 group-hover:text-gray-900 truncate">{label}</span>
      <span className="font-mono text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
        inserir
      </span>
    </button>
  );
};

export default PlaceholderChip;
