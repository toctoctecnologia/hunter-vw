import { Edit2 } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InlineEditableProps {
  value?: string;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}
export function InlineEditable({
  value = '',
  onSave,
  placeholder = '-',
  className,
  multiline = false,
}: InlineEditableProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(value);
    buttonRef.current?.focus();
  };

  const commit = async (refocus = false) => {
    await onSave(draft);
    setEditing(false);
    if (refocus) buttonRef.current?.focus();
  };

  const sharedProps = {
    ref: inputRef,
    className: cn('border rounded px-2 py-1 text-sm', className),
    value: draft,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft(e.target.value),
    onBlur: () => commit(),
    onKeyDown: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!multiline && e.key === 'Enter') {
        e.preventDefault();
        commit(true);
      }
      if (multiline && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        commit(true);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
  };

  return (
    <AnimatePresence mode="wait">
      {editing ? (
        multiline ? (
          <motion.textarea
            key="textarea"
            {...(sharedProps as any)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.input
            key="input"
            {...(sharedProps as any)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          />
        )
      ) : (
        <motion.div
          key="view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn('flex items-center gap-1', className)}
        >
          <span className="text-sm text-gray-800">{value || placeholder}</span>
          <button
            type="button"
            aria-label="Editar"
            onClick={startEdit}
            ref={buttonRef}
            className="p-0 m-0"
          >
            <Edit2 className="w-4 h-4 text-gray-500 cursor-pointer" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InlineEditable;
