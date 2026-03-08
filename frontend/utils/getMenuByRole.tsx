"use client";

import { EUserRoles } from "@/types";
import { PERMISSIONS, PermissionValue } from "@/types/permissions";
import { useTranslations } from "next-intl";

export interface MenuItem {
  id: number;
  href: string;
  icon: string;
  label: string;
  requiredPermissions?: PermissionValue[];
  subItems?: MenuItem[];
}

type RoleMenus = {
  [key in EUserRoles]?: MenuItem[];
};

function getMenusByRole(role: EUserRoles): MenuItem[] {
  // Use translations if available, otherwise fallback
  // Since we don't have stock translations yet, we map directly to labels or use common words

  const superAdminMenu: MenuItem[] = [
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
      href: "/super-admin/stock",
      icon: "solar:transfer-horizontal-bold",
      label: "Stock Movements",
    },
    {
      id: 4,
      href: "/super-admin/sales",
      icon: "solar:cart-large-minimalistic-bold",
      label: "Sales",
    },
    {
      id: 5,
      href: "/super-admin/lending",
      icon: "solar:hand-money-bold",
      label: "Lending",
    },
    {
      id: 6,
      href: "/super-admin/reports",
      icon: "solar:document-text-bold",
      label: "Reports",
    },
  ];

  const operatorMenu: MenuItem[] = [
    {
      id: 1,
      href: "/super-operator/dashboard",
      icon: "solar:widget-5-bold",
      label: "Dashboard",
    },
    {
      id: 2,
      href: "/super-operator/products",
      icon: "solar:box-minimalistic-bold",
      label: "Products",
    },
    {
      id: 3,
      href: "/super-operator/stock",
      icon: "solar:transfer-horizontal-bold",
      label: "Stock Movements",
    },
    {
      id: 4,
      href: "/super-operator/sales",
      icon: "solar:cart-large-minimalistic-bold",
      label: "Sales",
    },
    {
      id: 5,
      href: "/super-operator/lending",
      icon: "solar:hand-money-bold",
      label: "Lending",
    },
  ];

  const roleMenus: RoleMenus = {
    [EUserRoles.ADMIN]: superAdminMenu,
    [EUserRoles.OPERATOR]: operatorMenu,
    [EUserRoles.EMPLOYEE]: [],
    [EUserRoles.VISITOR]: [],
  };

  return roleMenus[role] || [];
}

export default getMenusByRole;

const rolePrefixes = ["super-admin", "super-operator", "employee", "visitor"];

function toTitleCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isDynamicSegment(segment: string): boolean {
  return (
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
      segment
    ) || /^\d+$/.test(segment)
  );
}

export function getReadableLocation(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  const filtered = segments.filter(
    (segment) => !rolePrefixes.includes(segment) && !isDynamicSegment(segment)
  );

  const customMap: Record<string, string> = {
    "dashboard": "Dashboard",
    "products": "Products Management",
    "stock": "Stock Management",
    "sales": "Sales Management",
    "lending": "Lending Management",
    "reports": "Reports",
  };

  const key = filtered.join("/");
  if (customMap[key]) return customMap[key];

  if (filtered.length === 1) {
    return toTitleCase(filtered[0]);
  }

  if (filtered.length === 2) {
    return `${toTitleCase(filtered[1])} ${toTitleCase(
      filtered[0].slice(0, -1)
    )}`;
  }

  return filtered.map(toTitleCase).join(" > ");
}
