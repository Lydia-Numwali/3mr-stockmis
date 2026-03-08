export interface ViewData {
    id: number;
    primaryColor: string;
    secondaryColor: string;
    icon: string; 
    name: string;
    value: string;
    percentage: string;
  }
  
  export const viewsData: ViewData[] = [
    {
      id: 1,
      primaryColor: '#13B04C',
      secondaryColor: '#F3FAF5',
      icon: 'solar:buildings-2-broken',
      name: 'Institutions',
      value: '230',
      percentage: '50%',
    },
    {
      id: 2,
      primaryColor: '#F97315',
      secondaryColor: '#FFF6F0',
      icon: 'solar:users-group-two-rounded-broken',
      name: 'Employees',
      value: '13K',
      percentage: '50%',
    },
    {
      id: 3,
      primaryColor: '#13B04C',
      secondaryColor: '#F3FAF5',
      icon: 'solar:users-group-rounded-broken',
      name: 'Operators',
      value: '128',
      percentage: '50%',
    },
    {
      id: 4,
      primaryColor: '#9813B0',
      secondaryColor: '#FCE9FF',
      icon: 'solar:user-hand-up-broken',
      name: 'Visitors',
      value: '349',
      percentage: '50%',
    },
  ];