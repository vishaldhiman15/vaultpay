import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  
  let variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' = 'default';

  switch (normalizedStatus) {
    case 'COMPLETED':
    case 'ACTIVE':
    case 'RESOLVED':
      variant = 'success';
      break;
    case 'PENDING':
    case 'INVESTIGATING':
      variant = 'warning';
      break;
    case 'FAILED':
    case 'REJECTED':
    case 'FROZEN':
    case 'CLOSED':
    case 'CRITICAL':
    case 'HIGH':
      variant = 'danger';
      break;
    default:
      variant = 'default';
  }

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}
