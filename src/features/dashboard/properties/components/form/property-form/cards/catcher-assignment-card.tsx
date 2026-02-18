'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, UserCheck, Star, User, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PropertyCatcherAssignmentItem } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import {
  getCatchers,
  newCatcherAssignment,
  updateCatcherAssignment,
  deleteCatcherAssignment,
} from '@/features/dashboard/properties/api/property-catcher-assignment';

import {
  catcherAssignmentSchema,
  PropertyCatcherAssignmentFormData,
} from '@/features/dashboard/properties/components/form/property-catcher-assignment-form/schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';
import { removeNonNumeric } from '@/shared/lib/masks';

interface CatcherAssignmentCardProps {
  propertyUuid: string;
}

export function CatcherAssignmentCard({ propertyUuid }: CatcherAssignmentCardProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [deletingCatcher, setDeletingCatcher] = useState<PropertyCatcherAssignmentItem | null>(null);
  const [editingCatcher, setEditingCatcher] = useState<PropertyCatcherAssignmentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>({
    uuid: editingCatcher ? editingCatcher.catcherUuid : '',
    name: editingCatcher ? editingCatcher.catcherName : '',
  });

  const { data: catchers = [], isLoading } = useQuery({
    queryKey: ['property-catchers', propertyUuid],
    queryFn: () => getCatchers(propertyUuid),
  });

  const form = useForm<PropertyCatcherAssignmentFormData>({
    resolver: zodResolver(catcherAssignmentSchema),
    defaultValues: {
      percentage: '',
      referredBy: '',
      catcherUuid: '',
      isMain: false,
    },
  });

  useEffect(() => {
    if (editingCatcher) {
      form.reset({
        catcherUuid: editingCatcher.catcherUuid,
        percentage: String(editingCatcher.percentage),
        referredBy: editingCatcher.referredBy || '',
        isMain: editingCatcher.isMain,
      });
    }
  }, [editingCatcher, form]);

  const createMutation = useMutation({
    mutationFn: (data: PropertyCatcherAssignmentFormData) =>
      newCatcherAssignment(propertyUuid, {
        ...data,
        catcherUuid: selectedCatcher?.uuid,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-catchers', propertyUuid] });
      toast.success('Captador adicionado com sucesso');
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PropertyCatcherAssignmentFormData }) =>
      updateCatcherAssignment(uuid, {
        ...data,
        catcherUuid: selectedCatcher?.uuid,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-catchers', propertyUuid] });
      toast.success('Captador atualizado com sucesso');
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (catcherAssignmentUuid: string) => deleteCatcherAssignment(propertyUuid, catcherAssignmentUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-catchers', propertyUuid] });
      toast.success('Captador removido com sucesso');
      setIsDeleteModalOpen(false);
      setDeletingCatcher(null);
    },
  });

  const handleOpenModal = (catcher?: PropertyCatcherAssignmentItem) => {
    if (catcher) {
      setEditingCatcher(catcher);
    } else {
      setEditingCatcher(null);
      form.reset({
        catcherUuid: '',
        percentage: '',
        referredBy: '',
        isMain: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCatcher(null);
    form.reset();
  };

  const handleSubmit = (data: PropertyCatcherAssignmentFormData) => {
    if (editingCatcher) {
      updateMutation.mutate({ uuid: editingCatcher.uuid, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleOpenDeleteModal = (catcher: PropertyCatcherAssignmentItem) => {
    setDeletingCatcher(catcher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCatcher) {
      deleteMutation.mutate(deletingCatcher.uuid);
    }
  };

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            setSelectedCatcher(selectedItem[0]);
          } else {
            setSelectedCatcher(null);
          }
          setShowCatcherModal(false);
        }}
      />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCatcher ? 'Editar Captador' : 'Novo Captador'}
        description={editingCatcher ? 'Edite as informações do captador' : 'Preencha as informações do novo captador'}
      >
        <Form {...form}>
          <form className="space-y-4">
            <div className="space-y-2">
              <TypographyMuted>Selecione o captador</TypographyMuted>
              <Button
                variant="outline"
                type="button"
                className={cn('w-full justify-start text-left font-normal', !selectedCatcher && 'text-muted-foreground')}
                onClick={() => setShowCatcherModal(true)}
              >
                <User className="mr-2 h-4 w-4" />
                {selectedCatcher?.name ? selectedCatcher.name : 'Selecionar Captador'}
                {selectedCatcher && (
                  <X
                    className="ml-auto h-4 w-4 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCatcher(null);
                    }}
                  />
                )}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentagem (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 50" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referredBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicado por</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de quem indicou" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isMain"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Captador Principal</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingCatcher ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCatcher(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Remover Captador"
        description="Tem certeza que deseja remover este captador? Esta ação não pode ser desfeita."
      />

      <Card>
        <CardHeader
          title="Captadores"
          icon={UserCheck}
          actionText="Adicionar"
          actionIcon={Plus}
          onAction={
            hasFeature(user?.userInfo.profile.permissions, '2507')
              ? (e) => {
                  e.preventDefault();
                  handleOpenModal();
                }
              : undefined
          }
        />

        <CardContent>
          {isLoading ? (
            <Loading />
          ) : catchers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum captador cadastrado</p>
              <p className="text-sm">Clique em &quot;Adicionar&quot; para cadastrar um novo captador</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Porcentagem</TableHead>
                  <TableHead>Indicado por</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catchers.map((catcher) => (
                  <TableRow key={catcher.uuid}>
                    <TableCell className="font-medium">{catcher.catcherName}</TableCell>
                    <TableCell>{catcher.catcherEmail}</TableCell>
                    <TableCell>{catcher.percentage}%</TableCell>
                    <TableCell>{catcher.referredBy || '-'}</TableCell>
                    <TableCell>
                      {catcher.isMain ? (
                        <Badge className="gap-1 bg-green-600 text-white">
                          <Star className="h-3 w-3" />
                          Principal
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {hasFeature(user?.userInfo.profile.permissions, '2507') && (
                        <div className="flex justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenModal(catcher)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(catcher)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
