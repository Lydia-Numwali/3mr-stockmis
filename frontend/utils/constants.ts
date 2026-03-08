export const Languages: any[] = [
  {
    icon: "emojione:flag-for-united-states",
    locale: "en",
    name: "English",
  },
  {
    icon: "emojione:flag-for-france",
    locale: "fr",
    name: "French",
  },
  {
    icon: "emojione:flag-for-rwanda",
    locale: "ki",
    name: "Kinyarwanda",
  },
];

export const statusOptions = [
  {
    id: "ACTIVE",
    name: "Active",
  },
  {
    id: "INACTIVE",
    name: "Inactive",
  },
];

export const dateFiltersOptions = [
  {
    labelKey: "tables.common.date_filters.this_week",
    value: "this-week",
    dateRange: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  },
  {
    labelKey: "tables.common.date_filters.last_week",
    value: "last-week",
    dateRange: {
      from: dayjs().subtract(1, "week").startOf("week").format("YYYY-MM-DD"),
      to: dayjs().subtract(1, "week").endOf("week").format("YYYY-MM-DD"),
    },
  },
  {
    labelKey: "tables.common.date_filters.this_month",
    value: "this-month",
    dateRange: {
      from: dayjs().startOf("month").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  },
  {
    labelKey: "tables.common.date_filters.last_month",
    value: "last-month",
    dateRange: {
      from: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
      to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
    },
  },
  {
    labelKey: "tables.common.date_filters.this_year",
    value: "this-year",
    dateRange: {
      from: dayjs().startOf("year").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  },
  {
    labelKey: "tables.common.date_filters.last_year",
    value: "last-year",
    dateRange: {
      from: dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
      to: dayjs().subtract(1, "year").endOf("year").format("YYYY-MM-DD"),
    },
  },
];

export const roles: any[] = [
  {
    id: "1",
    institutionId: "inst-1",
    name: "Super admin",
    description:
      "Full control over the system, including user roles, permissions, settings, and visitor management.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    rolePermissions: [],
    usersCount: 2,
  },
  {
    id: "2",
    institutionId: "inst-1",
    name: "Operator",
    description:
      "Manages visitor check-ins, approvals, badge printing, and maintains daily visitor logs.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    rolePermissions: [],
    usersCount: 120,
  },
  {
    id: "3",
    institutionId: "inst-1",
    name: "Employee",
    description:
      "Can pre-register visitors, receive arrival alerts, and access their visit history.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    rolePermissions: [],
    usersCount: 123409,
  },
  {
    id: "4",
    institutionId: "inst-1",
    name: "Visitor",
    description:
      "Can check in at the front desk, provide ID, and view details about their visit.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    rolePermissions: [],
    usersCount: 982233123,
  },
];


export const logs: any[] = [
  {
    name: "Olivia Rhye",
    username: "@olivia",
    entryTime: "2024-07-09T14:04:36Z",
    exitTime: "2024-07-09T16:04:36Z",
    duration: "02:00:00",
  },
  {
    name: "Phoenix Baker",
    username: "@phoenix",
    entryTime: "2024-07-09T10:30:15Z",
    exitTime: "2024-07-09T12:45:15Z",
    duration: "02:15:00",
  },
  {
    name: "Lana Steiner",
    username: "@lana",
    entryTime: "2024-07-09T08:20:50Z",
    exitTime: "2024-07-09T09:50:50Z",
    duration: "01:30:00",
  },
  {
    name: "Demi Wilkinson",
    username: "@demi",
    entryTime: "2024-07-09T15:10:00Z",
    exitTime: "2024-07-09T18:40:00Z",
    duration: "03:30:00",
  },
  {
    name: "Candice Wu",
    username: "@candice",
    entryTime: "2024-07-09T06:05:22Z",
    exitTime: "2024-07-09T09:05:22Z",
    duration: "03:00:00",
  },
  {
    name: "Natali Craig",
    username: "@natali",
    entryTime: "2024-07-09T07:15:45Z",
    exitTime: "2024-07-09T10:15:45Z",
    duration: "03:00:00",
  },
  {
    name: "Drew Cano",
    username: "@drew",
    entryTime: "2024-07-09T11:45:30Z",
    exitTime: "2024-07-09T14:30:30Z",
    duration: "02:45:00",
  },
  {
    name: "Orlando Diggs",
    username: "@orlando",
    entryTime: "2024-07-09T09:00:00Z",
    exitTime: "2024-07-09T12:00:00Z",
    duration: "03:00:00",
  },
  {
    name: "Andi Lane",
    username: "@andi",
    entryTime: "2024-07-09T16:30:10Z",
    exitTime: "2024-07-09T18:30:10Z",
    duration: "02:00:00",
  },
  {
    name: "Kate Morrison",
    username: "@kate",
    entryTime: "2024-07-09T13:55:05Z",
    exitTime: "2024-07-09T15:55:05Z",
    duration: "02:00:00",
  },
];

import dayjs from "dayjs";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getLocale = () => {
  const locale = cookies.get("NEXT_LOCALE");
  return locale;
};

export enum Role {
  USER = "USER",
  SUPERVISOR = "SUPERVISOR",
  ADMIN = "ADMIN",
}

const locale = getLocale();

export const ROLE_REDIRECTS: Record<Role, string> = {
  [Role.USER]: "https://app.vms.com",
  [Role.SUPERVISOR]: "https://supervisor.vms.com",
  [Role.ADMIN]: "https://admin.vms.com",
};

export const APP_ROUTES = {
  LOGIN: (locale: string) => `/${locale}/login`,
  SIGNUP: (locale: string) => `/${locale}/signup`,
  NEW_PASSWORD: (locale: string) => `/${locale}/new-password`,
  RESET_PASSWORD: (locale: string) => `/${locale}/reset-password`,
  TWO_FACTOR_AUTH: (locale: string) => `/${locale}/two-factor-authentication`,
  VERIFY_EMAIL: (locale: string) => `/${locale}/verify-email`,
  NOT_FOUND: (locale: string) => `/${locale}/not-found`,

  DASHBOARD: (locale: string) => `/${locale}/dashboard`,
  USERS: (locale: string) => `/${locale}/users`,
  ROLES: (locale: string) => `/${locale}/roles`,
  INSTITUTIONS: (locale: string) => `/${locale}/institutions`,
  EMPLOYEES: (locale: string) => `/${locale}/employees`,
  VISITORS: (locale: string) => `/${locale}/visitors`,
  REPORTS: (locale: string) => `/${locale}/reports`,
  BADGES: (locale: string) => `/${locale}/badges`,
  LOGS: (locale: string) => `/${locale}/logs`,

  INSTITUTIONS_DEPARTMENTS: (locale: string) =>
    `/${locale}/institutions/departments`,
  EMPLOYEES_ATTENDANCE: (locale: string) => `/${locale}/employees/attendance`,
  BADGES_EMPLOYEES: (locale: string) => `/${locale}/badges/employees`,
  BADGES_VISITORS: (locale: string) => `/${locale}/badges/visitors`,
  LOGS_DEPARTMENTS: (locale: string) => `/${locale}/logs/departments`,
  LOGS_ORGANIZATIONS: (locale: string) => `/${locale}/logs/organizations`,
};

