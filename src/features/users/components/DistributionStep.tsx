import { useState, useEffect, useMemo } from 'react';
import { Search, Users, Building, User, Plus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { searchDistributionTargets, previewDistribution } from '../services/distributionService';
import type { 
  DistributionTarget, 
  DistributionStrategy, 
  DistributionScope,
  DistributionPreviewResponse,
  SearchResult 
} from '../types/distribution';

interface DistributionStepProps {
  walletSummary: {
    hot: number;
    warm: number;
    cold: number;
    total: number;
  };
  selectedFilters: {
    includeHot: boolean;
    includeWarm: boolean;
    includeCold: boolean;
  };
  onStrategyChange: (strategy: DistributionStrategy) => void;
  onScopeChange: (scope: DistributionScope) => void;
  className?: string;
}

export function DistributionStep({
  walletSummary,
  selectedFilters,
  onStrategyChange,
  onScopeChange,
  className
}: DistributionStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'user' | 'team' | 'store'>('user');
  const [onlyActive, setOnlyActive] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<DistributionTarget[]>([]);
  const [strategyType, setStrategyType] = useState<'round_robin' | 'weighted' | 'by_team' | 'by_store'>('round_robin');
  const [maxItemsPerPerson, setMaxItemsPerPerson] = useState<number>();
  const [scope, setScope] = useState<DistributionScope>({
    leads: {
      hot: selectedFilters.includeHot,
      warm: selectedFilters.includeWarm,
      cold: selectedFilters.includeCold
    },
    properties: false
  });
  const [preview, setPreview] = useState<DistributionPreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Calculate totals based on selected filters and scope
  const totals = useMemo(() => ({
    leadsHot: scope.leads.hot ? walletSummary.hot : 0,
    leadsWarm: scope.leads.warm ? walletSummary.warm : 0,
    leadsCold: scope.leads.cold ? walletSummary.cold : 0,
    properties: scope.properties ? 15 : 0 // Mock property count
  }), [scope, walletSummary]);

  // Search for targets
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    searchDistributionTargets(searchType, debouncedQuery, onlyActive)
      .then(setSearchResults)
      .catch(() => setSearchResults([]));
  }, [debouncedQuery, searchType, onlyActive]);

  // Update strategy when targets or type changes
  useEffect(() => {
    const strategy: DistributionStrategy = {
      type: strategyType,
      targets: selectedTargets,
      maxItemsPerPerson
    };
    onStrategyChange(strategy);
  }, [selectedTargets, strategyType, maxItemsPerPerson, onStrategyChange]);

  // Update scope
  useEffect(() => {
    onScopeChange(scope);
  }, [scope, onScopeChange]);

  const addTarget = (result: SearchResult) => {
    if (selectedTargets.some(t => t.id === result.id)) return;
    
    const newTarget: DistributionTarget = {
      id: result.id,
      type: result.type,
      name: result.name,
      quotaLeads: 10,
      quotaProperties: 5,
      active: result.active,
      members: result.members
    };
    
    setSelectedTargets(prev => [...prev, newTarget]);
    setSearchQuery('');
  };

  const removeTarget = (id: string) => {
    setSelectedTargets(prev => prev.filter(t => t.id !== id));
  };

  const updateTargetQuota = (id: string, field: 'quotaLeads' | 'quotaProperties', value: number) => {
    setSelectedTargets(prev => 
      prev.map(t => t.id === id ? { ...t, [field]: Math.max(0, value) } : t)
    );
  };

  const loadPreview = async () => {
    if (selectedTargets.length === 0) return;

    setPreviewLoading(true);
    try {
      const strategy: DistributionStrategy = {
        type: strategyType,
        targets: selectedTargets,
        maxItemsPerPerson
      };
      
      const previewData = await previewDistribution(strategy, scope, totals);
      setPreview(previewData);
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const isValid = selectedTargets.length > 0 && 
    (strategyType !== 'weighted' || selectedTargets.every(t => (t.quotaLeads || 0) > 0));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Pesquisa & Distribuição</h3>
        <p className="text-sm text-muted-foreground">
          Defina para quem, como e quando redistribuir leads e imóveis deste corretor.
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pesquisa de Destinos</CardTitle>
          <CardDescription>
            Busque e selecione times, lojas ou usuários para redistribuição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as typeof searchType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Times
              </TabsTrigger>
              <TabsTrigger value="store" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Lojas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={searchType} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Buscar ${searchType === 'user' ? 'usuários' : searchType === 'team' ? 'times' : 'lojas'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="only-active"
                    checked={onlyActive}
                    onCheckedChange={setOnlyActive}
                  />
                  <Label htmlFor="only-active" className="text-sm whitespace-nowrap">
                    Somente ativos
                  </Label>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {result.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{result.name}</p>
                          {result.members && (
                            <p className="text-xs text-muted-foreground">
                              {result.members.filter(m => m.active).length} membros ativos
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addTarget(result)}
                        disabled={selectedTargets.some(t => t.id === result.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Selected Targets */}
          {selectedTargets.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Destinos Selecionados</Label>
              <div className="space-y-2">
                {selectedTargets.map((target) => (
                  <div key={target.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {target.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{target.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {target.type === 'user' ? 'Usuário' : target.type === 'team' ? 'Time' : 'Loja'}
                      </Badge>
                    </div>
                    {strategyType === 'weighted' && (
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Leads:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={target.quotaLeads || 0}
                            onChange={(e) => updateTargetQuota(target.id, 'quotaLeads', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Label className="text-xs">Imóveis:</Label>
                          <Input
                            type="number"
                            min="0"
                            value={target.quotaProperties || 0}
                            onChange={(e) => updateTargetQuota(target.id, 'quotaProperties', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTarget(target.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estratégia de Distribuição</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={strategyType}
            onValueChange={(value) => setStrategyType(value as typeof strategyType)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round_robin" id="round_robin" />
              <Label htmlFor="round_robin" className="flex-1">
                <span className="font-medium">Um para cada corretor (round-robin)</span>
                <p className="text-sm text-muted-foreground">Distribui igualmente entre todos os destinos</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weighted" id="weighted" />
              <Label htmlFor="weighted" className="flex-1">
                <span className="font-medium">Mais de um corretor (ponderado)</span>
                <p className="text-sm text-muted-foreground">Distribui com base nas cotas definidas</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="by_team" id="by_team" />
              <Label htmlFor="by_team" className="flex-1">
                <span className="font-medium">Por equipe / time</span>
                <p className="text-sm text-muted-foreground">Espalha igualmente entre membros ativos das equipes</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="by_store" id="by_store" />
              <Label htmlFor="by_store" className="flex-1">
                <span className="font-medium">Por loja</span>
                <p className="text-sm text-muted-foreground">Espalha entre membros ativos das lojas</p>
              </Label>
            </div>
          </RadioGroup>

          {(strategyType === 'by_team' || strategyType === 'by_store') && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="max-items" className="text-sm font-medium">
                Limite de itens por pessoa (opcional)
              </Label>
              <Input
                id="max-items"
                type="number"
                min="1"
                value={maxItemsPerPerson || ''}
                onChange={(e) => setMaxItemsPerPerson(parseInt(e.target.value) || undefined)}
                placeholder="Ex: 10"
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scope Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Escopo da Redistribuição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Leads (selecionados no passo anterior)</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="leads-hot"
                  checked={scope.leads.hot}
                  onCheckedChange={(checked) => setScope(prev => ({
                    ...prev,
                    leads: { ...prev.leads, hot: checked }
                  }))}
                  disabled={!selectedFilters.includeHot}
                />
                <Label htmlFor="leads-hot" className="text-sm">
                  Leads quentes ({totals.leadsHot})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="leads-warm"
                  checked={scope.leads.warm}
                  onCheckedChange={(checked) => setScope(prev => ({
                    ...prev,
                    leads: { ...prev.leads, warm: checked }
                  }))}
                  disabled={!selectedFilters.includeWarm}
                />
                <Label htmlFor="leads-warm" className="text-sm">
                  Leads mornos ({totals.leadsWarm})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="leads-cold"
                  checked={scope.leads.cold}
                  onCheckedChange={(checked) => setScope(prev => ({
                    ...prev,
                    leads: { ...prev.leads, cold: checked }
                  }))}
                  disabled={!selectedFilters.includeCold}
                />
                <Label htmlFor="leads-cold" className="text-sm">
                  Leads frios ({totals.leadsCold})
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="properties"
              checked={scope.properties}
              onCheckedChange={(checked) => setScope(prev => ({
                ...prev,
                properties: checked
              }))}
            />
            <Label htmlFor="properties" className="text-sm">
              Redistribuir IMÓVEIS ({totals.properties})
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {selectedTargets.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pré-visualização da Distribuição</CardTitle>
              <Button 
                onClick={loadPreview} 
                disabled={!isValid || previewLoading}
                size="sm"
              >
                {previewLoading ? 'Carregando...' : 'Pré-visualizar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!isValid && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {selectedTargets.length === 0 
                    ? 'Selecione pelo menos um destino para visualizar a distribuição.'
                    : 'Para estratégia ponderada, defina cotas válidas (>0) para todos os destinos.'
                  }
                </AlertDescription>
              </Alert>
            )}

            {preview && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Destino</th>
                        <th className="text-center py-2">Leads Quentes</th>
                        <th className="text-center py-2">Leads Mornos</th>
                        <th className="text-center py-2">Leads Frios</th>
                        <th className="text-center py-2">Imóveis</th>
                        <th className="text-center py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row) => (
                        <tr key={row.destId} className="border-b">
                          <td className="py-2">{row.destLabel}</td>
                          <td className="text-center py-2">{row.leadsHot}</td>
                          <td className="text-center py-2">{row.leadsWarm}</td>
                          <td className="text-center py-2">{row.leadsCold}</td>
                          <td className="text-center py-2">{row.properties}</td>
                          <td className="text-center py-2 font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Serão redistribuídos: {preview.totals.leadsHot + preview.totals.leadsWarm + preview.totals.leadsCold} leads
                    {preview.totals.properties > 0 && ` / ${preview.totals.properties} imóveis`}
                  </span>
                  {preview.warnings.length > 0 && (
                    <Badge variant="destructive">
                      {preview.warnings.length} aviso{preview.warnings.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {preview.warnings.map((warning, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}