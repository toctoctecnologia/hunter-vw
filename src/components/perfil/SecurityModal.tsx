
import React, { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { ArrowLeft, Shield, Lock, Key, Eye, EyeOff, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { use2FA } from '@/hooks/perfil';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityModal = ({ isOpen, onClose }: SecurityModalProps) => {
    const { enabled: twoFactorEnabled, startSetup, disable } = use2FA();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    debugLog('Salvando configurações de segurança...');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden h-dvh">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Privacidade & Segurança</h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações de Segurança</h2>
            <p className="text-gray-500">Proteja sua conta com configurações avançadas</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Autenticação em Duas Etapas</h3>
            
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2FA</p>
                    <p className="text-sm text-gray-600">Autenticação em duas etapas</p>
                  </div>
                </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) startSetup();
                      else disable();
                    }}
                  />
              </div>
              
              {!twoFactorEnabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-sm text-amber-800">
                    Recomendamos ativar a autenticação em duas etapas para maior segurança.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Senha Atual
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/10 text-base pr-12"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/10 text-base pr-12"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/10 text-base pr-12"
                      placeholder="Confirme sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
