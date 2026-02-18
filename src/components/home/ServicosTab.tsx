import React from 'react';

export interface ServicosTabProps {
  services?: any[];
  onServiceClick?: (service: any) => void;
  onClose?: () => void;
}

export function ServicosTab({ services, onServiceClick }: ServicosTabProps) {
  return (
    <div>
      {/* Servicos Tab Placeholder */}
      Servicos Tab
    </div>
  );
}