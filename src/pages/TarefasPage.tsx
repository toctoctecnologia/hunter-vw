import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight, ClipboardList, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Task } from '@/types/service-management';
import { listTasks } from '@/services/serviceTickets';
import { toast } from '@/hooks/use-toast';

const STATUS_LABELS: Record<Task['status'], string> = {
  a_fazer: 'A fazer',
  em_validacao: 'Em validação',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
  arquivada: 'Arquivada'
};

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      toast({
        title: 'Erro ao carregar tarefas',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const summary = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        acc[task.status] += 1;
        return acc;
      },
      {
        total: 0,
        a_fazer: 0,
        em_validacao: 0,
        em_execucao: 0,
        concluida: 0,
        arquivada: 0
      }
    );
  }, [tasks]);

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--bgPage))]">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accentSoft))] text-[hsl(var(--accent))] font-semibold">
                H
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Hunter</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Home</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">Tarefas</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher compact />
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback>HM</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tarefas sincronizadas</h1>
            <p className="text-sm text-muted-foreground">Visão derivada dos tickets de serviços.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            Total de tarefas: <span className="font-semibold text-foreground">{summary.total}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadTasks} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(['a_fazer', 'em_validacao', 'em_execucao', 'concluida', 'arquivada'] as Task['status'][]).map(status => (
            <Card key={status} className="p-4">
              <p className="text-xs text-muted-foreground">{STATUS_LABELS[status]}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{summary[status]}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa sincronizada.</p>
          ) : (
            tasks.map(task => (
              <Card key={task.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Ticket {task.metadata.code} · Cliente {task.metadata.client ?? 'N/A'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{STATUS_LABELS[task.status]}</Badge>
                    <Badge variant="outline">{task.priority}</Badge>
                    <Badge variant="outline">{task.assigneeName ?? 'Sem responsável'}</Badge>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Prazo: {task.dueAt ? new Date(task.dueAt).toLocaleString('pt-BR') : 'Sem prazo'}</p>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
