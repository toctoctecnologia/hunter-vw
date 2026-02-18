import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateUserRoletaoParticipation } from '@/services/users';

interface UserStatusSwitchProps {
  userId: string;
  canClaimRoletao: boolean;
  onChange?: (canClaimRoletao: boolean) => void;
}

export default function UserStatusSwitch({
  userId,
  canClaimRoletao: initialCanClaimRoletao,
  onChange,
}: UserStatusSwitchProps) {
  const [canClaimRoletao, setCanClaimRoletao] = useState(initialCanClaimRoletao);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCanClaimRoletao(initialCanClaimRoletao);
  }, [initialCanClaimRoletao]);

  const handleToggle = async (checked: boolean) => {
    const previous = canClaimRoletao;
    setCanClaimRoletao(checked);
    setLoading(true);
    try {
      await updateUserRoletaoParticipation(userId, checked);
      toast({
        title: checked ? 'Corretor participando do roletão' : 'Corretor fora do roletão',
        variant: 'success',
      });
      onChange?.(checked);
    } catch {
      setCanClaimRoletao(previous);
      toast({
        title: 'Erro ao atualizar participação no roletão',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          canClaimRoletao
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
        )}
      >
        {canClaimRoletao ? 'Participando do roletão' : 'Fora do roletão'}
      </span>
      <Switch checked={canClaimRoletao} onCheckedChange={handleToggle} disabled={loading} />
    </div>
  );
}

