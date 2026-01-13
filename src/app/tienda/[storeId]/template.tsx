import { PageTransition } from '@/components/PageTransition';
import { ReactNode } from 'react';

export default function TiendaTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
