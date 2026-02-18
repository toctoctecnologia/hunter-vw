import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Crown, UserCheck, Badge as BadgeIcon, LifeBuoy, Settings, Lock } from 'lucide-react';
import type { Role } from '@/data/accessControl';
import { fetchRoles, fetchPermissions, updateRole, deleteRole } from '@/data/accessControl';
import type { Permission } from '@/data/accessControl/permissions';
import { useToast } from '@/hooks/use-toast';
import AddRoleButton from './components/AddRoleButton';
import RoleFormModal from './components/RoleFormModal';

function AccessManagement() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const permissions = useMemo(() => fetchPermissions(), []);
  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, { id: string; label: string; permissions: Permission[] }>();
    permissions.forEach(permission => {
      const moduleId = permission.module.id;
      if (!groups.has(moduleId)) {
        groups.set(moduleId, {
          id: moduleId,
          label: permission.module.label,
          permissions: [],
        });
      }
      groups.get(moduleId)?.permissions.push(permission);
    });
    return Array.from(groups.values());
  }, [permissions]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const scopeLabels: Record<Role['scope'], string> = useMemo(() => ({
    all: 'Toda a organização',
    team: 'Minha equipe',
    self: 'Somente eu',
  }), []);

  useEffect(() => {
    const loadedRoles = fetchRoles();
    setRoles(loadedRoles);
    if (loadedRoles.length > 0) {
      setSelectedRole(loadedRoles[0]);
    }
  }, []);

  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      case 'gestao-api':
        navigate('/gestao-api');
        break;
      case 'gestao-roletao':
        navigate('/gestao-roletao');
        break;
      case 'gestao-relatorios':
        navigate('/gestao-relatorios');
        break;
      case 'gestao-acessos':
        navigate('/gestao-acessos');
        break;
      default:
        break;
    }
  };

  const togglePermission = async (permId: string) => {
    if (!selectedRole) return;
    if (selectedRole.builtin) {
      toast({ title: 'Perfis padrão não podem ter permissões alteradas', variant: 'warning' });
      return;
    }

    const hasPerm = selectedRole.permissions.includes(permId);
    const updatedPerms = hasPerm
      ? selectedRole.permissions.filter(p => p !== permId)
      : [...selectedRole.permissions, permId];

    const updatedRole = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updatedRole);
    
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id ? updatedRole : role
    );
    setRoles(updatedRoles);

    setLoading(true);
    try {
      await updateRole(selectedRole.id, { permissions: updatedPerms });
      toast({ title: 'Permissão atualizada', variant: 'success' });
    } catch {
      // Revert on error
      setSelectedRole(selectedRole);
      setRoles(roles);
      toast({ title: 'Erro ao atualizar permissão', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (roleId: string) => {
    const target = roles.find(role => role.id === roleId);
    if (target?.builtin) {
      toast({ title: 'Perfis padrão não podem ser removidos', variant: 'warning' });
      return;
    }

    deleteRole(roleId);
    const updatedRoles = fetchRoles();
    setRoles(updatedRoles);
    if (selectedRole?.id === roleId && updatedRoles.length > 0) {
      setSelectedRole(updatedRoles[0]);
    }
    toast({ title: 'Perfil removido', variant: 'success' });
  };

  const handleEditRole = (role: Role) => {
    if (role.builtin) {
      toast({ title: 'Perfis padrão não podem ser editados', variant: 'warning' });
      return;
    }
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'supervisor':
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case 'operator':
        return <BadgeIcon className="h-5 w-5 text-emerald-500" />;
      case 'support':
        return <LifeBuoy className="h-5 w-5 text-purple-500" />;
      default:
        return <UserCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleDescription = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return 'Acesso completo à plataforma';
      case 'supervisor':
        return 'Acesso parcial, sem gerenciamento de acessos';
      case 'operator':
        return 'Acesso restrito a clientes, fotógrafos e serviços';
      case 'support':
        return 'Acesso ao módulo de suporte';
      default:
        return 'Perfil personalizado';
    }
  };

  return (
    <ResponsiveLayout activeTab="gestao-acessos" setActiveTab={handleMainTabChange}>
      <PageContainer className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão de acessos</h1>
          <p className="text-gray-600">Configure permissões para diferentes funções de usuários</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Top Section - Perfis de Acesso */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Perfis de Acesso</h2>
            </div>
            <div className="p-6 space-y-3">
              <TooltipProvider delayDuration={150}>
                {roles.map(role => (
                  <div
                    key={role.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedRole?.id === role.id
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(role.id)}
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">{role.name}</h3>
                          <p className="text-sm text-gray-500">{getRoleDescription(role.id)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {role.builtin && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                Padrão
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                              Escopo: {scopeLabels[role.scope]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {role.builtin ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <Lock className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white border-gray-900">
                              <p className="text-sm font-semibold">Perfil padrão</p>
                              <p className="text-xs text-gray-200">Este perfil não pode ser editado ou removido.</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRole(role);
                              }}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(role.id);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                >
                                  ✕
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-white border-gray-900">
                                <p className="text-sm font-semibold">Remover perfil</p>
                                <p className="text-xs text-gray-200">Esta ação não pode ser desfeita.</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TooltipProvider>
              <AddRoleButton onSave={(updatedRoles) => setRoles(updatedRoles)} />
            </div>
          </div>

          {/* Bottom Section - Permissões */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Permissões para {selectedRole?.name || 'Selecione um perfil'}
              </h2>
              {selectedRole && (
                <div className="flex items-center gap-2 mt-2">
                  {getRoleIcon(selectedRole.id)}
                  <span className="font-medium text-gray-900 capitalize">{selectedRole.name}</span>
                  <p className="text-sm text-gray-500 ml-2">{getRoleDescription(selectedRole.id)}</p>
                </div>
              )}
            </div>
            
              {selectedRole && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-gray-200 text-gray-600">
                      Escopo: {scopeLabels[selectedRole.scope]}
                    </Badge>
                    {selectedRole.builtin && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                        Perfil padrão
                      </Badge>
                    )}
                  </div>

                  {groupedPermissions.map(group => (
                    <div key={group.id} className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {group.label}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {group.permissions.map(perm => (
                        <div key={perm.id} className="flex items-start justify-between gap-4 border border-gray-200 rounded-xl px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{perm.name}</p>
                            <p className="text-sm text-gray-500">{perm.description}</p>
                          </div>
                          <Switch
                            checked={selectedRole.permissions.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id)}
                            disabled={selectedRole.builtin || loading}
                            className="data-[state=checked]:bg-orange-500 mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Todas as alterações são aplicadas automaticamente.</p>
                      <p className="text-yellow-700">Os usuários afetados terão suas permissões atualizadas na próxima sessão.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="fixed top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Salvando...</span>
          </div>
        )}

        <RoleFormModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          role={selectedRole}
          onSave={(updatedRoles) => {
            setRoles(updatedRoles);
            const updatedRole = updatedRoles.find(r => r.id === selectedRole?.id);
            if (updatedRole) setSelectedRole(updatedRole);
          }}
        />
      </PageContainer>
    </ResponsiveLayout>
  );
}
export default AccessManagement;
