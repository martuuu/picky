import { PageTransition } from '@/components/PageTransition';
import { ReactNode } from 'react';

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
