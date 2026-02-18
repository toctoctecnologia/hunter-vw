import React from 'react';

export interface ServiceDetailsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  service?: any;
}

export function ServiceDetailsModal({ isOpen, onClose, service }: ServiceDetailsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div>
      {/* Service Details Modal Placeholder */}
      Service Details Modal
    </div>
  );
}