import React, { useState } from 'react';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Chaveiro {
  id: string;
  situacao: string;
  unidade: string;
  quadro: string;
  posicaoQuadro: string;
  numeroLacre: string;
  quantidadeChaves: number;
}

export function ChaveirosSection() {
  const [chaveiros, setChaveiros] = useState<Chaveiro[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChaveiro, setEditingChaveiro] = useState<Chaveiro | null>(null);
  const [formData, setFormData] = useState({
    situacao: '',
    unidade: '',
    quadro: '',
    posicaoQuadro: '',
    numeroLacre: '',
    quantidadeChaves: 0,
  });

  const resetForm = () => {
    setFormData({
      situacao: '',
      unidade: '',
      quadro: '',
      posicaoQuadro: '',
      numeroLacre: '',
      quantidadeChaves: 0,
    });
    setEditingChaveiro(null);
  };

  const handleSave = () => {
    if (editingChaveiro) {
      // Update existing
      setChaveiros(prev => prev.map(c => 
        c.id === editingChaveiro.id 
          ? { ...editingChaveiro, ...formData }
          : c
      ));
    } else {
      // Add new
      const newChaveiro: Chaveiro = {
        id: Date.now().toString(),
        ...formData,
      };
      setChaveiros(prev => [...prev, newChaveiro]);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (chaveiro: Chaveiro) => {
    setEditingChaveiro(chaveiro);
    setFormData({
      situacao: chaveiro.situacao,
      unidade: chaveiro.unidade,
      quadro: chaveiro.quadro,
      posicaoQuadro: chaveiro.posicaoQuadro,
      numeroLacre: chaveiro.numeroLacre,
      quantidadeChaves: chaveiro.quantidadeChaves,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setChaveiros(prev => prev.filter(c => c.id !== id));
  };

  const handleNewChaveiro = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Chaveiros</h3>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleNewChaveiro}
              className="bg-[hsl(var(--accent))] text-white rounded-2xl px-4 py-2 hover:opacity-95 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Chaveiro
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-gray-200 rounded-2xl shadow-lg max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {editingChaveiro ? 'Editar Chaveiro' : 'Novo Chaveiro'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Situação
                </label>
                <Select
                  value={formData.situacao}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, situacao: value }))}
                >
                  <SelectTrigger className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Unidade
                </label>
                <Input
                  value={formData.unidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
                  placeholder="Ex: Apartamento 302"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quadro
                </label>
                <Input
                  value={formData.quadro}
                  onChange={(e) => setFormData(prev => ({ ...prev, quadro: e.target.value }))}
                  placeholder="Ex: Quadro A"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Posição no quadro
                </label>
                <Input
                  value={formData.posicaoQuadro}
                  onChange={(e) => setFormData(prev => ({ ...prev, posicaoQuadro: e.target.value }))}
                  placeholder="Ex: A1, B3"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nº do lacre
                </label>
                <Input
                  value={formData.numeroLacre}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroLacre: e.target.value }))}
                  placeholder="Ex: LAC001"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Quantidade de chaves
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.quantidadeChaves || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantidadeChaves: Number(e.target.value) }))}
                  placeholder="0"
                  className="rounded-2xl border-gray-200 focus:border-[hsl(var(--accent))] h-11"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-gray-200 h-11"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[hsl(var(--accent))] text-white rounded-2xl h-11 hover:opacity-95 transition-opacity"
                >
                  {editingChaveiro ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table or Empty State */}
      {chaveiros.length === 0 ? (
        <div className="text-center py-12">
          <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-500 mb-2">Nenhum registro encontrado</h4>
          <p className="text-sm text-gray-400 mb-6">
            Adicione chaveiros para organizar o controle de chaves do imóvel
          </p>
          <Button
            onClick={handleNewChaveiro}
            className="bg-[hsl(var(--accent))] text-white rounded-2xl px-6 py-2 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Chaveiro
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Situação</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Unidade</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Quadro</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Posição</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Nº Lacre</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Qtd. Chaves</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {chaveiros.map((chaveiro) => (
                <tr key={chaveiro.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      chaveiro.situacao === 'Ativo' 
                        ? 'bg-green-100 text-green-800'
                        : chaveiro.situacao === 'Inativo'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {chaveiro.situacao}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-900">{chaveiro.unidade}</td>
                  <td className="p-3 text-sm text-gray-600">{chaveiro.quadro}</td>
                  <td className="p-3 text-sm text-gray-600">{chaveiro.posicaoQuadro}</td>
                  <td className="p-3 text-sm text-gray-600">{chaveiro.numeroLacre}</td>
                  <td className="p-3 text-sm text-gray-600">{chaveiro.quantidadeChaves}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(chaveiro)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(chaveiro.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}