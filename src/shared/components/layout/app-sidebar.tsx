import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle } from 'lucide-react';

import { useAuth } from '@/shared/hooks/use-auth';

import { NavItem } from '@/shared/types';

import { getHumanExpirationDate } from '@/shared/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PlansModal } from '@/shared/components/modal/plans-modal';
import { Button } from '@/shared/components/ui/button';
import { Logo } from '@/shared/components/layout/logo';
import { Nav } from '@/shared/components/layout/nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/shared/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  logoHref: string;
  navItems: NavItem[];
}

export function AppSidebar({ logoHref, navItems, ...props }: AppSidebarProps) {
  const { user } = useAuth();

  const [showPlansModal, setShowPlansModal] = useState(false);
  const [plansModalTitle, setPlansModalTitle] = useState('Escolha um plano');
  const [plansModalDescription, setPlansModalDescription] = useState('Selecione um dos planos disponíveis');
  const [canClosePlansModal, setCanClosePlansModal] = useState(true);

  const handleGoToCheckout = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    console.log({ planId, billingCycle });
    setShowPlansModal(false);
  };

  useEffect(() => {
    if (user?.signatureInfo.status === 'TEST_PERIOD_ACTIVE') {
      const expirationDate = new Date(user.signatureInfo.lastExpirationDate);
      const now = new Date();

      if (expirationDate < now) {
        setPlansModalTitle('Teste gratuito expirado');
        setPlansModalDescription('Seu período de teste gratuito expirou. Escolha um plano para continuar usando.');
        setShowPlansModal(true);
        setCanClosePlansModal(false);
      }
    }
  }, [user?.signatureInfo.lastExpirationDate, user?.signatureInfo.status]);

  return (
    <>
      <PlansModal
        open={showPlansModal}
        onClose={() => setShowPlansModal(canClosePlansModal ? false : true)}
        onSelectPlan={(planId, billingCycle) => handleGoToCheckout(planId, billingCycle)}
        description={plansModalDescription}
        title={plansModalTitle}
      />

      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link to={logoHref}>
                  <Logo width={110} />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <Nav items={navItems} />

          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Suporte</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="https://huntercrm.com.br/faq" target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="size-4" />
                      <span>FAQ</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="https://huntercrm.com.br/contact" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" />
                      <span>Contato</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {user?.signatureInfo.status === 'TEST_PERIOD_ACTIVE' && (
          <SidebarFooter>
            <Card className="gap-2 py-4 shadow-none">
              <CardHeader className="px-4">
                <CardTitle className="text-sm">Período de 7 dias ativo</CardTitle>
                <CardDescription>
                  Seu período de teste gratuito está ativo, ele irá expirar em
                  {` ${getHumanExpirationDate(user.signatureInfo.lastExpirationDate)}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <Button size="sm" className="w-full" onClick={() => setShowPlansModal(true)}>
                  Assinar agora
                </Button>
              </CardContent>
            </Card>
          </SidebarFooter>
        )}
      </Sidebar>
    </>
  );
}
