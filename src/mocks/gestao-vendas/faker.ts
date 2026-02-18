export type Randomizer = () => number;

export const createSeededRandom = (seed = 123456): Randomizer => {
  let t = seed;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const sample = <T>(random: Randomizer, list: T[]): T =>
  list[Math.floor(random() * list.length)];

export const sampleMany = <T>(random: Randomizer, list: T[], count: number) => {
  const copy = [...list];
  const selected: T[] = [];
  for (let i = 0; i < count; i += 1) {
    selected.push(copy.splice(Math.floor(random() * copy.length), 1)[0]);
  }
  return selected;
};

export const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const createCpf = (random: Randomizer) => {
  const digits = Array.from({ length: 11 }).map(() => Math.floor(random() * 10));
  return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${digits.slice(9).join('')}`;
};

export const createCnpj = (random: Randomizer) => {
  const digits = Array.from({ length: 14 }).map(() => Math.floor(random() * 10));
  return `${digits.slice(0, 2).join('')}.${digits.slice(2, 5).join('')}.${digits.slice(5, 8).join('')}/${digits.slice(8, 12).join('')}-${digits.slice(12).join('')}`;
};

export const createPhone = (random: Randomizer) => {
  const digits = Array.from({ length: 9 }).map(() => Math.floor(random() * 10));
  return `(11) 9${digits.slice(0, 4).join('')}-${digits.slice(4).join('')}`;
};

export const createEmail = (firstName: string, lastName: string) =>
  `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, '') + '@exemplo.com.br';

export const createRandomDate = (random: Randomizer, offsetDays = 0) => {
  const today = new Date();
  const offset = Math.floor(random() * 90) - 45 + offsetDays;
  const date = new Date(today);
  date.setDate(today.getDate() + offset);
  return date;
};
