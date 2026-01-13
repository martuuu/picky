'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RetiroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Punto de Retiro
        </h1>
        <p className="text-gray-600 mb-6">
          Gestión de entregas
        </p>
        <Button variant="ghost" onClick={() => router.push('/picker')}>
          ← Volver
        </Button>
      </div>
    </div>
  );
}
