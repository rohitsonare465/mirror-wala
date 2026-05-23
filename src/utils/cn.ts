import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind Merging utility to conditionally apply classnames 
 * without cascading style override bugs.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
