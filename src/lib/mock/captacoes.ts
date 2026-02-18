export type CaptacaoFonte = {
  id: number;
  fonte: string;
  leads7d: number;
  leads30d: number;
  conversion: number;
  active: boolean;
  series: { date: string; value: number }[];
};

const startDate = new Date('2025-01-01').getTime();

const generateSeries = (seed: number) =>
  Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(startDate + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    value: Math.round((Math.sin(i / 5 + seed) + 1) * 20 + seed * 5),
  }));

const createFonte = (
  id: number,
  fonte: string,
  seed: number,
  conversion: number,
  active: boolean,
): CaptacaoFonte => {
  const series = generateSeries(seed);
  const leads30d = series.reduce((acc, d) => acc + d.value, 0);
  const leads7d = series.slice(-7).reduce((acc, d) => acc + d.value, 0);
  return { id, fonte, leads7d, leads30d, conversion, active, series };
};

export const captacoesMock: CaptacaoFonte[] = [
  createFonte(1, 'Facebook', 1, 12.5, true),
  createFonte(2, 'Google Ads', 2, 9.3, true),
  createFonte(3, 'Instagram', 3, 7.8, false),
  createFonte(4, 'Site', 4, 5.5, true),
  createFonte(5, 'Indicação', 5, 15.2, false),
];
