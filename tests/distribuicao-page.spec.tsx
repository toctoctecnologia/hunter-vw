import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const FIXED_NOW = new Date('2024-01-01T12:00:00Z').getTime();

interface TestSetupResult {
  httpSpy: ReturnType<typeof vi.spyOn>;
  toastMock: vi.Mock & { success: vi.Mock; error: vi.Mock };
  store: typeof import('@/state/distribuicao/redistribuicao.store').useRedistribuicaoStore;
  asFragment: () => DocumentFragment;
}

async function setup(initialEntry = '/distribuicao/redistribuicao'): Promise<TestSetupResult> {
  const toastMock = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });

  vi.doMock('sonner', () => ({ __esModule: true, toast: toastMock }));
  vi.doMock('@/utils/env', () => ({ IS_MOCK: true }));
  vi.doMock('@/hooks/ui/useIsMobile', () => ({ useIsMobile: () => false }));
  vi.doMock('@radix-ui/react-select', async () => {
    const React = await import('react');

    type ContextValue = {
      value: string;
      setValue: (value: string) => void;
      open: boolean;
      setOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
    };

    const SelectContext = React.createContext<ContextValue | null>(null);

    function useSelectContext() {
      const ctx = React.useContext(SelectContext);
      if (!ctx) throw new Error('Select primitives must be used within <Select />');
      return ctx;
    }

    const Root: React.FC<any> = ({
      value,
      defaultValue = '',
      onValueChange,
      onOpenChange,
      children,
    }) => {
      const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? '');
      const [open, setOpenState] = React.useState(false);

      const currentValue = value !== undefined ? value : internalValue;

      const setValue = React.useCallback(
        (next: string) => {
          onValueChange?.(next);
          if (value === undefined) {
            setInternalValue(next);
          }
          setOpenState(false);
          onOpenChange?.(false);
        },
        [onValueChange, value]
      );

      const setOpen = React.useCallback(
        (next: boolean | ((prev: boolean) => boolean)) => {
          setOpenState(prev => {
            const resolved = typeof next === 'function' ? next(prev) : next;
            onOpenChange?.(resolved);
            return resolved;
          });
        },
        [onOpenChange]
      );

      const contextValue = React.useMemo<ContextValue>(
        () => ({ value: currentValue ?? '', setValue, open, setOpen }),
        [currentValue, open, setValue, setOpen]
      );

      return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
    };

    const Trigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => {
      const ctx = useSelectContext();
      return (
        <button
          type="button"
          ref={ref}
          aria-haspopup="listbox"
          aria-expanded={ctx.open}
          onClick={() => ctx.setOpen(prev => !prev)}
          {...props}
        >
          {children}
        </button>
      );
    });
    Trigger.displayName = 'SelectTrigger';

    const Icon: React.FC<any> = ({ asChild, children }) => (asChild ? <>{children}</> : <span>{children}</span>);

    const Portal: React.FC<any> = ({ children }) => <>{children}</>;

    const Content = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => {
      const ctx = useSelectContext();
      if (!ctx.open) return null;
      return (
        <div ref={ref} role="listbox" {...props}>
          {children}
        </div>
      );
    });
    Content.displayName = 'SelectContent';

    const Viewport = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ));
    Viewport.displayName = 'SelectViewport';

    const ScrollUpButton = React.forwardRef<HTMLButtonElement, any>((_, ref) => (
      <button type="button" ref={ref} style={{ display: 'none' }} />
    ));
    ScrollUpButton.displayName = 'SelectScrollUpButton';

    const ScrollDownButton = React.forwardRef<HTMLButtonElement, any>((_, ref) => (
      <button type="button" ref={ref} style={{ display: 'none' }} />
    ));
    ScrollDownButton.displayName = 'SelectScrollDownButton';

    const Item = React.forwardRef<HTMLDivElement, any>(({ value, children, ...props }, ref) => {
      const ctx = useSelectContext();
      const selected = ctx.value === value;
      return (
        <div
          ref={ref}
          role="option"
          tabIndex={-1}
          aria-selected={selected}
          data-state={selected ? 'checked' : 'unchecked'}
          onClick={() => ctx.setValue(value)}
          {...props}
        >
          {children}
        </div>
      );
    });
    Item.displayName = 'SelectItem';

    const ItemIndicator: React.FC<any> = ({ children }) => <span>{children}</span>;
    const ItemText: React.FC<any> = ({ children }) => <span>{children}</span>;

    const Group: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;

    const Label = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ));
    Label.displayName = 'SelectLabel';

    const Separator = React.forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props} />);

    const Value: React.FC<any> = ({ placeholder }) => {
      const ctx = useSelectContext();
      const display = ctx.value ?? '';
      return <span>{display === '' ? placeholder ?? '' : display}</span>;
    };

    return {
      __esModule: true,
      Root,
      Trigger,
      Value,
      Icon,
      Portal,
      Content,
      Viewport,
      ScrollUpButton,
      ScrollDownButton,
      Item,
      ItemIndicator,
      ItemText,
      Group,
      Label,
      Separator,
    } as const;
  });

  const fetchModule = await import('@/utils/fetchWithMock');
  const actualFetch = fetchModule.default;
  vi.spyOn(fetchModule, 'default').mockImplementation((...args) => actualFetch(...args));

  const httpModule = await import('@/lib/http');
  const actualHttp = httpModule.httpJSON;
  const httpSpy = vi.spyOn(httpModule, 'httpJSON').mockImplementation((...args) => actualHttp(...args));

  const storeModule = await import('@/state/distribuicao/redistribuicao.store');
  const Distribuicao = (await import('@/pages/Distribuicao')).default;

  localStorage.setItem('acl:permissions', JSON.stringify([]));
  localStorage.setItem('acl:roles', JSON.stringify([]));
  localStorage.setItem('acl:currentUser', JSON.stringify({ id: 'user-1', role: 'admin', permissions: [] }));

  const utils = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Distribuicao />
    </MemoryRouter>
  );

  await screen.findAllByText('lead1@exemplo.com');

  return {
    httpSpy,
    toastMock,
    store: storeModule.useRedistribuicaoStore,
    asFragment: utils.asFragment,
  };
}

