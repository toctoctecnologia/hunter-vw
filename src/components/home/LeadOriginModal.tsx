import React from 'react';

export interface LeadOriginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  data?: any;
  origin?: string;
}

export function LeadOriginModal({ isOpen, onClose, data }: LeadOriginModalProps) {
  if (!isOpen) return null;
  
  return (
    <div>
      {/* Lead Origin Modal Placeholder */}
      Lead Origin Modal
    </div>
  );
}