import { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface StandardLayoutProps {
  children: ReactNode;
}

export const StandardLayout = ({ children }: StandardLayoutProps) => {
  return <AppLayout>{children}</AppLayout>;
};

export default StandardLayout;
