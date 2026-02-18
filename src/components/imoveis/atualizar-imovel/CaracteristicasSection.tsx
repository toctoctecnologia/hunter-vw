import React, { useState } from 'react';
import { Settings, Home, Building, Gamepad2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CaracteristicasSection() {
  const [extrasChecked, setExtrasChecked] = useState<string[]>([]);
  const [internasChecked, setInternasChecked] = useState<string[]>([]);
  const [externasChecked, setExternasChecked] = useState<string[]>([]);
  const [lazerChecked, setLazerChecked] = useState<string[]>([]);

  const [internasCampos, setInternasCampos] = useState({
    andar: '',
    banheiros: '',
    pisoAcabamento: '',
    posicaoImovel: '',
    quartos: '',
    salas: '',
    suites: '',
    varandas: '',
  });

  const [externasCampos, setExternasCampos] = useState({
    vagasGaragem: '',
    tipoVaga: '',
    elevadores: '',
    numeroTorres: '',
    numeroAndares: '',
    unidadesPorAndar: '',
    totalUnidades: '',
  });

  const extrasOptions = [
    'Apaixonantes',
    'Falta fazer o checklist no imóvel',
    'Faltam fotos profissionais',
    'Faltam informações de IPTU e Condomínio',
    'Frente Mar',
    'Lançamento',
    'Mobiliado',
    'Na planta',
    'Pronto para morar',
    'Quadra mar',
    'Vista Mar'
  ];

  const internasOptions = [
    'Ar condicionado',
    'Área privativa',
    'Área serviço',
    'Armário banheiro',
    'Armário cozinha',
    'Armário quarto',
    'Box banheiro',
    'Closet',
    'DCE',
    'Despensa',
    'Escritório',
    'Lavabo',
    'Mobiliado',
    'Rouparia',
    'Sol da manhã',
    'Vista para o mar',
    'Varanda gourmet',
    'Lareira',
    'Cabeamento estruturado',
    'TV a cabo',
    'Conexão internet',
    'Vista para montanha',
    'Vista para lago'
  ];

  const externasOptions = [
    'Água individual',
    'Alarme',
    'Aquec. elétrico',
    'Aquec. gás',
    'Aquec. solar',
    'Box despejo',
    'Cerca elétrica',
    'Circuito TV',
    'Gás canalizado',
    'Interfone',
    'Jardim',
    'Lavanderia',
    'Portão eletrônico',
    'Portaria 24 horas',
    'Segurança 24 horas',
    'Quintal',
    'Gramado'
  ];

  const lazerOptions = [
    'Academia',
    'Churrasqueira',
    'Hidromassagem',
    'Home cinema',
    'Piscina',
    'Playground',
    'Quadra poliesportiva',
    'Quadra de tênis',
    'Sala de massagem',
    'Salão de festas',
    'Salão de jogos',
    'Sauna',
    'Wifi',
    'Espaço gourmet',
    'Garage Band'
  ];

  const handleExtrasToggle = (option: string) => {
    setExtrasChecked(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleInternasToggle = (option: string) => {
    setInternasChecked(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleExternasToggle = (option: string) => {
    setExternasChecked(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleLazerToggle = (option: string) => {
    setLazerChecked(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const CheckboxPill = ({ 
    checked, 
    onToggle, 
    children 
  }: { 
    checked: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        checked
          ? 'bg-[hsl(var(--accent))] text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Características</h3>
      </div>

      <Tabs defaultValue="extras" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-2xl p-1 mb-6">
          <TabsTrigger 
            value="extras"
            className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
          >
            Extras
          </TabsTrigger>
          <TabsTrigger 
            value="internas"
            className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
          >
            Internas
          </TabsTrigger>
          <TabsTrigger 
            value="externas"
            className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
          >
            Externas
          </TabsTrigger>
          <TabsTrigger 
            value="lazer"
            className="text-sm font-medium py-2 px-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-[hsl(var(--accent))] data-[state=active]:shadow-sm"
          >
            Lazer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extras" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {extrasOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={extrasChecked.includes(option)}
                onToggle={() => handleExtrasToggle(option)}
              >
                {option}
              </CheckboxPill>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internas" className="space-y-6">
          {/* Campos Numéricos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Andar
              </label>
              <Input
                value={internasCampos.andar}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, andar: e.target.value }))}
                placeholder="Ex: 15º"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Banheiros (n)
              </label>
              <Input
                type="number"
                min="0"
                value={internasCampos.banheiros}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, banheiros: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Piso/acabamento
              </label>
              <Input
                value={internasCampos.pisoAcabamento}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, pisoAcabamento: e.target.value }))}
                placeholder="Ex: Porcelanato"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Posição imóvel
              </label>
              <Input
                value={internasCampos.posicaoImovel}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, posicaoImovel: e.target.value }))}
                placeholder="Ex: Nascente"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quartos (n)
              </label>
              <Input
                type="number"
                min="0"
                value={internasCampos.quartos}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, quartos: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Salas (n)
              </label>
              <Input
                type="number"
                min="0"
                value={internasCampos.salas}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, salas: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Suítes (n)
              </label>
              <Input
                type="number"
                min="0"
                value={internasCampos.suites}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, suites: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Varandas (n)
              </label>
              <Input
                type="number"
                min="0"
                value={internasCampos.varandas}
                onChange={(e) => setInternasCampos(prev => ({ ...prev, varandas: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-3">
            {internasOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={internasChecked.includes(option)}
                onToggle={() => handleInternasToggle(option)}
              >
                {option}
              </CheckboxPill>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="externas" className="space-y-6">
          {/* Campos Numéricos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vagas de garagem (n)
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.vagasGaragem}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, vagasGaragem: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de vaga
              </label>
              <Input
                value={externasCampos.tipoVaga}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, tipoVaga: e.target.value }))}
                placeholder="Ex: 1 individual e 1 dupla"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Elevadores (n)
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.elevadores}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, elevadores: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nº torres/blocos
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.numeroTorres}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, numeroTorres: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nº andares
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.numeroAndares}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, numeroAndares: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Unidades por andar
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.unidadesPorAndar}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, unidadesPorAndar: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Total unidades
              </label>
              <Input
                type="number"
                min="0"
                value={externasCampos.totalUnidades}
                onChange={(e) => setExternasCampos(prev => ({ ...prev, totalUnidades: e.target.value }))}
                placeholder="0"
                className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-3">
            {externasOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={externasChecked.includes(option)}
                onToggle={() => handleExternasToggle(option)}
              >
                {option}
              </CheckboxPill>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lazer" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {lazerOptions.map((option) => (
              <CheckboxPill
                key={option}
                checked={lazerChecked.includes(option)}
                onToggle={() => handleLazerToggle(option)}
              >
                {option}
              </CheckboxPill>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}