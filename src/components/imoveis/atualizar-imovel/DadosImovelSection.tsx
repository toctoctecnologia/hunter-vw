import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DadosImovelSectionProps {
  form: UseFormReturn<any>;
}

export function DadosImovelSection({ form }: DadosImovelSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados do Imóvel</h3>
      <p className="text-sm text-red-600 mb-6">🔴 Campos obrigatórios.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Código */}
        <FormField
          control={form.control}
          name="dados.codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Código
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="rounded-2xl border-gray-200 bg-gray-50 h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Código Auxiliar */}
        <FormField
          control={form.control}
          name="dados.codigoAuxiliar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Código auxiliar
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o código auxiliar"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Destinação */}
        <FormField
          control={form.control}
          name="dados.destinacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 text-red-600">
                Destinação
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-red-300 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Residencial">Residencial</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Situação */}
        <FormField
          control={form.control}
          name="dados.situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Situação
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Vago/Disponível">Vago/Disponível</SelectItem>
                  <SelectItem value="Ocupado">Ocupado</SelectItem>
                  <SelectItem value="Em reforma">Em reforma</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Finalidade */}
        <FormField
          control={form.control}
          name="dados.finalidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Finalidade
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Aluguel">Aluguel</SelectItem>
                  <SelectItem value="Temporada">Temporada</SelectItem>
                  <SelectItem value="Venda/Aluguel">Venda/Aluguel</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Imóvel */}
        <FormField
          control={form.control}
          name="dados.tipoImovel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Tipo de imóvel
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Cobertura">Cobertura</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Sala comercial">Sala comercial</SelectItem>
                  <SelectItem value="Loja">Loja</SelectItem>
                  <SelectItem value="Galpão">Galpão</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Segundo Tipo */}
        <FormField
          control={form.control}
          name="dados.segundoTipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Segundo tipo
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="nenhum">Nenhum</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Triplex">Triplex</SelectItem>
                  <SelectItem value="Garden">Garden</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Local das Chaves */}
        <FormField
          control={form.control}
          name="dados.localChaves"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Local das chaves
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Proprietário">Proprietário</SelectItem>
                  <SelectItem value="Imobiliária">Imobiliária</SelectItem>
                  <SelectItem value="Portaria">Portaria</SelectItem>
                  <SelectItem value="Síndico">Síndico</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identificador de Chaves */}
        <FormField
          control={form.control}
          name="dados.identificadorChaves"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Identificador de chaves
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Chaveiro 15, Apartamento 302"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nº de Chaves */}
        <FormField
          control={form.control}
          name="dados.numChaves"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nº de chaves
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nº de Controles */}
        <FormField
          control={form.control}
          name="dados.numControles"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Nº de controles
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Construtora */}
        <FormField
          control={form.control}
          name="dados.construtora"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Construtora
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome da construtora"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Edifício */}
        <FormField
          control={form.control}
          name="dados.edificio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Edifício
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do edifício"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Condomínio */}
        <FormField
          control={form.control}
          name="dados.condominio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Condomínio
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do condomínio"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Idade */}
        <FormField
          control={form.control}
          name="dados.idade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Idade
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: 0 ano(s), 5 anos"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Horário Visita */}
        <FormField
          control={form.control}
          name="dados.horarioVisita"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Horário visita
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: 8h às 18h"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identificador Imóvel */}
        <FormField
          control={form.control}
          name="dados.identificadorImovel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Identificador imóvel
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Identificador único"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Placa/Faixa */}
        <FormField
          control={form.control}
          name="dados.placaFaixa"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Placa/Faixa
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                  <SelectItem value="Placa não autoriza">Placa não autoriza</SelectItem>
                  <SelectItem value="Placa autorizada">Placa autorizada</SelectItem>
                  <SelectItem value="Faixa autorizada">Faixa autorizada</SelectItem>
                  <SelectItem value="Não se aplica">Não se aplica</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}