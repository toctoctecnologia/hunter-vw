import React, { useState } from 'react';
import { Clock, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditHorarioModal } from './EditHorarioModal';

interface HorarioVisita {
  dia: string;
  inicio: string;
  fim: string;
  ativo: boolean;
}

const diasSemana = [
  'Domingo',
  'Segunda',
  'Terça', 
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

export function HorariosVisitaSection() {
  const [horarios, setHorarios] = useState<HorarioVisita[]>([
    { dia: 'Domingo', inicio: '01:00', fim: '23:50', ativo: true },
    { dia: 'Segunda', inicio: '01:00', fim: '23:59', ativo: true },
    { dia: 'Terça', inicio: '01:00', fim: '23:59', ativo: true },
    { dia: 'Quarta', inicio: '01:00', fim: '23:59', ativo: true },
    { dia: 'Quinta', inicio: '01:00', fim: '23:59', ativo: true },
    { dia: 'Sexta', inicio: '01:00', fim: '23:59', ativo: true },
    { dia: 'Sábado', inicio: '01:00', fim: '23:59', ativo: true },
  ]);
  
  const [editModal, setEditModal] = useState<{ open: boolean; dia: string; horarios: { inicio: string; fim: string } }>({
    open: false,
    dia: '',
    horarios: { inicio: '', fim: '' }
  });

  const handleEditClick = (horario: HorarioVisita) => {
    setEditModal({
      open: true,
      dia: horario.dia,
      horarios: { inicio: horario.inicio, fim: horario.fim }
    });
  };

  const handleConfirmEdit = (novosHorarios: { inicio: string; fim: string }) => {
    setHorarios(prev => prev.map(h => 
      h.dia === editModal.dia 
        ? { ...h, inicio: novosHorarios.inicio, fim: novosHorarios.fim }
        : h
    ));
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          Horários de visitas <span className="text-xs text-gray-500 font-normal">(padrão configurado)</span>
        </h3>
      </div>

      {/* Tabela compacta */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 grid grid-cols-3 text-xs font-medium text-gray-700 border-b border-gray-200">
          <div className="p-2">Dia</div>
          <div className="p-2">Horários disponíveis</div>
          <div className="p-2 text-center">Ação</div>
        </div>

        {/* Rows */}
        {horarios.map((horario, index) => (
          <div key={horario.dia} className={`grid grid-cols-3 text-sm ${index !== horarios.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="p-2 flex items-center">
              <span className="text-gray-700">{horario.dia}</span>
            </div>
            <div className="p-2 flex items-center">
              <Badge className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20 text-xs px-2 py-1 rounded-lg">
                {horario.inicio} até {horario.fim}
              </Badge>
            </div>
            <div className="p-2 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditClick(horario)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <EditHorarioModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, dia: '', horarios: { inicio: '', fim: '' } })}
        onConfirm={handleConfirmEdit}
        dia={editModal.dia}
        horariosAtuais={editModal.horarios}
      />
    </div>
  );
}