import { AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

interface ErrorModalProps {
  title: string;
  messages: string[];
  open: boolean;
  onClose: () => void;
}

export function ErrorModal({ title, messages, open, onClose }: ErrorModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              {messages.length === 1 ? (
                <p>{messages[0]}</p>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Entendi</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
