import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EventFormData, EventFormFields } from './EventFormFields';

export type { EventFormData };

interface EventFormContainerProps {
  initialData?: Partial<EventFormData>;
  onCancel: () => void;
  onSubmit: (data: EventFormData) => void;
  submitLabel?: string;
  children?: (props: {
    formData: EventFormData;
    setFormData: (data: Partial<EventFormData>) => void;
  }) => React.ReactNode;
}

export const EventFormContainer = ({
  initialData,
  onCancel,
  onSubmit,
  submitLabel = 'Criar evento',
  children
}: EventFormContainerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    guests: '',
    location: '',
    description: '',
    color: 'hsl(var(--accent))',
    ...(initialData || {})
  });

  const updateFormData = (data: Partial<EventFormData>) =>
    setFormData(prev => ({ ...prev, ...data }));

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um título para o evento.',
        variant: 'destructive'
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {children ? (
          children({ formData, setFormData: updateFormData })
        ) : (
          <EventFormFields formData={formData} setFormData={updateFormData} />
        )}
      </div>
      <div className="flex space-x-4 p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors font-medium"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};
