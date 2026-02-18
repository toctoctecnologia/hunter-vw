import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import {
  fetchPermissions,
  fetchRoles,
  createRole,
  updateRole,
  type Role,
} from '@/data/accessControl';
import { PERMISSION_MODULES } from '@/data/accessControl/permissions';

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
  onSave?: (roles: Role[]) => void;
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RoleFormModal({
  open,
  onOpenChange,
  role,
  onSave,
}: RoleFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [scope, setScope] = useState<Role['scope']>('self');
  const [error, setError] = useState('');

  const isBuiltin = role?.builtin ?? false;

  const allPermissions = useMemo(() => fetchPermissions(), []);
  const scopeOptions = useMemo(
    () => [
      { value: 'all' as Role['scope'], label: 'Todos', description: 'Acesso a todos os registros da empresa' },
      { value: 'team' as Role['scope'], label: 'Equipe', description: 'Acesso restrito aos registros da equipe' },
      { value: 'self' as Role['scope'], label: 'Próprio', description: 'Acesso apenas aos registros próprios' },
    ],
    []
  );
  const permsByModule = useMemo(() => {
    const permissionIndex = new Map(allPermissions.map(perm => [perm.id, perm]));

    const modules = PERMISSION_MODULES.map(module => ({
      id: module.id,
      label: module.label,
      description: module.description,
      actions: module.actions.map(action => {
        const permissionId = `${module.id}.${action.id}`;
        const fallback = permissionIndex.get(permissionId);
        return {
          id: permissionId,
          label: action.label,
          description: action.description ?? fallback?.description ?? '',
        };
      }),
    }));

    permissionIndex.forEach(permission => {
      const module = modules.find(item => item.id === permission.module.id);
      if (module) {
        const alreadyRegistered = module.actions.some(action => action.id === permission.id);
        if (!alreadyRegistered) {
          module.actions.push({
            id: permission.id,
            label: permission.action?.label ?? permission.name,
            description: permission.description,
          });
        }
        return;
      }

      modules.push({
        id: permission.module.id,
        label: permission.module.label,
        description: undefined,
        actions: [{
          id: permission.id,
          label: permission.action?.label ?? permission.name,
          description: permission.description,
        }],
      });
    });

    return modules.map(module => ({
      ...module,
      actions: module.actions.sort((a, b) => a.label.localeCompare(b.label)),
    }));
  }, [allPermissions]);

  useEffect(() => {
    if (open) {
      setName(role?.name ?? '');
      setDescription(role?.description ?? '');
      setPermissions(role?.permissions ?? []);
      setScope(role?.scope ?? 'self');
      setError('');
    }
  }, [open, role]);

  const handlePermissionChange = (permId: string, nextValue: CheckedState) => {
    setPermissions(prev => {
      const next = new Set(prev);
      if (nextValue === true || nextValue === 'indeterminate') {
        next.add(permId);
      } else {
        next.delete(permId);
      }
      return Array.from(next);
    });
  };

  const handleSave = () => {
    const existing = fetchRoles();
    const normalizedName = name.trim();

    if (!normalizedName) {
      setError('Informe um nome para o perfil');
      return;
    }

    const duplicate = existing.some(r =>
      r.name.trim().toLowerCase() === normalizedName.toLowerCase() && r.id !== role?.id
    );
    if (duplicate) {
      setError('Já existe um perfil com este nome');
      return;
    }

    const baseId = role?.id ?? slugify(normalizedName);
    const generatedId = baseId || `role-${Date.now()}`;
    const descriptionValue = description.trim();

    const payload: Role = {
      id: generatedId,
      name: normalizedName,
      description: descriptionValue ? descriptionValue : undefined,
      permissions,
      scope,
      builtin: role?.builtin ?? false,
    };

    const updated = role
      ? updateRole(role.id, payload)
      : createRole(payload);

    onSave?.(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-gray-200 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {role ? 'Editar Perfil' : 'Novo Perfil'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nome do perfil
            </label>
            <Input
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="h-11 rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-[hsl(var(--accent))]"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Escopo
            </label>
            <RadioGroup
              value={scope}
              onValueChange={(value) => {
                if (!isBuiltin) {
                  setScope(value as Role['scope']);
                }
              }}
              className="space-y-2"
            >
              {scopeOptions.map(option => (
                <div
                  key={option.value}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl"
                >
                  <div className="flex flex-col">
                    <Label htmlFor={`scope-${option.value}`} className="text-sm font-medium text-gray-700">
                      {option.label}
                    </Label>
                    <span className="text-xs text-gray-500">{option.description}</span>
                  </div>
                  <RadioGroupItem
                    value={option.value}
                    id={`scope-${option.value}`}
                    className="border-gray-300 text-orange-500"
                    disabled={isBuiltin}
                  />
                </div>
              ))}
            </RadioGroup>
            {isBuiltin && (
              <p className="text-xs text-gray-500">
                Perfis padrão possuem escopo fixo e não podem ser alterados.
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Permissões</h3>
              <p className="text-xs text-gray-500 mt-1">
                Defina quais ações este perfil poderá executar em cada módulo da plataforma.
              </p>
            </div>

            {permsByModule.map(group => (
              <div key={group.id} className="border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-gray-800">{group.label}</h4>
                  {group.description && (
                    <p className="text-xs text-gray-500">{group.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {group.actions.map(action => (
                    <label
                      key={action.id}
                      className="flex items-start gap-3 rounded-lg border border-transparent hover:border-gray-200 p-3 transition-colors"
                    >
                      <Checkbox
                        checked={permissions.includes(action.id)}
                        onCheckedChange={(checked) => handlePermissionChange(action.id, checked)}
                        disabled={isBuiltin}
                        className="mt-1 border-gray-300 data-[state=checked]:bg-[hsl(var(--accent))] data-[state=checked]:border-[hsl(var(--accent))]"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800">{action.label}</p>
                        {action.description && (
                          <p className="text-xs text-gray-500">{action.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-gray-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[hsl(var(--accent))] text-white rounded-xl hover:opacity-95"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

