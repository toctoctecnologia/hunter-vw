'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Users, X } from 'lucide-react';
import { toast } from 'sonner';

import { normalizeCpfNumber, normalizeCnpjNumber, normalizePhoneNumber, removeNonNumeric } from '@/shared/lib/masks';
import { PropertyOwnerAssignmentItem } from '@/shared/types';

import {
  getOwners,
  newOwnerAssignment,
  updateOwnerAssignment,
  deleteOwnerAssignment,
} from '@/features/dashboard/properties/api/property-owner-assignment';

import {
  ownerAssignmentSchema,
  OwnerAssignmentFormData,
} from '@/features/dashboard/properties/components/form/property-owner-assignment-form/schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Input } from '@/shared/components/ui/input';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface OwnerAssignmentCardProps {
  propertyUuid: string;
}

export function OwnerAssignmentCard({ propertyUuid }: OwnerAssignmentCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [deletingOwner, setDeletingOwner] = useState<PropertyOwnerAssignmentItem | null>(null);
  const [editingOwner, setEditingOwner] = useState<PropertyOwnerAssignmentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['property-owners', propertyUuid],
    queryFn: () => getOwners(propertyUuid),
  });

  const form = useForm<OwnerAssignmentFormData>({
    resolver: zodResolver(ownerAssignmentSchema),
    defaultValues: {
      name: '',
      cpfCnpj: '',
      phone: '',
      percentage: '',
    },
  });

  useEffect(() => {
    if (editingOwner) {
      form.reset({
        name: editingOwner.name || '',
        cpfCnpj: editingOwner.cpfCnpj || '',
        phone: editingOwner.phone || '',
        percentage: String(editingOwner.percentage || ''),
      });
    }
  }, [editingOwner, form]);

  const createMutation = useMutation({
    mutationFn: (data: OwnerAssignmentFormData) => newOwnerAssignment(propertyUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-owners', propertyUuid] });
      toast.success('Proprietário adicionado com sucesso');
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: OwnerAssignmentFormData }) => updateOwnerAssignment(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-owners', propertyUuid] });
      toast.success('Proprietário atualizado com sucesso');
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ownerUuid: string) => deleteOwnerAssignment(propertyUuid, ownerUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-owners', propertyUuid] });
      toast.success('Proprietário removido com sucesso');
      setIsDeleteModalOpen(false);
      setDeletingOwner(null);
    },
  });

  const handleOpenForm = (owner?: PropertyOwnerAssignmentItem) => {
    if (owner) {
      setEditingOwner(owner);
    } else {
      setEditingOwner(null);
      form.reset({
        name: '',
        cpfCnpj: '',
        phone: '',
        percentage: '',
      });
    }
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingOwner(null);
    form.reset();
  };

  const handleSubmit = (data: OwnerAssignmentFormData) => {
    if (editingOwner) {
      updateMutation.mutate({ uuid: editingOwner.uuid, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleOpenDeleteModal = (owner: PropertyOwnerAssignmentItem) => {
    setDeletingOwner(owner);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingOwner) {
      deleteMutation.mutate(deletingOwner.uuid);
    }
  };

  const normalizeCpfCnpj = (value: string | undefined) => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return normalizeCpfNumber(value);
    }
    return normalizeCnpjNumber(value);
  };

  const handleFormSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      handleSubmit(form.getValues());
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingOwner(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Remover Proprietário"
        description="Tem certeza que deseja remover este proprietário? Esta ação não pode ser desfeita."
      />

      <Card>
        <CardHeader
          title="Proprietários"
          icon={Users}
          actionText="Adicionar"
          actionIcon={Plus}
          onAction={
            hasFeature(user?.userInfo.profile.permissions, '2507')
              ? (e) => {
                  e.preventDefault();
                  handleOpenForm();
                }
              : undefined
          }
        />

        <CardContent className="space-y-4">
          {isFormVisible && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{editingOwner ? 'Editar Proprietário' : 'Novo Proprietário'}</h4>
                <Button type="button" variant="ghost" size="icon" onClick={handleCloseForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Form {...form}>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do proprietário" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/CNPJ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              {...field}
                              onChange={(e) => field.onChange(normalizeCpfCnpj(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentagem (%)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 50"
                              {...field}
                              onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(19) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCloseForm}>
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleFormSubmit}
                      isLoading={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingOwner ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}

          {isLoading ? (
            <Loading />
          ) : owners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum proprietário cadastrado</p>
              <p className="text-sm">Clique em &quot;Adicionar&quot; para cadastrar um novo proprietário</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Porcentagem</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.uuid}>
                    <TableCell>{owner.name || '-'}</TableCell>
                    <TableCell>{owner.cpfCnpj || '-'}</TableCell>
                    <TableCell>{owner.percentage}%</TableCell>
                    <TableCell>{owner.phone || '-'}</TableCell>
                    <TableCell className="text-right">
                      {hasFeature(user?.userInfo.profile.permissions, '2507') && (
                        <div className="flex justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenForm(owner)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(owner)}>
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
