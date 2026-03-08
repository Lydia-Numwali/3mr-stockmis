// Define the type for sublinks
interface SubLink {
  id: number;
  icons: string;
  name: string;
  url: string;
}

// Define the type for main links
interface Link {
  id: number;
  icons: string;
  name: string;
  url: string;
  sublinks?: SubLink[];
}

export const links: Link[] = [
  {
    id: 1,
    icons: 'solar:widget-5-bold',
    name: 'Dashboard',
    url: '/dashboard',
  },
  {
    id: 2,
    icons: 'solar:users-group-rounded-bold',
    name: 'Users',
    url: '/users',
  },
  {
    id: 3,
    icons: 'heroicons-outline:users',
    name: 'Operators',
    url: '/operators',
  },
  {
    id: 4,
    icons: 'solar:user-check-rounded-bold',
    name: 'Roles',
    url: '/roles',
  },

  {
    id: 5,
    icons: 'solar:buildings-2-bold',
    name: 'Institutions',
    url: '/institutions',
    sublinks: [
      {
        id: 1,
        icons: 'solar:buildings-linear',
        name: 'Departments',
        url: '/institutions/departments',
      },
    ],
  },
  {
    id: 6,
    icons: 'solar:users-group-two-rounded-bold',
    name: 'Employees',
    url: '/employees',
    sublinks: [
      {
        id: 1,
        icons: 'solar:user-check-linear',
        name: 'Attendance',
        url: '/employees/attendance',
      },
    ],
  },
  {
    id: 7,
    icons: 'solar:user-hand-up-bold',
    name: 'Visitors',
    url: '/visitors',
  },
  { id: 8, icons: 'solar:code-scan-bold', name: 'Reports', url: '/reports' },
  {
    id: 9,
    icons: 'solar:user-id-bold',
    name: 'Badges',
    url: '/badges',
    sublinks: [
      {
        id: 1,
        icons: 'solar:buildings-linear',
        name: 'Employees',
        url: '/badges/employees',
      },
      {
        id: 2,
        icons: 'solar:buildings-linear',
        name: 'Visitors',
        url: '/badges/visitors',
      },
    ],
  },
  {
    id: 10,
    icons: 'solar:server-minimalistic-bold',
    name: 'Logs',
    url: '/logs',
    sublinks: [
      {
        id: 1,
        icons: 'solar:buildings-linear',
        name: 'Departments',
        url: '/logs/departments',
      },
      {
        id: 2,
        icons: 'solar:buildings-linear',
        name: 'Organizations',
        url: '/logs/organizations',
      },
    ],
  },
];


const commonMenus = [
  {
    url:"Dashboard",
    icon:'solar:widget-5-bold',
    label:"Dashboard"
  }
]