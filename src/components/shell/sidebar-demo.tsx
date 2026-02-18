"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconHome,
  IconBuildingSkyscraper,
  IconCalendar,
  IconCamera,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconMenu2,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { title: "Home", url: "/", icon: IconHome },
  { title: "Negociações", url: "/vendas", icon: IconChartBar },
  { title: "Serviços", url: "/servicos", icon: IconCamera },
  { title: "Agenda", url: "/agenda", icon: IconCalendar },
  { title: "Imóveis", url: "/imoveis", icon: IconBuildingSkyscraper },
];

function AppSidebar() {
  const location = useLocation();
  const { isExpanded, setIsExpanded, isMobile } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {isExpanded && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                src="/branding/hunter-full-logo.svg"
                alt="Hunter CRM"
                className="h-8 w-auto"
              />
            )}
          </AnimatePresence>
          {!isExpanded && (
            <div className="w-8 h-8 bg-[color:var(--primary,hsl(var(--accent)))] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <IconMenu2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} onClick={() => isMobile && setIsExpanded(false)}>
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between">
          <Link 
            to="/perfil"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,hsl(var(--accent)))]/30"
            onClick={() => isMobile && setIsExpanded(false)}
          >
            <IconSettings className="w-5 h-5" />
          </Link>
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                <IconLogout className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 md:hidden">
            <SidebarTrigger />
          </header>
          {/* O conteúdo principal será renderizado aqui pelo router */}
        </div>
      </div>
    </SidebarProvider>
  );
}