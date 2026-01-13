'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ClipboardList, CheckCircle } from 'lucide-react';

export default function PickerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portal Picker
          </h1>
          <p className="text-gray-600">
            Gestión y preparación de pedidos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ClipboardList className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>Pedidos Pendientes</CardTitle>
              <CardDescription>
                Ver y preparar pedidos nuevos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>Pedidos Completados</CardTitle>
              <CardDescription>
                Historial de pedidos preparados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
