import React from 'react';
import BaseAppLayout from '@/layouts/AppLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, description }) => {
  return (
    <BaseAppLayout>
      <div className="px-6 py-5">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {children}
      </div>
    </BaseAppLayout>
  );
};
