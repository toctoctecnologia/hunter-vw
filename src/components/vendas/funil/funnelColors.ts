export const TOCTOC_ORANGE_SCALE: Record<number, string> = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: 'hsl(var(--accent))',
  600: '#ea580c',
  700: '#c2410c',
};

const GRADIENTS: Array<[number, number]> = [
  [600, 700],
  [500, 600],
  [400, 500],
  [300, 400],
  [200, 300],
  [100, 200],
  [50, 100],
  [100, 200],
  [200, 300],
  [300, 400],
];

export const funnelGradientFor = (index: number): string => {
  const [from, to] = GRADIENTS[index] || GRADIENTS[GRADIENTS.length - 1];
  return `linear-gradient(to right, ${TOCTOC_ORANGE_SCALE[from]}, ${TOCTOC_ORANGE_SCALE[to]})`;
};
