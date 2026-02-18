'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/shared/hooks/use-auth';

import { NavItem } from '@/shared/types';

import { hasFeature } from '@/shared/lib/permissions';
import { cn } from '@/shared/lib/utils';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';

export function Nav({ items }: { items: NavItem[] }) {
  const navigation = useRouter();
  const path = usePathname();
  const { user } = useAuth();

  const { setOpenMobile } = useSidebar();

  const userPermissions = user?.userInfo.profile.permissions;

  const filteredNavItems = useMemo(() => {
    return items.filter((item) => {
      if (item.permissionCode.length === 0) {
        return true;
      }
      return item.permissionCode.some((code) => hasFeature(userPermissions, code));
    });
  }, [items, userPermissions]);

  const renderButton = useCallback(
    (title: string, isActive: boolean, url: string, icon: React.ElementType) => {
      const Icon = icon;
      return (
        <SidebarMenuButton
          tooltip={title}
          isActive={isActive}
          className={cn(isActive && 'bg-primary/15! hover:bg-primary/20!')}
          onClick={() => {
            navigation.push(url);
            setOpenMobile(false);
          }}
        >
          <Icon className={cn(isActive && 'text-primary')} />
          <span className={cn(isActive && 'text-primary')}>{title}</span>
        </SidebarMenuButton>
      );
    },
    [navigation, setOpenMobile],
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {filteredNavItems.map((item) => {
            const isActive = item.exact ? path === item.href : path === item.href || path.startsWith(`${item.href}/`);
            return <SidebarMenuItem key={item.title}>{renderButton(item.title, isActive, item.href, item.icon)}</SidebarMenuItem>;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
