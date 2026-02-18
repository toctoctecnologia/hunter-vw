
import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, User, Phone, FileText, CheckSquare, Bell, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DatePickerInput } from '@/components/ui/DatePickerInput';

const AgendarTarefaPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    phone: '',
    location: '',
    date: new Date(),
    startTime: '13:00',
    endTime: '14:00',
    description: '',
    allDay: false,
    notification: '2-horas-antes',
    color: '#22c55e',
    recurring: 'nao-se-repete'
  });

  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorOptions = [
    '#22c55e', '#3b82f6', '#ef4444', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Tarefa agendada!",
      description: "A tarefa foi adicionada à sua agenda.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full md:max-w-2xl h-full flex flex-col">
        <div className="bg-white rounded-lg shadow-sm min-h-[640px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] p-4 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Agendar Tarefa</h1>
                <p className="text-white/80 text-sm">Adicionar tarefa à agenda</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full text-xl font-medium bg-gray-100 border-none outline-none placeholder-gray-400 px-4 py-3 rounded-2xl"
                placeholder="Adicionar título"
                required
              />
            </div>

            {/* Date & Time Section */}
            <div className="bg-orange-50 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <CheckSquare size={20} className="text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data e Horário</h3>
                  <p className="text-sm text-gray-600">Quando realizar</p>
                </div>
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Dia inteiro</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, allDay: !formData.allDay})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.allDay ? 'bg-[hsl(var(--accent))]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData.allDay ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Date Display and Picker */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Data</label>
                  <DatePickerInput value={formData.date} onChange={(d) => setFormData({ ...formData, date: d ?? formData.date })} />
                </div>

                {/* Time Inputs */}
                {!formData.allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Início</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">Fim</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Palette size={20} className="text-gray-500" />
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="text-gray-600"
                >
                  Cor padrão
                </button>
              </div>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: formData.color }}></div>
            </div>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 rounded-2xl">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setFormData({...formData, color});
                      setShowColorPicker(false);
                    }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            {/* Additional Options */}
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                <MapPin size={20} className="text-gray-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="flex-1 bg-transparent border-none outline-none placeholder-gray-400"
                  placeholder="Adicionar local"
                />
              </div>

              {/* Description */}
              <div className="flex items-center space-x-3 py-3">
                <FileText size={20} className="text-gray-500" />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="flex-1 bg-transparent border-none outline-none placeholder-gray-400"
                  placeholder="Adicionar descrição"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] text-white py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md mt-8"
            >
              Salvar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgendarTarefaPage;
