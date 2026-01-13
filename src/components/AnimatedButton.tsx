'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'primary',
  size = 'md',
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </motion.button>
  );
}
