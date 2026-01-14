'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useParams, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

export default function AjustesPage() {
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
          <h1 className="text-2xl font-bold mb-2">Ajustes de Cuenta</h1>
          <p className="text-gray-600">Gestiona tus datos personales y preferencias</p>
        </div>

        {/* En Desarrollo */}
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Secciones a desarrollar en prototipo o MVP
            </CardTitle>
            <CardDescription>
              Esta página está en construcción. Próximamente incluirá:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Datos Personales:</p>
              <p className="text-sm text-gray-600 pl-4">• Editar nombre, email, teléfono</p>
              <p className="text-sm text-gray-600 pl-4">• Cambiar foto de perfil</p>
              <p className="text-sm text-gray-600 pl-4">• Actualizar documento de identidad</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Notificaciones:</p>
              <p className="text-sm text-gray-600 pl-4">• Push notifications (pedidos, ofertas)</p>
              <p className="text-sm text-gray-600 pl-4">• Email marketing</p>
              <p className="text-sm text-gray-600 pl-4">• SMS de estado de pedido</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Seguridad:</p>
              <p className="text-sm text-gray-600 pl-4">• Cambiar contraseña</p>
              <p className="text-sm text-gray-600 pl-4">• Autenticación de dos factores</p>
              <p className="text-sm text-gray-600 pl-4">• Sesiones activas</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Preferencias:</p>
              <p className="text-sm text-gray-600 pl-4">• Tema oscuro/claro</p>
              <p className="text-sm text-gray-600 pl-4">• Idioma de la app</p>
              <p className="text-sm text-gray-600 pl-4">• Categorías favoritas</p>
            </div>
          </CardContent>
        </Card>

        {/* Mock Form Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa (No Funcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 opacity-50">
            <div>
              <Label>Nombre Completo</Label>
              <Input placeholder="Juan Pérez" disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input placeholder="juan.perez@email.com" disabled />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input placeholder="+54 9 11 1234-5678" disabled />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-semibold">Notificaciones Push</p>
                <p className="text-sm text-gray-500">Recibir alertas de pedidos</p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Ofertas por Email</p>
                <p className="text-sm text-gray-500">Promociones semanales</p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
