"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarProvider({ children, defaultExpanded = false }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isExpanded, setIsExpanded, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[hsl(var(--overlay))]"
              onClick={() => setIsExpanded(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed left-0 top-0 z-50 h-full w-72 bg-bgCard border-r border-border shadow-[var(--shadow)] dark:shadow-none",
                className
              )}
            >
              {children}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 300 : 60 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "relative h-screen bg-bgCard border-r border-border overflow-hidden",
        className
      )}
    >
      {children}
    </motion.aside>
  );
}

interface SidebarHeaderProps {
  children: ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div className={cn("px-4 py-6 border-b border-border", className)}>
      {children}
    </div>
  );
}

interface SidebarContentProps {
  children: ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

interface SidebarGroupProps {
  children: ReactNode;
  className?: string;
}

export function SidebarGroup({ children, className }: SidebarGroupProps) {
  return (
    <div className={cn("px-2 py-2", className)}>
      {children}
    </div>
  );
}

interface SidebarGroupLabelProps {
  children: ReactNode;
  className?: string;
}

export function SidebarGroupLabel({ children, className }: SidebarGroupLabelProps) {
  const { isExpanded } = useSidebar();
  
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ delay: 0.1 }}
          className={cn("px-2 py-1 text-xs font-semibold text-textSecondary uppercase tracking-wide", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SidebarMenuProps {
  children: ReactNode;
  className?: string;
}

export function SidebarMenu({ children, className }: SidebarMenuProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
}

interface SidebarMenuItemProps {
  children: ReactNode;
  className?: string;
}

export function SidebarMenuItem({ children, className }: SidebarMenuItemProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

interface SidebarMenuButtonProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  isActive?: boolean;
}

export function SidebarMenuButton({ children, className, asChild, isActive }: SidebarMenuButtonProps) {
  const { isExpanded } = useSidebar();

  const buttonClass = cn(
    "flex h-10 items-center w-full px-3 text-sm font-medium rounded-[var(--radius-md)] transition-colors duration-200",
    "hover:bg-[hsl(var(--text)/0.06)]",
    "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focusRing)/0.35)]",
    isActive 
      ? "bg-[hsl(var(--accent)/0.08)] text-[hsl(var(--accent))] dark:bg-[hsl(var(--surface3))] dark:text-foreground border border-[hsl(var(--accent))]"
      : "text-textPrimary",
    className
  );

  if (asChild) {
    return (
      <div className={buttonClass}>
        {children}
      </div>
    );
  }

  return (
    <button className={buttonClass}>
      <div className="flex items-center min-w-0 flex-1">
        <div className="flex-shrink-0 w-5 h-5 mr-3">
          {typeof children === 'object' && children && 'props' in children ? 
            (children as any).props.children[0] : 
            Array.isArray(children) ? children[0] : children}
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.1 }}
              className="truncate"
            >
              {typeof children === 'object' && children && 'props' in children ? 
                (children as any).props.children[1] : 
                Array.isArray(children) ? children[1] : null}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}

interface SidebarTriggerProps {
  className?: string;
}

export function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { setIsExpanded, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className={cn(
        "p-2 rounded-[var(--radius-md)] hover:bg-[hsl(var(--text)/0.06)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focusRing)/0.35)]",
        className
      )}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

interface SidebarFooterProps {
  children: ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("px-4 py-4 border-t border-border", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, className }: SidebarGroupProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
