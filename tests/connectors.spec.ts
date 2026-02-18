import { describe, it, expect } from 'vitest';
import { connectors } from '@/lib/mock/connectors';

describe('mock connectors list', () => {
  const ids = [
    'zap',
    'viva-real',
    'imovelweb',
    'olx',
    'chaves-na-mao',
    'rocket-imob',
    'wati',
    'meta-ads'
  ];

  ids.forEach(id => {
    it(`contains ${id}`, () => {
      const connector = connectors.find(c => c.id === id);
      expect(connector).toBeTruthy();
      expect(connector).toHaveProperty('nome');
      expect(connector).toHaveProperty('slug');
      expect(connector).toHaveProperty('descricao');
      expect(connector).toHaveProperty('categoria');
      expect(connector).toHaveProperty('docUrl');
      expect(connector).toHaveProperty('credentialsSchema');
      expect(connector).toHaveProperty('defaultMapping');
    });
  });
});
