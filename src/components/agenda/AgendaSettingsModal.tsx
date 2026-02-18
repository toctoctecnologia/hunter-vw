
import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Palette, Wrench, Home, CheckSquare, FileText, RefreshCw } from 'lucide-react';
import { useAgendaSettings, useCalendarZoom } from '@/hooks/agenda';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { CalendarSyncModal } from './CalendarSyncModal';
import {
    MIN_PX_PER_MIN,
    MAX_PX_PER_MIN,
    BASE_PX_PER_MIN
  } from './constants';

interface AgendaSettingsModalProps {
  onClose: () => void;
}

export const AgendaSettingsModal = ({ onClose }: AgendaSettingsModalProps) => {
    const { settings, updateSettings, saveSettings } = useAgendaSettings();
    const { zoom, zoomIn, zoomOut, resetZoom, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } = useCalendarZoom();
  const { toast } = useToast();
  const [showSyncModal, setShowSyncModal] = useState(false);

  const colorOptions = [
    { name: 'Azul', value: '#4285F4' },
    { name: 'Verde', value: '#34A853' },
    { name: 'Laranja', value: 'hsl(var(--accent))' },
    { name: 'Roxo', value: '#6366F1' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Amarelo', value: '#F59E0B' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  const eventTypes = [
    { key: 'service', label: 'Serviços', icon: Wrench },
    { key: 'visit', label: 'Visitas', icon: Home },
    { key: 'task', label: 'Tarefas', icon: CheckSquare },
    { key: 'info', label: 'Informações', icon: FileText }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="modal-content bg-white rounded-3xl w-full max-w-sm shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Configurações da Agenda</h2>
                <p className="text-white/80 text-xs mt-1">Personalize sua visualização</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Sync Section */}
            <div className="space-y-3">
              <button
                onClick={() => setShowSyncModal(true)}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-orange-50 border border-orange-200 rounded-2xl hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[hsl(var(--accent))] rounded-xl flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Sincronizar Calendários</h3>
                      <p className="text-sm text-gray-600">Conectar com outros calendários</p>
                    </div>
                  </div>
                  <div className="text-gray-400">›</div>
                </div>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2 text-sm">
                <ZoomIn size={16} className="text-[hsl(var(--accent))]" />
                <span>Nível de Zoom</span>
              </h3>
              
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      Zoom: {Math.round(Math.pow(1.2, zoom) * 100)}%
                    </span>
                  <button
                    onClick={resetZoom}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <RotateCcw size={10} />
                    <span>Resetar</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                      onClick={zoomOut}
                      disabled={zoom <= MIN_ZOOM_LEVEL}
                    className="p-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut size={14} />
                  </button>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-[hsl(var(--accent))] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((zoom - MIN_ZOOM_LEVEL) / (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL)) * 100}%` }}
                    />
                  </div>
                  
                  <button
                      onClick={zoomIn}
                      disabled={zoom >= MAX_ZOOM_LEVEL}
                    className="p-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2 text-sm">
                <Palette size={16} className="text-[hsl(var(--accent))]" />
                <span>Cores dos Eventos</span>
              </h3>
              
              <div className="space-y-4">
                {eventTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <div key={type.key} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                          <Icon size={12} className="text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{type.label}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 pl-8">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            onClick={() => updateSettings({
                              eventColors: {
                                ...settings.eventColors,
                                [type.key]: color.value
                              }
                            })}
                            className={`w-full h-10 rounded-2xl border-2 transition-all duration-200 relative ${
                              settings.eventColors[type.key as keyof typeof settings.eventColors] === color.value
                                ? 'border-gray-900 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.value }}
                          >
                            {settings.eventColors[type.key as keyof typeof settings.eventColors] === color.value && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Opções de Visualização</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Mostrar horários</p>
                    <p className="text-xs text-gray-600">Exibir labels de hora na lateral</p>
                  </div>
                  <Switch
                    checked={settings.showHourLabels}
                    onCheckedChange={(checked) => updateSettings({ showHourLabels: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Visualização compacta</p>
                    <p className="text-xs text-gray-600">Reduzir espaçamento entre eventos</p>
                  </div>
                  <Switch
                    checked={settings.compactView}
                    onCheckedChange={(checked) => updateSettings({ compactView: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 pt-0 flex-shrink-0">
            <button
              onClick={() => {
                saveSettings();
                toast({ title: 'Sucesso', description: 'Configurações salvas com sucesso' });
                onClose();
              }}
              className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 text-sm"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Sync Modal */}
      {showSyncModal && (
        <CalendarSyncModal onClose={() => setShowSyncModal(false)} />
      )}
    </>
  );
};
