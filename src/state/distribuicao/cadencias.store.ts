import { create } from 'zustand';
import { cadenciasApi } from '@/api/cadencias';
import type { Cadencia } from '@/types/cadencia';

interface CadenciasState {
  cadencias: Cadencia[];
  carregarCadencias: () => Promise<void>;
  atualizarCadencia: (cadencia: Partial<Cadencia>) => Promise<Cadencia>;
  criarCadencia: (cadencia: Omit<Cadencia, 'id'>) => Promise<Cadencia>;
  duplicarCadencia: (id: string) => Promise<Cadencia>;
  excluirCadencia: (id: string) => Promise<void>;
  reordenar: (novas: Cadencia[]) => void;
  salvarOrdem: () => Promise<void>;
}

export const useCadenciasStore = create<CadenciasState>((set, get) => ({
  cadencias: [],
  async carregarCadencias() {
    const data = await cadenciasApi.getCadencias();
    set({ cadencias: data });
  },
  async atualizarCadencia(cadencia) {
    if (!cadencia.id) {
      throw new Error('ID da cadência é obrigatório para atualizar');
    }
    const saved = await cadenciasApi.updateCadencia(cadencia.id, cadencia);
    set((state) => ({
      cadencias: state.cadencias.map((item) => (item.id === saved.id ? saved : item)),
    }));
    return saved;
  },
  async criarCadencia(cadencia) {
    const created = await cadenciasApi.createCadencia(cadencia);
    set((state) => ({
      cadencias: [...state.cadencias, created],
    }));
    return created;
  },
  async duplicarCadencia(id) {
    const duplicated = await cadenciasApi.duplicateCadencia(id);
    set((state) => ({
      cadencias: [...state.cadencias, duplicated],
    }));
    return duplicated;
  },
  async excluirCadencia(id) {
    await cadenciasApi.deleteCadencia(id);
    set((state) => ({
      cadencias: state.cadencias.filter((item) => item.id !== id),
    }));
  },
  reordenar(novas) {
    set({ cadencias: novas });
  },
  async salvarOrdem() {
    const order = get().cadencias.map((cad) => cad.id);
    await cadenciasApi.reorderCadencias(order);
  },
}));

export default useCadenciasStore;
