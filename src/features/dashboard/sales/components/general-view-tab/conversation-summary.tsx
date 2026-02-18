'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ErrorCard } from '@/shared/components/error-card';
import { Badge } from '@/shared/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

interface ConversationSummaryProps {
  conversationSummary: string | null;
}

// Utilitário para converter snake_case para Title Case
function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Componente recursivo para renderizar valores dinâmicos
function RenderValue({ value, depth = 0 }: { value: object; depth?: number }) {
  const indentClass = depth > 0 ? 'ml-4' : '';

  // Valor primitivo (string, number, boolean, null)
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">Não informado</span>;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-sm">{String(value)}</span>;
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground italic text-sm">Nenhum item</span>;
    }

    return (
      <ul className={`space-y-1 list-disc list-inside ${indentClass}`}>
        {value.map((item, index) => (
          <li key={index} className="text-sm">
            {typeof item === 'object' ? <RenderValue value={item} depth={depth + 1} /> : String(item)}
          </li>
        ))}
      </ul>
    );
  }

  // Objeto
  if (typeof value === 'object') {
    return (
      <div className={`space-y-3 ${indentClass}`}>
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <p className="text-xs font-semibold opacity-60">{formatKey(key)}</p>
            <RenderValue value={val} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function ConversationSummary({ conversationSummary }: ConversationSummaryProps) {
  if (!conversationSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Conversa com Assessor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground text-sm">Nenhum resumo de conversa disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  let parsedSummary: object;
  try {
    parsedSummary = JSON.parse(conversationSummary);
  } catch (error) {
    return <ErrorCard title="Erro ao processar resumo da conversa" error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resumo da Conversa com Assessor</CardTitle>
          <Badge variant="secondary">Análise Automática</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {Object.entries(parsedSummary).map(([key, value]) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-sm font-semibold text-primary">{formatKey(key)}</AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted/30 rounded-lg p-3">
                  <RenderValue value={value} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
