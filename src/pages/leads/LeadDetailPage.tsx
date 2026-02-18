
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { LeadDetailModal } from '@/components/vendas/LeadDetailModal';
import { useLeadsStore } from '@/hooks/vendas';
import type { Lead } from '@/types/lead';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { leads, error, load } = useLeadsStore();
  useEffect(() => {
    load();
  }, [load]);
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar lead: {error}
      </div>
    );
  }
  if (!leads.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum lead encontrado
      </div>
    );
  }
  const normalizedLeads: Lead[] = leads.map((l) => ({
    email: '',
    source: '',
    qualified: false,
    qualifiedAt: '',
    ...l,
  }));
  const leadId = parseInt(id || '1');
  const lead = normalizedLeads.find((l) => l.id === leadId) || normalizedLeads[0];

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full md:max-w-2xl h-screen flex flex-col bg-white overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <button 
            onClick={handleBack} 
            className="text-[hsl(var(--accent))] font-medium flex items-center hover:bg-orange-50 rounded-lg p-2 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Voltar
          </button>
          <h3 className="text-lg font-semibold text-[hsl(var(--accent))]">Detalhes do Lead</h3>
          <div className="w-6"></div>
        </div>

        {/* Lead Detail Content */}
        <div className="flex-1 overflow-y-auto">
          <LeadDetailModal 
            lead={lead} 
            onClose={handleBack}
            isPage={true}
          />
        </div>
      </motion.div>
    </div>
  );
}
