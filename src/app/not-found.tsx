'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Store, 
  Package, 
  UserCog, 
  QrCode,
  Search,
  AlertCircle
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      title: 'Inicio',
      description: 'Volver al home',
      icon: Home,
      href: '/',
      color: 'purple'
    },
    {
      title: 'Portal Cliente',
      description: 'Experiencia de compra',
      icon: Store,
      href: '/tienda/store-001',
      color: 'green'
    },
    {
      title: 'Portal Picker',
      description: 'Preparar pedidos',
      icon: Package,
      href: '/picker',
      color: 'blue'
    },
    {
      title: 'Portal Admin',
      description: 'Dashboard y config',
      icon: UserCog,
      href: '/admin',
      color: 'purple'
    },
    {
      title: 'Catálogo',
      description: 'Ver productos',
      icon: Search,
      href: '/tienda/store-001/catalogo',
      color: 'orange'
    },
    {
      title: 'Escanear QR',
      description: 'Escanear productos',
      icon: QrCode,
      href: '/tienda/store-001/escanear',
      color: 'pink'
    }
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Error Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
            <AlertCircle className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Página No Encontrada
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o fue movida. 
            Usa los accesos rápidos para continuar navegando.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card
                key={link.href}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                onClick={() => router.push(link.href)}
              >
                <div className="p-6">
                  <div 
                    className={`w-12 h-12 rounded-lg ${colorClasses[link.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 transition-colors`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {link.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta a soporte: 
            <a href="mailto:soporte@picky.app" className="text-purple-600 hover:underline ml-1">
              soporte@picky.app
            </a>
          </p>
        </div>

        {/* Fun Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-400">
            <div>
              <span className="block text-2xl font-bold text-purple-600">17</span>
              <span>Pantallas</span>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div>
              <span className="block text-2xl font-bold text-green-600">3</span>
              <span>Portales</span>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div>
              <span className="block text-2xl font-bold text-blue-600">100%</span>
              <span>Prototipo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
