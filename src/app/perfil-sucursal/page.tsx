'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Store, MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';

export default function PerfilSucursalPage() {
  const router = useRouter();

  // Mock store data
  const storeData = {
    name: 'Bazar Casa Bella',
    address: 'Av. Santa Fe 1234, CABA',
    phone: '+54 11 1234-5678',
    email: 'contacto@casabella.com',
    hours: {
      weekdays: '9:00 - 20:00',
      saturday: '10:00 - 18:00',
      sunday: 'Cerrado'
    },
    rating: 4.8,
    totalReviews: 245,
    categories: ['Bazar', 'Decoración', 'Hogar', 'Regalo'],
    activePromotions: 12,
    totalProducts: 450
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
          >
            ← Volver al Inicio
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Store Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Store className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{storeData.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">{storeData.rating}</span>
                  <span className="text-sm text-gray-500">({storeData.totalReviews} reseñas)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {storeData.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{storeData.totalProducts}</p>
                <p className="text-xs text-gray-500">Productos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{storeData.activePromotions}</p>
                <p className="text-xs text-gray-500">Ofertas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Dirección</p>
                <p className="text-sm text-gray-600">{storeData.address}</p>
                <Button variant="link" className="p-0 h-auto text-xs mt-1">
                  Ver en mapa <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Teléfono</p>
                <p className="text-sm text-gray-600">{storeData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-sm text-gray-600">{storeData.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lunes a Viernes</span>
              <span className="text-sm font-semibold">{storeData.hours.weekdays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sábados</span>
              <span className="text-sm font-semibold">{storeData.hours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Domingos</span>
              <span className="text-sm font-semibold text-red-600">{storeData.hours.sunday}</span>
            </div>
          </CardContent>
        </Card>

        {/* En Desarrollo */}
        <Card className="border-2 border-dashed border-green-300 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="w-5 h-5 text-green-600" />
              Secciones a desarrollar en prototipo o MVP
            </CardTitle>
            <CardDescription>
              Próximamente esta página incluirá:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Galería de Fotos:</p>
              <p className="text-sm text-gray-600 pl-4">• Fotos del interior de la tienda</p>
              <p className="text-sm text-gray-600 pl-4">• Showcase de productos destacados</p>
              <p className="text-sm text-gray-600 pl-4">• Eventos y promociones especiales</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Reseñas y Calificaciones:</p>
              <p className="text-sm text-gray-600 pl-4">• Comentarios de clientes verificados</p>
              <p className="text-sm text-gray-600 pl-4">• Sistema de puntuación por categorías</p>
              <p className="text-sm text-gray-600 pl-4">• Fotos subidas por clientes</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Eventos y Novedades:</p>
              <p className="text-sm text-gray-600 pl-4">• Calendario de eventos especiales</p>
              <p className="text-sm text-gray-600 pl-4">• Lanzamientos de nuevos productos</p>
              <p className="text-sm text-gray-600 pl-4">• Días de descuentos exclusivos</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Estadísticas Públicas:</p>
              <p className="text-sm text-gray-600 pl-4">• Productos más vendidos del mes</p>
              <p className="text-sm text-gray-600 pl-4">• Satisfacción del cliente promedio</p>
              <p className="text-sm text-gray-600 pl-4">• Tiempo promedio de preparación</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">Certificaciones y Premios:</p>
              <p className="text-sm text-gray-600 pl-4">• Sellos de calidad</p>
              <p className="text-sm text-gray-600 pl-4">• Reconocimientos de la comunidad</p>
              <p className="text-sm text-gray-600 pl-4">• Compliance y certificaciones</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
