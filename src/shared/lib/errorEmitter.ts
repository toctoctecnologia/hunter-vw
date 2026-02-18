import { AppError } from '@/shared/lib/api';

type Listener = (error: AppError) => void;

class ErrorEmitter {
  private listener?: Listener;

  on(listener: Listener) {
    this.listener = listener;
  }

  emit(error: AppError) {
    this.listener?.(error);
  }
}

export const errorEmitter = new ErrorEmitter();
