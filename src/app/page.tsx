'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, UserCog, Package, Building2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Picky
          </h1>
          <p className="text-xl text-gray-600">
            Smart In-Store Shopping
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Escaneá, comprá y retirá sin cargar peso
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cliente */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/tienda/store-001')}>
            <CardHeader>
              <Store className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>Portal Cliente</CardTitle>
              <CardDescription>
                Experiencia de compra mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Ingresar como Cliente
              </Button>
            </CardContent>
          </Card>

          {/* Picker */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/picker')}>
            <CardHeader>
              <Package className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>Portal Picker</CardTitle>
              <CardDescription>
                Preparación de pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Ingresar como Picker
              </Button>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin')}>
            <CardHeader>
              <UserCog className="w-12 h-12 text-purple-600 mb-2" />
              <CardTitle>Portal Admin</CardTitle>
              <CardDescription>
                Dashboard y configuración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Ingresar como Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Link to Store Profile */}
        <div className="mt-8 text-center">
          <Button 
            variant="link" 
            onClick={() => router.push('/perfil-sucursal')}
            className="gap-2"
          >
            <Building2 className="w-4 h-4" />
            Ver Perfil de Sucursal Demo
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>MVP Prototipo - Frontend First con Mock Data</p>
          <p className="mt-2">Total: 17 pantallas (10 Cliente + 3 Picker + 4 Admin)</p>
        </div>
      </div>
    </div>
  );
}
