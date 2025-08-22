import React from 'react';
import { SmartLink } from '@/components/navigation/SmartLink';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav 
      aria-label="breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && (
              <Home className="h-3 w-3 mr-1" />
            )}
            
            {item.href ? (
              <SmartLink 
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </SmartLink>
            ) : (
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            )}
            
            {index < items.length - 1 && (
              <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};