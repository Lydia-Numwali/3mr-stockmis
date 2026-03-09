'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname, useRouter } from '@/i18n/routing';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Cookies } from 'react-cookie';
import Sidebar from './sidebar';
import { getReadableLocation } from '@/utils/getMenuByRole';
import { useTranslations, useLocale } from 'next-intl';
import { Languages } from '@/utils/constants';

const Heading = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const cookies = new Cookies();
  const router = useRouter();
  const t = useTranslations('heading');
  const locale = useLocale();

  const currentLanguage = Languages.find((lang) => lang.locale === locale) || Languages[0];

  const handleLogout = () => {
    cookies.remove('accessToken', { path: '/' });
    router.replace('/login');
    window.location.reload();
  };

  const handleLanguageChange = (newLocale: string) => {
    cookies.set('NEXT_LOCALE', newLocale, { path: '/' });
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="flex h-20 items-center gap-4 px-4 lg:h-[75px] lg:px-6 bg-white dark:bg-background border-b">
      {/* Mobile menu */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5 text-black dark:text-white" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col bg-white dark:bg-background h-screen lg:hidden"
        >
          <SheetTitle className="hidden"></SheetTitle>
          <Sidebar handleLinkClick={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Topbar */}
      <div className="flex w-full items-center justify-between">
        {/* Location title */}
        <div className="flex flex-row gap-3 items-center cursor-pointer">
          <h2 className="font-semibold text-xl">
            {getReadableLocation(pathname)}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer rounded-full overflow-hidden w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity">
                <Icon icon={currentLanguage.icon} width={32} height={32} className="rounded-full" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg p-1">
              {Languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.locale}
                  onClick={() => handleLanguageChange(lang.locale)}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md ${
                    locale === lang.locale ? 'bg-blue-50' : ''
                  }`}
                >
                  <Icon icon={lang.icon} width={24} height={24} />
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="overflow-hidden">
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="https://eu.ui-avatars.com/api/?name=Admin&size=250"
                  alt="profile"
                  width={36}
                  height={36}
                  className="w-[35px] h-[35px] rounded-full object-cover border"
                />
                <h2 className="text-base font-medium">Admin</h2>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl shadow-lg p-1"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md text-red-500 hover:text-red-500 hover:bg-red-50"
              >
                <Icon
                  icon="solar:logout-2-linear"
                  width={18}
                  className="text-red-500"
                />
                <span className="text-red-500">{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Heading;
