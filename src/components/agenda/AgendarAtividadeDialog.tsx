import { useToast } from '@/hooks/use-toast';
import { useVisitQuick } from '@/hooks/agenda/useVisitQuick';

/**
 * Dialog component to schedule quick activities.
 * The actual UI is handled elsewhere; this component focuses on invoking
 * the schedule action and handling success/error states.
 */
export function AgendarAtividadeDialog() {
  const { schedule, setQuery, setSelected, setDate, setTime } = useVisitQuick();
  const { toast } = useToast();

  const handleSchedule = async () => {
    try {
      const { success } = await schedule();
      if (!success) {
        toast({ title: 'Falha ao agendar', description: 'Tente novamente mais tarde.' });
        return;
      }
      // Reset form on success
      setQuery('');
      setSelected(null);
      setDate('');
      setTime('');
    } catch {
      toast({ title: 'Falha ao agendar', description: 'Tente novamente mais tarde.' });
    }
  };

  // UI omitted; this placeholder triggers scheduling when needed
  return (
    <button onClick={handleSchedule} className="hidden" />
  );
}

export default AgendarAtividadeDialog;