let nowSpy: ReturnType<typeof vi.spyOn> | undefined;
let previousNodeEnv: string | undefined;

describe('Distribuicao - aba Redistribuição', () => {
  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.resetModules();
    nowSpy = vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW);
    previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    nowSpy?.mockRestore();
    process.env.NODE_ENV = previousNodeEnv;
  });

  it('exibe a aba de redistribuição com dados mockados', async () => {
    const { asFragment } = await setup();

    expect(screen.getByRole('tab', { name: 'Redistribuição' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Pré-visualizar redistribuição/i })).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('recarrega os leads quando filtros são alterados', async () => {
    const { store, httpSpy } = await setup();

    httpSpy.mockClear();
    act(() => {
      store.getState().setFilters({ owner: 'Ana Lima' });
    });

    await waitFor(() => {
      const urls = httpSpy.mock.calls.map(([url]) => (typeof url === 'string' ? url : ''));
      expect(urls.some(url => url.includes('owner=Ana%20Lima') || url.includes('owner=Ana+Lima'))).toBe(true);
    });
  });

  it('permite configurar destino, pré-visualizar, executar e importar lote', async () => {
    const { httpSpy, toastMock } = await setup();

    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getAllByRole('button', { name: /Configurar destino/i })[0]!);
    const destinationDialog = await screen.findByRole('dialog');

    const radios = within(destinationDialog).getAllByRole('radio');
    fireEvent.click(radios[1]);

    const destinationTrigger = within(destinationDialog).getAllByRole('button', { name: /fila-geral/i })[0]!;
    fireEvent.click(destinationTrigger);
    fireEvent.click(await screen.findByRole('option', { name: 'Equipe Especialista' }));

    fireEvent.change(
      within(destinationDialog).getByPlaceholderText('Anote instruções adicionais sobre a redistribuição'),
      { target: { value: 'Distribuição manual' } }
    );

    fireEvent.click(within(destinationDialog).getByRole('button', { name: 'Salvar configuração' }));

    await waitFor(() => expect(screen.getByText('Redistribuição para usuário específico')).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole('button', { name: /Pré-visualizar redistribuição/i })[0]!);

    const previewDialog = await screen.findByRole('dialog');
    expect(within(previewDialog).getByText('Pré-visualização da redistribuição')).toBeInTheDocument();
    fireEvent.click(within(previewDialog).getByRole('button', { name: 'Iniciar redistribuição' }));

    await waitFor(() => {
      expect(screen.queryByText('Pré-visualização da redistribuição')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const [selectedLabel] = screen.getAllByText('Leads selecionados');
      const selectedRow = selectedLabel?.closest('div');
      expect(selectedRow && within(selectedRow).getByText('0')).toBeTruthy();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Adicionar lote/i })[0]!);
    const batchDialog = await screen.findByRole('dialog');
    expect(within(batchDialog).getByText('Adicionar lote de leads')).toBeInTheDocument();

    fireEvent.change(
      within(batchDialog).getByPlaceholderText('Ex: Leads campanha Facebook'),
      { target: { value: 'Campanha Teste' } }
    );

    fireEvent.click(within(batchDialog).getByRole('button', { name: /Importar lote/i }));

    await waitFor(() => {
      expect(screen.queryByText('Adicionar lote de leads')).not.toBeInTheDocument();
    });

    await screen.findAllByText(/novo-import-/i);
  });
});
