import React, { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, X, User, UserCheck } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProprietariosCaptadoresSectionProps {
  form: UseFormReturn<any>;
}

export function ProprietariosCaptadoresSection({ form }: ProprietariosCaptadoresSectionProps) {
  const {
    fields: proprietarios,
    append: appendProprietario,
    remove: removeProprietario,
  } = useFieldArray({
    control: form.control,
    name: 'pessoas.proprietarios',
  });

  const {
    fields: captadores,
    append: appendCaptador,
    remove: removeCaptador,
  } = useFieldArray({
    control: form.control,
    name: 'pessoas.captadores',
  });

  const [novoProprietario, setNovoProprietario] = useState({ nome: '', porcentagem: 100 });
  const [novoCaptador, setNovoCaptador] = useState({ 
    captador: '', 
    porcentagem: 100, 
    indicadoPor: '', 
    principal: false 
  });

  // Calculate totals
  const totalProprietarios = proprietarios.reduce((sum, _, index) => {
    const porcentagem = form.watch(`pessoas.proprietarios.${index}.porcentagem`) || 0;
    return sum + Number(porcentagem);
  }, 0);

  const totalCaptadores = captadores.reduce((sum, _, index) => {
    const porcentagem = form.watch(`pessoas.captadores.${index}.porcentagem`) || 0;
    return sum + Number(porcentagem);
  }, 0);

  const addProprietario = () => {
    if (novoProprietario.nome && novoProprietario.porcentagem > 0) {
      appendProprietario(novoProprietario);
      setNovoProprietario({ nome: '', porcentagem: 0 });
    }
  };

  const addCaptador = () => {
    if (novoCaptador.captador && novoCaptador.porcentagem > 0) {
      appendCaptador(novoCaptador);
      setNovoCaptador({ captador: '', porcentagem: 0, indicadoPor: '', principal: false });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Proprietários & Captadores</h3>
      
      <div className="space-y-8">
        {/* Proprietários Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Dados para inclusão de proprietário</span>
            </h4>
            <Badge 
              className={`${
                totalProprietarios === 100 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              Total: {totalProprietarios}%
            </Badge>
          </div>

          {/* Add New Proprietário */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nome / CPF / CNPJ
                </label>
                <Input
                  value={novoProprietario.nome}
                  onChange={(e) => setNovoProprietario(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome, CPF ou CNPJ"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Porcentagem
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={novoProprietario.porcentagem || ''}
                  onChange={(e) => setNovoProprietario(prev => ({ ...prev, porcentagem: Number(e.target.value) }))}
                  placeholder="0"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>
              <Button
                type="button"
                onClick={addProprietario}
                 className="bg-[hsl(var(--accent))] text-white rounded-2xl h-11 hover:bg-[hsl(var(--accentHover))] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Proprietários List */}
          {proprietarios.map((proprietario, index) => (
            <div key={proprietario.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white border border-gray-200 rounded-2xl">
              <FormField
                control={form.control}
                name={`pessoas.proprietarios.${index}.nome`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nome
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
              <FormField
                control={form.control}
                name={`pessoas.proprietarios.${index}.porcentagem`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Porcentagem
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        readOnly
                        className="rounded-2xl border-gray-200 bg-gray-50 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => removeProprietario(index)}
                variant="destructive"
                className="bg-red-500 text-white rounded-2xl h-11 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Captadores Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-800 flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Dados para inclusão de captador</span>
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                - (Retirar captador principal)
              </span>
            </h4>
            <Badge 
              className={`${
                totalCaptadores === 100 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}
            >
              Total: {totalCaptadores}%
            </Badge>
          </div>

          {/* Add New Captador */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Captador
                </label>
                <Select
                  value={novoCaptador.captador}
                  onValueChange={(value) => setNovoCaptador(prev => ({ ...prev, captador: value }))}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione o captador" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                    <SelectItem value="Daniel Capelani Custodio">Daniel Capelani Custodio</SelectItem>
                    <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                    <SelectItem value="João Santos">João Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Porcentagem
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={novoCaptador.porcentagem || ''}
                  onChange={(e) => setNovoCaptador(prev => ({ ...prev, porcentagem: Number(e.target.value) }))}
                  placeholder="0"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Indicado por
                </label>
                <Input
                  value={novoCaptador.indicadoPor}
                  onChange={(e) => setNovoCaptador(prev => ({ ...prev, indicadoPor: e.target.value }))}
                  placeholder="Digite o nome, email ou telefone"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>
              <Button
                type="button"
                onClick={addCaptador}
                className="bg-[hsl(var(--accent))] text-white rounded-2xl h-11 hover:bg-[hsl(var(--accentHover))] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Captadores List */}
          {captadores.map((captador, index) => (
            <div key={captador.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-white border border-gray-200 rounded-2xl">
              <FormField
                control={form.control}
                name={`pessoas.captadores.${index}.captador`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nome
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
              <FormField
                control={form.control}
                name={`pessoas.captadores.${index}.porcentagem`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Porcentagem
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        readOnly
                        className="rounded-2xl border-gray-200 bg-gray-50 h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`pessoas.captadores.${index}.indicadoPor`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Indicado por
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
              <FormField
                control={form.control}
                name={`pessoas.captadores.${index}.principal`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Captador principal
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {field.value && <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent))]"></div>}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => removeCaptador(index)}
                variant="destructive"
                className="bg-red-500 text-white rounded-2xl h-11 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Warning Messages */}
        {totalProprietarios !== 100 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-sm text-red-800">
              ⚠️ A soma das porcentagens dos proprietários deve ser 100%. Atual: {totalProprietarios}%
            </p>
          </div>
        )}

        {totalCaptadores !== 100 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-sm text-red-800">
              ⚠️ A soma das porcentagens dos captadores deve ser 100%. Atual: {totalCaptadores}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}