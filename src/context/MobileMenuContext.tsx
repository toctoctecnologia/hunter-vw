import { createContext, useContext } from 'react';

interface MobileMenuContextValue {
  openMenu: () => void;
}

export const MobileMenuContext = createContext<MobileMenuContextValue>({
  openMenu: () => {}
});

export const useMobileMenu = () => useContext(MobileMenuContext);
