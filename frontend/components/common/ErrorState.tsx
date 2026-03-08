import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry, 
  message = 'Failed to load data' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      <Icon
        icon="solar:box-minimalistic-broken"
        width={48}
        height={48}
        className="text-red-500"
      />
      <p className="text-center text-gray-600">{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="mt-2"
        >
          Retry
        </Button>
      )}
    </div>
  );
};