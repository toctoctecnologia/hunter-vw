import { create } from 'zustand';
import { filasApi } from '@/api/filas';
import type { Fila } from '@/types/filas';

interface FilasState {
  filas: Fila[];
  carregarFilas: () => Promise<void>;
  reordenar: (novasFilas: Fila[]) => void;
  salvarOrdem: () => Promise<void>;
  atualizarFila: (fila: Partial<Fila>) => Promise<Fila>;
  excluirFila: (id: string) => Promise<void>;
  redistribuirFila: (id: string) => Promise<void>;
}

export const useFilasStore = create<FilasState>((set, get) => ({
  filas: [],
  async carregarFilas() {
    const data = await filasApi.getFilas();
    set({ filas: data });
  },
  reordenar(novasFilas) {
    set({ filas: novasFilas });
  },
  async salvarOrdem() {
    const order = get().filas.map(f => f.id);
    await filasApi.reorderFilas(order);
  },
  async atualizarFila(fila) {
    let saved: Fila;
    if (fila.id) {
      saved = await filasApi.updateFila(fila.id, fila);
    } else {
      saved = await filasApi.createFila(fila as any);
    }
    set(state => {
      const idx = state.filas.findIndex(f => f.id === saved.id);
      const filas = idx >= 0 ? state.filas.map(f => (f.id === saved.id ? saved : f)) : [...state.filas, saved];
      return { filas };
    });
    return saved;
  },
  async excluirFila(id) {
    await filasApi.deleteFila(id);
    set(state => ({ filas: state.filas.filter(f => f.id !== id) }));
  },
  async redistribuirFila(id) {
    await filasApi.redistribuirFila(id);
  }
}));

export default useFilasStore;
