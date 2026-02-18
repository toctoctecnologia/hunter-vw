import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

import { getPageTitleByPath, getPageDescriptionByPath, getUserNameInitials } from '@/shared/lib/utils';
import { GlobalSearch, useGlobalSearch } from '@/features/dashboard/components/global-search';

import { ModeToggle } from '@/shared/components/layout/mode-toggle';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';

interface HeaderProps {
  bellHref: string;
  profileHref: string;
}

export function Header({ bellHref, profileHref }: HeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { open: isSearchOpen, setOpen: setSearchOpen } = useGlobalSearch();

  return (
    <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setSearchOpen} />

      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 py-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <div>
            <h1 className="text-base font-medium">{getPageTitleByPath(pathname)}</h1>
            <TypographyMuted className="hidden md:block">{getPageDescriptionByPath(pathname)}</TypographyMuted>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="inline-flex"
              title="Buscar (⌘K)"
            >
              <Search />
            </Button>

            <ModeToggle />

            <Button variant="ghost" size="icon" onClick={() => navigate(bellHref)}>
              <Bell />
            </Button>

            {user?.userInfo.profilePictureUrl ? (
              <Avatar className="size-9" onClick={() => navigate(profileHref)}>
                <AvatarImage src={user?.userInfo.profilePictureUrl} alt={user?.userInfo.name} />
              </Avatar>
            ) : (
              <Button size="icon" className="rounded-full" onClick={() => navigate(profileHref)}>
                {getUserNameInitials(user?.userInfo.name || '-')}
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
