'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Plus } from 'lucide-react';

export default function DireccionesPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tienda/${storeId}/perfil`)}
          >
            ← Volver al Perfil
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Direcciones de Entrega</h1>
          <p className="text-gray-600">Gestiona tus direcciones guardadas</p>
        </div>

        {/* En Desarrollo */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Secciones a desarrollar en prototipo o MVP
            </CardTitle>
            <CardDescription>
              Esta página está en construcción. Próximamente incluirá:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">📍 Gestión de Direcciones:</p>
              <p className="text-sm text-gray-600 pl-4">• Lista de direcciones guardadas</p>
              <p className="text-sm text-gray-600 pl-4">• Agregar nueva dirección con mapa interactivo</p>
              <p className="text-sm text-gray-600 pl-4">• Editar o eliminar direcciones existentes</p>
              <p className="text-sm text-gray-600 pl-4">• Marcar dirección predeterminada</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">🗺️ Integración Google Maps:</p>
              <p className="text-sm text-gray-600 pl-4">• Autocompletado de direcciones</p>
              <p className="text-sm text-gray-600 pl-4">• Validación de zona de cobertura</p>
              <p className="text-sm text-gray-600 pl-4">• Cálculo de distancia desde tienda</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">🏠 Tipos de Dirección:</p>
              <p className="text-sm text-gray-600 pl-4">• Casa, Trabajo, Otro</p>
              <p className="text-sm text-gray-600 pl-4">• Notas de entrega (timbre, piso, dto)</p>
              <p className="text-sm text-gray-600 pl-4">• Contacto alternativo</p>
            </div>
          </CardContent>
        </Card>

        {/* Mock Preview */}
        <div className="space-y-3">
          <Button className="w-full" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Nueva Dirección
          </Button>

          <Card className="opacity-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Casa</p>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Predeterminada</span>
                  </div>
                  <p className="text-sm text-gray-600">Av. Santa Fe 1234, CABA</p>
                  <p className="text-xs text-gray-500 mt-1">Piso 5, Depto B - Timbre: López</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Trabajo</p>
                  <p className="text-sm text-gray-600">Av. Córdoba 5678, CABA</p>
                  <p className="text-xs text-gray-500 mt-1">Oficina 12 - Recepción</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
