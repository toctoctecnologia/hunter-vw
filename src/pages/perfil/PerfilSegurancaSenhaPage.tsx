import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function PerfilSegurancaSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { toast } = useToast();

  const strengthLabels = [
    'Muito fraca',
    'Fraca',
    'Razoável',
    'Forte',
    'Muito forte'
  ];
  const strengthTextColors = [
    'text-red-400',
    'text-orange-400',
    'text-yellow-400',
    'text-green-400',
    'text-green-600'
  ];
  const strengthBarColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600'
  ];

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(formData.newPassword));
  }, [formData.newPassword]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
    } else if (passwordStrength < 3) {
      newErrors.newPassword = 'A senha é muito fraca';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/perfil" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-500">Altere sua senha de acesso</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Alterar Senha</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-gray-900 dark:text-white font-medium">Senha Atual *</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Digite sua senha atual"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-200 dark:border-neutral-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--accent))]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
                <label htmlFor="newPassword" className="text-gray-900 dark:text-white font-medium">Nova Senha *</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Digite sua nova senha"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-200 dark:border-neutral-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--accent))]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-400">{errors.newPassword}</p>
              )}
              <p className="text-sm text-gray-400">
                A senha deve ter pelo menos 8 caracteres
              </p>
              {formData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div
                      className={`h-full rounded-full ${strengthBarColors[passwordStrength]}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <p className={`text-sm ${strengthTextColors[passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-gray-900 dark:text-white font-medium">Confirmar Nova Senha *</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme sua nova senha"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-200 dark:border-neutral-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[hsl(var(--accent))]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Última alteração: 30 dias atrás</p>
              <p className="text-xs text-gray-500">Por segurança, recomendamos alterar sua senha regularmente.</p>
            </div>

            <button
              type="submit"
              disabled={loading || passwordStrength < 3}
              className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Alterando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Alterar Senha
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
