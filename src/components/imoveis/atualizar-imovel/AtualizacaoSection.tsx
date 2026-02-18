import React, { useState } from 'react';
import { Send, User, Bot, Lightbulb } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  user: string;
  type: 'user' | 'system';
}

interface AtualizacaoSectionProps {
  form: UseFormReturn<any>;
}

export function AtualizacaoSection({ form }: AtualizacaoSectionProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Imóvel cadastrado no sistema',
      timestamp: new Date('2024-01-15T10:30:00'),
      user: 'Sistema',
      type: 'system'
    },
    {
      id: '2',
      message: 'Falei com o proprietário, imóvel disponível para visitas.',
      timestamp: new Date('2024-01-16T14:20:00'),
      user: 'Daniel Capelani',
      type: 'user'
    }
  ]);

  const suggestions = [
    'Falei com o proprietário, imóvel disponível.',
    'Em negociação, manter interno.',
    'Indisponível por 30 dias.',
    'Visita agendada para amanhã.',
    'Documentação em análise.',
    'Preço atualizado pelo proprietário.'
  ];

  const parseStatusFromMessage = (msg: string): string | null => {
    const lowerMsg = msg.toLowerCase();
    
    // Verde → "Disponível no site"
    if (lowerMsg.match(/(disponivel|disponível|publicado|ativo|liberado|site)/)) {
      return 'Disponível no site';
    }
    
    // Amarelo → "Disponível interno"
    if (lowerMsg.match(/(interno|negociacao|negociação|pendente|visita|analise|análise)/)) {
      return 'Disponível interno';
    }
    
    // Vermelho → "Indisponível"
    if (lowerMsg.match(/(indisponivel|indisponível|vendido|alugado|retirado|suspenso)/)) {
      return 'Indisponível';
    }
    
    return null;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date(),
      user: 'Usuário Atual',
      type: 'user'
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-detect status change
    const detectedStatus = parseStatusFromMessage(message);
    if (detectedStatus) {
      form.setValue('status', detectedStatus);
      
      // Add system message about status change
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `Status automaticamente alterado para: ${detectedStatus}`,
        timestamp: new Date(),
        user: 'Sistema',
        type: 'system'
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Atualização</h3>
        <p className="text-sm text-gray-600">Atualize seu imóvel aqui</p>
      </div>

      {/* Chat Feed */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.type === 'user'
                  ? 'bg-[hsl(var(--accent))] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {msg.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">{msg.user}</span>
              </div>
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-2 ${
                msg.type === 'user' ? 'text-orange-100' : 'text-gray-500'
              }`}>
                {format(msg.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sugestões rápidas:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite uma atualização... (Enter para enviar, Shift+Enter para quebra de linha)"
          className="flex-1 min-h-[44px] max-h-32 rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] resize-none"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="bg-[hsl(var(--accent))] text-white rounded-2xl px-4 py-2 hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Status Detection Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-xs text-blue-800 font-medium flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          Dica: Use palavras como "disponível", "negociação" ou "indisponível" 
          que o status será atualizado automaticamente!
        </p>
      </div>
    </div>
  );
}