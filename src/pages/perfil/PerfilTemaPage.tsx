import React, { useState } from 'react';
import { ArrowLeft, Palette, Save, Loader2, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTheme, ThemePreference } from '@/hooks/useTheme';

export default function PerfilTemaPage() {
  const [loading, setLoading] = useState(false);
  const [accentColor, setAccentColor] = useState('hsl(var(--accent))');
  const { toast } = useToast();
  const { resolvedTheme, setTheme, preference } = useTheme();

  const themes = [
    {
      id: 'claro' as ThemePreference,
      name: 'Claro',
      description: 'Tema claro com fundo branco',
      icon: Sun,
      preview: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    },
    {
      id: 'escuro' as ThemePreference,
      name: 'Escuro',
      description: 'Tema escuro com fundo preto',
      icon: Moon,
      preview: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
    }
  ];

  const accentColors = [
    { name: 'Laranja', value: 'hsl(var(--accent))' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Vermelho', value: '#EF4444' }
  ];

  const handleSave = async () => {
    setLoading(true);

    try {
      setTheme(preference);
      localStorage.setItem('accent_color', accentColor);
      const response = await fetch('/perfil/tema', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cor: accentColor }),
      });
      if (!response.ok) throw new Error('Failed to save accent color');

      toast({
        title: 'Tema alterado',
        description: 'Suas preferências de tema foram salvas.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações de tema.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/perfil"
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg"
              style={{ boxShadow: 'var(--shadow)' }}
            >
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Personalize a aparência do aplicativo</p>
            </div>
          </div>
        </div>

        {/* Theme Selection Card */}
          <div className="bg-card border border-border rounded-3xl p-8 mb-6 shadow-[var(--shadow-elevated)]">
            <h1 className="text-2xl font-semibold text-foreground mb-8">Configurações de Tema</h1>

          <div className="space-y-6">
            {/* Theme Options */}
            <div className="border border-border rounded-2xl p-6 bg-surface">
                <h3 className="text-lg font-semibold text-foreground mb-4">Modo de Exibição</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = preference === theme.id;
                  return (
                    <label
                      key={theme.id}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                        isSelected
                          ? 'border-primary/80 bg-primary/10'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={theme.id}
                        checked={isSelected}
                        onChange={(e) => setTheme(e.target.value as ThemePreference)}
                        className="sr-only"
                      />
                      <div className="text-center space-y-2">
                        <div
                          className="w-full h-16 rounded-lg"
                          style={{ background: theme.preview }}
                        />
                        <div className="flex items-center justify-center gap-2">
                          <Icon className="w-6 h-6 text-primary" />
                          <p className="text-foreground font-medium">{theme.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
              <div className="border border-border rounded-2xl p-6 bg-surface">
                <h3 className="text-lg font-semibold text-foreground mb-4">Cor de Destaque</h3>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {accentColors.map((color) => (
                  <label
                    key={color.value}
                    className={`relative cursor-pointer rounded-xl border-2 p-3 transition-colors ${
                      accentColor === color.value
                        ? 'border-primary'
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accentColor"
                      value={color.value}
                      checked={accentColor === color.value}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: color.value }}
                      />
                      <p className="text-xs text-muted-foreground">{color.name}</p>
                    </div>
                    {accentColor === color.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-card border border-border rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Preview */}
              <div className="border border-border rounded-2xl p-6 bg-surface">
                <h3 className="text-lg font-semibold text-foreground mb-4">Visualização</h3>

              <div className={`rounded-xl p-4 ${resolvedTheme === 'dark' ? 'bg-surface3' : 'bg-card'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Exemplo de Interface</p>
                    <p className="text-sm text-muted-foreground">Esta é uma prévia do tema selecionado</p>
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-lg text-primary-foreground text-sm font-medium"
                  style={{ backgroundColor: accentColor }}
                >
                  Botão de Exemplo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary hover:bg-[hsl(var(--brandPrimaryHover))] text-primary-foreground py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Aplicando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Aplicar Tema
            </>
          )}
        </button>
      </div>
    </div>
  );
}
