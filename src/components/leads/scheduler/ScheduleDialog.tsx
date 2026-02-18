import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVisitPick } from '@/hooks/agenda';
import PropertyResultsList from '@/components/agenda/PropertyResultsList';

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string | number;
}

export function ScheduleDialog({ open, onClose, leadId }: ScheduleDialogProps) {
  const navigate = useNavigate();
  const { query, setQuery, results, selected, pick, clear } = useVisitPick();
  const [mode, setMode] = useState<'return' | 'visit'>('return');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const formComplete =
    mode === 'visit'
      ? Boolean(selected && date && time)
      : Boolean(date && time);

  const resetForm = () => {
    setDate('');
    setTime('');
    clear();
  };

  const createSimpleReturn = async () => {
    await fetch('/api/agenda/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, date, time, type: 'simple_return' }),
    });
  };

  const createVisit = async () => {
    await fetch('/api/agenda/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
        propertyId: selected?.id,
        date,
        time,
      }),
    });

    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'agendamento' }),
    });
  };

  const handleSubmit = async () => {
    if (mode === 'visit') {
      await createVisit();
    } else {
      await createSimpleReturn();
    }
    resetForm();
    onClose();
    navigate('/agenda?tab=tasks');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl w-[92vw] max-w-[520px] md:max-w-[980px] md:rounded-3xl">
        <DialogHeader>
          <DialogTitle>Agendar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('return')}
              className={`flex-1 p-2 rounded-xl text-sm font-medium ${
                mode === 'return' ? 'bg-orange-600 text-white' : 'bg-gray-100'
              }`}
            >
              Retornar para o cliente
            </button>
            <button
              onClick={() => setMode('visit')}
              className={`flex-1 p-2 rounded-xl text-sm font-medium ${
                mode === 'visit' ? 'bg-orange-600 text-white' : 'bg-gray-100'
              }`}
            >
              Visita Agendada
            </button>
          </div>

          {mode === 'visit' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Buscar imóvel..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
              />
              {selected ? (
                <div className="flex items-center justify-between border rounded-xl px-3 py-2">
                  <span className="truncate">{selected.title}</span>
                  <button
                    className="text-sm text-red-500"
                    onClick={() => pick(null)}
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <PropertyResultsList
                  items={results as any}
                  onSelect={p => pick(p as any)}
                />
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2"
            />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formComplete}
            className={`w-full p-3 rounded-xl font-semibold text-white ${
              formComplete
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Confirmar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleDialog;

