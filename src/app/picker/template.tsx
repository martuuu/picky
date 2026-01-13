import { PageTransition } from '@/components/PageTransition';
import { ReactNode } from 'react';

export default function PickerTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
