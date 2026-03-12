'use client';

import { Link, usePathname } from '@/i18n/routing';
import { Icon } from '@iconify/react';
import { FC } from 'react';

type props = {
  handleLinkClick?: () => void;
};

const Sidebar: FC<props> = ({ handleLinkClick }) => {
  const pathname = usePathname();

  const navItems = [
    {
      id: 1,
      href: "/super-admin/dashboard",
      icon: "solar:widget-5-bold",
      label: "Dashboard",
    },
    {
      id: 2,
      href: "/super-admin/products",
      icon: "solar:box-minimalistic-bold",
      label: "Products",
    },
    {
      id: 3,
      href: "/super-admin/purchases",
      icon: "solar:cart-plus-bold",
      label: "Purchases",
    },
    {
      id: 4,
      href: "/super-admin/stock",
      icon: "solar:transfer-horizontal-bold",
      label: "Stock Movements",
    },
    {
      id: 5,
      href: "/super-admin/sales",
      icon: "solar:cart-large-minimalistic-bold",
      label: "Sales",
    },
    {
      id: 6,
      href: "/super-admin/lending",
      icon: "solar:hand-money-bold",
      label: "Lending",
    },
    {
      id: 7,
      href: "/super-admin/reports",
      icon: "solar:document-text-bold",
      label: "Reports",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-secondary-blue text-white">
      {/* Brand */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-tight">3MR</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <Icon icon={item.icon} width={20} height={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
