
import React, { useState } from 'react';
import { ArrowLeft, Camera, Calendar, Clock, MapPin, User, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { parseISO } from 'date-fns';
import { ymdLocal } from '@/lib/datetime';
import { useToast } from '@/hooks/use-toast';

const AgendarServicosPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    serviceType: '',
    observations: ''
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Serviço agendado!",
      description: "O serviço foi agendado com sucesso.",
    });
    navigate('/');
  };

  const serviceTypes = [
    { value: 'fotografia', label: 'Fotografia', icon: Camera },
    { value: 'video', label: 'Vídeo', icon: Camera },
    { value: 'tour-virtual', label: 'Tour Virtual', icon: Camera },
    { value: 'drone', label: 'Drone', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full md:max-w-2xl h-full flex flex-col overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm min-h-[640px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accentHover))] p-4 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Agendar Serviço</h1>
                <p className="text-white/80 text-sm">Fotografia e outros serviços</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Serviço</label>
              <div className="grid grid-cols-2 gap-2">
                {serviceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({...formData, serviceType: type.value})}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.serviceType === type.value
                          ? 'border-[hsl(var(--accent))] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-1 ${
                        formData.serviceType === type.value ? 'text-[hsl(var(--accent))]' : 'text-gray-400'
                      }`} />
                      <p className={`text-xs font-medium ${
                        formData.serviceType === type.value ? 'text-[hsl(var(--accent))]' : 'text-gray-600'
                      }`}>
                        {type.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Título do Serviço</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                placeholder="Ex: Fotos do apartamento na Vila Madalena"
                required
              />
            </div>

            {/* Client Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <User size={18} className="text-[hsl(var(--accent))]" />
                <h3 className="font-medium text-gray-900">Informações do Cliente</h3>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                  placeholder="Nome do cliente"
                  required
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                  placeholder="Telefone"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <MapPin size={16} className="text-[hsl(var(--accent))]" />
                <span>Endereço</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                placeholder="Endereço completo do imóvel"
                rows={3}
                required
              />
            </div>

            {/* Date & Time */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-[hsl(var(--accent))]" />
                <h3 className="font-medium text-gray-900">Data e Horário</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Data</label>
                  <DatePickerInput
                    value={formData.date ? parseISO(formData.date) : null}
                    onChange={(d) => setFormData({ ...formData, date: d ? ymdLocal(d) : '' })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Horário</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <FileText size={16} className="text-[hsl(var(--accent))]" />
                <span>Observações</span>
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-transparent"
                placeholder="Observações adicionais sobre o serviço..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accentHover))] text-white py-4 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-sm"
            >
              Agendar Serviço
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgendarServicosPage;
