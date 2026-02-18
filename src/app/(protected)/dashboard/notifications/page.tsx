'use client';
import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
} from '@/features/dashboard/notification/api/notifications';

import { NotificationCard } from '@/features/dashboard/notification/components/notification-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

export default function Page() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });

  const {
    data: notifications = { content: [], totalPages: 0, totalElements: 0 },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications', pagination],
    queryFn: () => getNotifications(pagination),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificação removida com sucesso');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const { allNotifications, unreadNotifications, readNotifications } = useMemo(() => {
    const all = notifications.content;
    const unread = notifications.content.filter((n) => !n.isViewed);
    const read = notifications.content.filter((n) => n.isViewed);
    return { allNotifications: all, unreadNotifications: unread, readNotifications: read };
  }, [notifications]);

  const handleDelete = (uuid: string) => deleteMutation.mutate(uuid);
  const handleMarkAsRead = (uuid: string) => markAsReadMutation.mutate([uuid]);

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = notifications.totalPages || 0;

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard title="Erro ao carregar notificações" error={error} />;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 rounded-xl p-1">
        <TabsTrigger value="all">Todas ({allNotifications.length})</TabsTrigger>
        <TabsTrigger value="no-read">Não lidas ({unreadNotifications.length})</TabsTrigger>
        <TabsTrigger value="read">Lidas ({readNotifications.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhuma notificação</p>
            <p className="text-sm text-muted-foreground">Você não tem notificações no momento</p>
          </div>
        ) : (
          allNotifications.map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="no-read" className="space-y-4">
        {unreadNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhuma notificação não lida</p>
            <p className="text-sm text-muted-foreground">Todas as suas notificações foram lidas</p>
          </div>
        ) : (
          unreadNotifications.map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="read" className="space-y-4">
        {readNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhuma notificação lida</p>
            <p className="text-sm text-muted-foreground">As notificações lidas aparecerão aqui</p>
          </div>
        ) : (
          readNotifications.map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </TabsContent>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(0, pagination.pageIndex - 1))}
                  className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 10) {
                  page = i;
                } else if (pagination.pageIndex < 3) {
                  page = i;
                } else if (pagination.pageIndex > totalPages - 3) {
                  page = totalPages - 10 + i;
                } else {
                  page = pagination.pageIndex - 2 + i;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={pagination.pageIndex === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages - 1, pagination.pageIndex + 1))}
                  className={pagination.pageIndex === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Tabs>
  );
}
