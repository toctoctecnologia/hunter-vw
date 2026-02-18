import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ConteudoSeoSectionProps {
  form: UseFormReturn<any>;
}

export function ConteudoSeoSection({ form }: ConteudoSeoSectionProps) {
  const watchTituloAnuncio = form.watch('conteudoSeo.tituloAnuncio') || '';
  const watchDescricao = form.watch('conteudoSeo.descricao') || '';
  const watchMetaDescription = form.watch('conteudoSeo.metaDescription') || '';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Conteúdo & SEO</h3>

      <div className="space-y-6">
        {/* Título para Anúncio */}
        <FormField
          control={form.control}
          name="conteudoSeo.tituloAnuncio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Título para anúncio</span>
                <span className="text-xs text-gray-500">
                  {watchTituloAnuncio.length}/60
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={60}
                  placeholder="Ex: Apartamento 4 suítes no Olímpia Tower em Balneário Camboriú"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                Título otimizado para mecanismos de busca (máximo 60 caracteres)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="conteudoSeo.descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Descrição</span>
                <span className="text-xs text-gray-500">
                  {watchDescricao.length} caracteres
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={8}
                  placeholder="Descreva as principais características e diferenciais do imóvel..."
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] resize-none"
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                Descrição completa do imóvel com todas as características importantes
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Meta Description */}
        <FormField
          control={form.control}
          name="conteudoSeo.metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Meta description para o site</span>
                <span className="text-xs text-gray-500">
                  {watchMetaDescription.length}/160
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  maxLength={160}
                  placeholder="Ex: Descubra o Olímpia Residence com um apartamento de 4 quartos no Centro de Balneário Camboriú. Conforto e exclusividade. Saiba mais!"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] resize-none"
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                Descrição que aparece nos resultados de busca do Google (máximo 160 caracteres)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}