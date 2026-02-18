import { X } from 'lucide-react';
import { properties } from '@/data/properties';

export interface PropertySelection {
  id: number;
  codigo: string;
  titulo: string;
  endereco: string;
}

interface SelectPropertyDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (property: PropertySelection) => void;
}

export function SelectPropertyDialog({ open, onClose, onSelect }: SelectPropertyDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">Selecionar imóvel</h3>
          <div className="w-9 h-9" />
        </div>
        <div className="space-y-3">
          {properties.map(p => (
            <button
              key={p.id}
              onClick={() => {
                onSelect({
                  id: p.id,
                  codigo: p.code,
                  titulo: p.name,
                  endereco: p.address,
                });
                onClose();
              }}
              className="w-full p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 text-left flex items-center space-x-3"
            >
              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">{p.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectPropertyDialog;
