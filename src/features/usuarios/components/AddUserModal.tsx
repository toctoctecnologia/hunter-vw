import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { getPreset, getDefaultScope, PERMISSIONS } from "../rolePresets";
import { createUser } from "../api/createUser";
import { useToast } from "@/hooks/use-toast";
import type { UserInput, UserRole, VisibilityScope } from "../types";

const FILIAIS = ["Filial 01", "Filial 02", "Filial 03"];

export function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UserInput>({
    nome: "",
    email: "",
    telefone: "",
    role: "corretor",
    filial: "",
    scope: "proprio",
    permissions: [],
    ativo: true,
  });

  const preset = useMemo(() => getPreset(form.role), [form.role]);
  const defaultScope = useMemo(() => getDefaultScope(form.role), [form.role]);
  
  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const groups: Record<string, typeof PERMISSIONS> = {};
    PERMISSIONS.forEach(perm => {
      if (!groups[perm.module]) {
        groups[perm.module] = [];
      }
      groups[perm.module].push(perm);
    });
    return groups;
  }, []);

  const activePermissions = form.permissions.length > 0 ? form.permissions : preset;

  const canSave = Boolean(
    form.nome.trim() &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.role &&
    form.scope &&
    form.filial
  );

  const handleRoleChange = (role: UserRole) => {
    setForm(prev => ({
      ...prev,
      role,
      scope: getDefaultScope(role),
      permissions: [] // Reset permissions to use preset
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPerms = form.permissions.length > 0 ? form.permissions : preset;
    const newPermissions = checked
      ? [...currentPerms, permissionId]
      : currentPerms.filter(id => id !== permissionId);
    
    setForm(prev => ({ ...prev, permissions: newPermissions }));
  };

  const handleSave = async () => {
    if (!canSave) return;
    
    setLoading(true);
    try {
      await createUser({
        ...form,
        permissions: activePermissions
      });
      
      toast({
        title: "Usuário criado com sucesso",
        description: `${form.nome} foi adicionado ao sistema.`
      });
      
      // Reset form
      setForm({
        nome: "",
        email: "",
        telefone: "",
        role: "corretor",
        filial: "",
        scope: "proprio",
        permissions: [],
        ativo: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_6px_20px_rgba(16,24,40,0.08)] max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-7 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Novo usuário</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form - Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-7">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:outline-none"
                    value={form.nome}
                    onChange={e => setForm(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex.: Maria Silva"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:outline-none"
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="maria@empresa.com"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:outline-none"
                    value={form.telefone}
                    onChange={e => setForm(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(00) 90000-0000"
                  />
                </div>

                {/* Papel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Papel/Hierarquia <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:outline-none"
                    value={form.role}
                    onChange={e => handleRoleChange(e.target.value as UserRole)}
                  >
                    <option value="admin">Admin</option>
                    <option value="gestor">Gestor</option>
                    <option value="backoffice">Backoffice</option>
                    <option value="corretor">Corretor</option>
                  </select>
                </div>

                {/* Filial */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loja/Filial <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:border-[hsl(var(--accent))] focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:outline-none"
                    value={form.filial}
                    onChange={e => setForm(prev => ({ ...prev, filial: e.target.value }))}
                  >
                    <option value="" disabled>Selecione...</option>
                    {FILIAIS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Usado para relatórios e controle de acesso por unidade.
                  </p>
                </div>

                {/* Escopo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Escopo de visibilidade <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 space-y-2">
                    {(["todos", "equipe", "proprios"] as VisibilityScope[]).map(scope => (
                      <label key={scope} className="inline-flex items-center gap-2 text-sm text-gray-700 mr-4">
                        <input
                          type="radio"
                          name="scope"
                          checked={form.scope === scope}
                          onChange={() => setForm(prev => ({ ...prev, scope }))}
                          className="h-4 w-4 text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]/30"
                        />
                        <span className="capitalize">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Permissões por módulo</h4>
                <p className="text-xs text-gray-500 mb-4">
                  Carrega preset conforme o papel; você pode ajustar.
                </p>
                
                <div className="space-y-4">
                  {Object.entries(permissionsByModule).map(([module, permissions]) => (
                    <div key={module} className="border border-gray-200 rounded-xl p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">{module}</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map(permission => (
                          <label key={permission.id} className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={activePermissions.includes(permission.id)}
                              onChange={e => handlePermissionChange(permission.id, e.target.checked)}
                              className="h-4 w-4 text-[hsl(var(--accent))] rounded focus:ring-[hsl(var(--accent))]/30"
                            />
                            {permission.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="p-6 md:p-7 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={e => setForm(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="h-4 w-4 text-[hsl(var(--accent))] rounded focus:ring-[hsl(var(--accent))]/30"
                />
                Ativo
              </label>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!canSave || loading}
                  onClick={handleSave}
                  className="h-10 px-4 rounded-xl bg-[hsl(var(--accent))] text-white hover:bg-[#e65c00] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40 transition-colors"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}