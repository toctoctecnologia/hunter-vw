'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Key } from 'lucide-react';
import { toast } from 'sonner';

import { propertyKeychainStatusLabels, propertyKeychainStatusVariantsLabels } from '@/shared/lib/utils';
import { PropertyKeychainStatus, PropertyKeychainItem } from '@/shared/types';

import { getKeyChains, newKeyChain, updateKeyChain, deleteKeyChain } from '@/features/dashboard/properties/api/property-keychain';

import {
  propertyKeychainSchema,
  PropertyKeychainFormData,
} from '@/features/dashboard/properties/components/form/property-keychain-form/schema';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';
import { removeNonNumeric } from '@/shared/lib/masks';

interface PropertyKeychainCardProps {
  propertyUuid: string;
}

export function PropertyKeychainCard({ propertyUuid }: PropertyKeychainCardProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [deletingKeychain, setDeletingKeychain] = useState<PropertyKeychainItem | null>(null);
  const [editingKeychain, setEditingKeychain] = useState<PropertyKeychainItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: keychains = [], isLoading } = useQuery({
    queryKey: ['property-keychains', propertyUuid],
    queryFn: () => getKeyChains(propertyUuid),
  });

  const form = useForm<PropertyKeychainFormData>({
    resolver: zodResolver(propertyKeychainSchema),
    defaultValues: {
      status: PropertyKeychainStatus.ATIVO,
      unit: '',
      board: '',
      boardPosition: '',
      sealNumber: '',
      keyQuantity: '',
      observation: '',
    },
  });

  useEffect(() => {
    if (editingKeychain) {
      form.reset({
        status: editingKeychain.status,
        unit: editingKeychain.unit || '',
        board: editingKeychain.board || '',
        boardPosition: editingKeychain.boardPosition || '',
        sealNumber: editingKeychain.sealNumber || '',
        keyQuantity: String(editingKeychain.keyQuantity) || '',
        observation: editingKeychain.observation || '',
      });
    }
  }, [editingKeychain, form]);

  const createMutation = useMutation({
    mutationFn: (data: PropertyKeychainFormData) => newKeyChain(propertyUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-keychains', propertyUuid] });
      toast.success('Chaveiro adicionado com sucesso');
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PropertyKeychainFormData }) => updateKeyChain(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-keychains', propertyUuid] });
      toast.success('Chaveiro atualizado com sucesso');
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (keychainUuid: string) => deleteKeyChain(propertyUuid, keychainUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-keychains', propertyUuid] });
      toast.success('Chaveiro removido com sucesso');
      setIsDeleteModalOpen(false);
      setDeletingKeychain(null);
    },
  });

  const handleOpenModal = (keychain?: PropertyKeychainItem) => {
    if (keychain) {
      setEditingKeychain(keychain);
    } else {
      setEditingKeychain(null);
      form.reset({
        status: PropertyKeychainStatus.ATIVO,
        unit: '',
        board: '',
        boardPosition: '',
        sealNumber: '',
        keyQuantity: '',
        observation: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKeychain(null);
    form.reset();
  };

  const handleSubmit = (data: PropertyKeychainFormData) => {
    if (editingKeychain) {
      updateMutation.mutate({ uuid: editingKeychain.uuid, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleOpenDeleteModal = (keychain: PropertyKeychainItem) => {
    setDeletingKeychain(keychain);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingKeychain) {
      deleteMutation.mutate(deletingKeychain.uuid);
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingKeychain ? 'Editar Chaveiro' : 'Novo Chaveiro'}
        description={editingKeychain ? 'Edite as informações do chaveiro' : 'Preencha as informações do novo chaveiro'}
      >
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PropertyKeychainStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {propertyKeychainStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Chaves</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quadro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="boardPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição no Quadro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sealNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Lacre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações sobre o chaveiro..." className="resize-none" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)} isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingKeychain ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingKeychain(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        title="Remover Chaveiro"
        description="Tem certeza que deseja remover este chaveiro? Esta ação não pode ser desfeita."
      />

      <Card>
        <CardHeader
          title="Chaveiros"
          icon={Key}
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
          ) : keychains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum chaveiro cadastrado</p>
              <p className="text-sm">Clique em &quot;Adicionar&quot; para cadastrar um novo chaveiro</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Quadro</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Lacre</TableHead>
                  <TableHead>Qtd. Chaves</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keychains.map((keychain) => (
                  <TableRow key={keychain.uuid}>
                    <TableCell>
                      <Badge variant={propertyKeychainStatusVariantsLabels[keychain.status]}>
                        {propertyKeychainStatusLabels[keychain.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{keychain.unit || '-'}</TableCell>
                    <TableCell>{keychain.board || '-'}</TableCell>
                    <TableCell>{keychain.boardPosition || '-'}</TableCell>
                    <TableCell>{keychain.sealNumber || '-'}</TableCell>
                    <TableCell>{keychain.keyQuantity}</TableCell>
                    <TableCell className="text-right">
                      {hasFeature(user?.userInfo.profile.permissions, '2507') && (
                        <div className="flex justify-end gap-1">
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenModal(keychain)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenDeleteModal(keychain)}>
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
