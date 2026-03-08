import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Calendar, Sun } from 'lucide-react';

const AttendanceLabels = () => {
  const labels = [
    {
      label: 'Present',
      color: 'bg-green-500',
      shortcode: 'P',
      icon: <Check size={12} className="text-white" />,
    },
    {
      label: 'Absent',
      color: 'bg-red-500',
      shortcode: 'A',
      icon: <X size={12} className="text-white" />,
    },
    {
      label: 'Late Present',
      color: 'bg-yellow-400',
      shortcode: 'LP',
      icon: <Clock size={12} />,
    },
    {
      label: 'Holiday',
      color: 'bg-purple-600 text-white',
      shortcode: 'H',
      icon: <Calendar size={12} className="text-white" />,
    },
    {
      label: 'Leave',
      color: 'bg-indigo-500 text-white',
      shortcode: 'L',
      icon: <Calendar size={12} className="text-white" />,
    },
    {
      label: 'Weekend',
      color: 'bg-gray-300 text-black',
      shortcode: 'W',
      icon: <Sun size={12} />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 py-3">
      {labels.map((item) => (
        <div key={item.label} className="flex items-center gap-1">
          <Badge
            className={`${item.color} w-8 h-8 rounded-xl flex items-center justify-center font-bold`}
          >
            {item.shortcode}
          </Badge>
          <span className="text-sm text-gray-600 uppercase font-semibold tracking-wider">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AttendanceLabels;
