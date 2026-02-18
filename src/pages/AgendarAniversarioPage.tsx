
import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Phone, FileText, Gift, Bell, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AgendarAniversarioPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    phone: '',
    date: new Date(),
    description: '',
    notification: '2-horas-antes',
    color: '#ec4899',
    recurring: 'anualmente'
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorOptions = [
    '#ec4899', '#3b82f6', '#ef4444', '#f59e0b', 
    '#8b5cf6', '#22c55e', '#06b6d4', '#84cc16'
  ];

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Aniversário agendado!",
      description: "O aniversário foi adicionado à sua agenda.",
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
                <h1 className="text-lg font-semibold">Agendar Aniversário</h1>
                <p className="text-white/80 text-sm">Adicionar aniversário à agenda</p>
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

            {/* Date Section */}
            <div className="bg-orange-50 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Gift size={20} className="text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data</h3>
                  <p className="text-sm text-gray-600">Quando é o aniversário</p>
                </div>
              </div>

              {/* Date Display and Picker */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Data</label>
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-900 font-medium">
                          {format(formData.date, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <CalendarComponent
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({...formData, date});
                            setShowDatePicker(false);
                          }
                        }}
                        initialFocus
                        className="rounded-2xl border-0 bg-white shadow-lg"
                        classNames={{
                          day_selected: "bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))] focus:bg-[hsl(var(--accent))] focus:text-white rounded-lg",
                          day_today: "bg-orange-100 text-[hsl(var(--accent))] font-semibold rounded-lg",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
              {/* Aniversariante */}
              <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                <User size={20} className="text-gray-500" />
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="flex-1 bg-transparent border-none outline-none placeholder-gray-400"
                  placeholder="Nome do aniversariante"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                <Phone size={20} className="text-gray-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="flex-1 bg-transparent border-none outline-none placeholder-gray-400"
                  placeholder="Telefone"
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

export default AgendarAniversarioPage;
