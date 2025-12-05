import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-10 px-3 py-2 pr-10 text-sm',
              'bg-background border border-input rounded-md',
              'appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown 
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" 
            size={16} 
          />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
