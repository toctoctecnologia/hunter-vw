import React, { useState } from 'react';
import { ArrowLeft, Lock, Loader2, CheckCircle, Download, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { use2FA } from '@/hooks/perfil';

export default function PerfilSeguranca2FAPage() {
  const { enabled: is2FAEnabled, qrCode, startSetup, verify, disable, downloadCodes, loading, setupStep } = use2FA();
  const [code, setCode] = useState('');
  const { toast } = useToast();

  const start = async () => {
    try {
      await startSetup();
      toast({
        title: 'Escaneie o QR code',
        description: 'Use um autenticador e informe o código gerado.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar a configuração de 2FA.',
        variant: 'destructive',
      });
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 0) return;
    try {
      await verify(code);
      setCode('');
      toast({
        title: '2FA Habilitado',
        description: 'A autenticação de dois fatores foi habilitada com sucesso.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Código de verificação inválido.',
        variant: 'destructive',
      });
    }
  };

  const handleDisable = async () => {
    try {
      await disable();
      toast({
        title: '2FA Desabilitado',
        description: 'A autenticação de dois fatores foi desabilitada.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível desabilitar o 2FA.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    try {
      await downloadCodes();
      toast({
        title: 'Códigos de backup',
        description: 'Os códigos de backup foram baixados.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar os códigos de backup.',
        variant: 'destructive',
      });
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
              <p className="text-gray-500">Configure a autenticação de dois fatores</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Autenticação 2FA</h1>
            {is2FAEnabled && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          
          <div className={`p-6 rounded-2xl border-2 ${
            is2FAEnabled
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-200 dark:border-neutral-800 bg-gray-800/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  is2FAEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {is2FAEnabled ? 'Habilitado' : 'Desabilitado'}
                  </p>
                  <p className={`text-sm ${
                    is2FAEnabled ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {is2FAEnabled ? 'Sua conta está protegida' : 'Recomendamos habilitar para maior segurança'}
                  </p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full ${
                is2FAEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}></div>
            </div>
            
            <div className="text-sm text-gray-400 space-y-2">
              <p>A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.</p>
              {is2FAEnabled && (
                <p className="text-green-400">Configurado em: 15/01/2024 às 14:30</p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Configurações</h2>

          {!is2FAEnabled && setupStep === 'idle' && (
            <button
              onClick={start}
              disabled={loading}
              className="w-full py-4 px-6 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Habilitar 2FA
                </>
              )}
            </button>
          )}

          {!is2FAEnabled && setupStep === 'verify' && (
            <form onSubmit={verifyCode} className="space-y-6">
              {qrCode && (
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
                <div className="space-y-2">
                  <label className="text-gray-900 dark:text-white font-medium">Código de verificação</label>
                <InputOTP value={code} onChange={setCode} maxLength={6}>
                  <InputOTPGroup className="flex justify-center gap-2">
                    <InputOTPSlot index={0} className="h-12 w-10 text-lg" />
                    <InputOTPSlot index={1} className="h-12 w-10 text-lg" />
                    <InputOTPSlot index={2} className="h-12 w-10 text-lg" />
                    <InputOTPSlot index={3} className="h-12 w-10 text-lg" />
                    <InputOTPSlot index={4} className="h-12 w-10 text-lg" />
                    <InputOTPSlot index={5} className="h-12 w-10 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-4 px-6 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verificar
                  </>
                )}
              </button>
            </form>
          )}

          {is2FAEnabled && (
            <div className="space-y-4">
              <button
                  onClick={handleDownload}
                className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Baixar códigos de backup
              </button>
              <button
                onClick={handleDisable}
                disabled={loading}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Desabilitando...
                  </>
                ) : (
                  <>
                    <ShieldOff className="w-5 h-5" />
                    Desabilitar 2FA
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}