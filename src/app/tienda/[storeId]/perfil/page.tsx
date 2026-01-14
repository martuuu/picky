'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  ShoppingBag, 
  TrendingDown, 
  Gift, 
  Award,
  Settings,
  ChevronRight,
  Crown,
  Calendar
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function PerfilClientePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  // Mock user data
  const userData = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    memberSince: 'Marzo 2025',
    totalOrders: 24,
    totalSpent: 48750,
    totalSaved: 12300,
    level: 'Gold',
    points: 2450,
    nextLevelPoints: 3000,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tienda/${storeId}`)}
          >
            ← Volver
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Crown className="w-3 h-3 mr-1" />
                    {userData.level}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Desde {userData.memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress to next level */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso a Platinum</span>
                <span className="font-semibold">{userData.points}/{userData.nextLevelPoints} pts</span>
              </div>
              <Progress value={(userData.points / userData.nextLevelPoints) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 text-center">
              <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{userData.totalOrders}</p>
              <p className="text-xs text-gray-500">Pedidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <TrendingDown className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">${(userData.totalSaved / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-500">Ahorrado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{userData.points}</p>
              <p className="text-xs text-gray-500">Puntos</p>
            </CardContent>
          </Card>
        </div>

        {/* En Desarrollo - Secciones */}
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Historial de Pedidos
            </CardTitle>
            <CardDescription>
              Próximamente: Lista completa de todos tus pedidos con detalles, estados, facturas y opción de recompra rápida.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Estadísticas de Compra
            </CardTitle>
            <CardDescription>
              Próximamente: Gráficos de tus compras mensuales, categorías favoritas, productos más comprados y análisis de ahorro.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-dashed border-green-300 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Promociones & Vouchers
            </CardTitle>
            <CardDescription>
              Próximamente: Cupones exclusivos, códigos de descuento, ofertas personalizadas y recompensas por fidelidad.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              MiPicky Premium
            </CardTitle>
            <CardDescription>
              Próximamente: Suscripción especial con envío gratis ilimitado, descuentos exclusivos, acceso anticipado a ofertas y soporte prioritario.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4"
            onClick={() => router.push(`/tienda/${storeId}/perfil/ajustes`)}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Detalles de Cuenta</p>
                <p className="text-xs text-gray-500">Datos personales y preferencias</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4"
            onClick={() => router.push(`/tienda/${storeId}/perfil/direcciones`)}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Direcciones de Entrega</p>
                <p className="text-xs text-gray-500">Gestionar direcciones guardadas</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Total Spent */}
        <Card className="bg-linear-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90 mb-1">Total Invertido</p>
            <p className="text-3xl font-bold">${userData.totalSpent.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">En {userData.totalOrders} compras desde {userData.memberSince}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
