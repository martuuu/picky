'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  ShoppingCart, 
  Store, 
  User, 
  Settings, 
  LogOut,
  Package,
  Search,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detectar el portal actual
  const isClientPortal = pathname.includes('/tienda/');
  const isPickerPortal = pathname.startsWith('/picker');
  const isAdminPortal = pathname.startsWith('/admin');
  const isStoreProfile = pathname === '/perfil-sucursal';

  // Extraer storeId si estamos en portal cliente
  const storeIdMatch = pathname.match(/\/tienda\/([^/]+)/);
  const storeId = storeIdMatch ? storeIdMatch[1] : 'demo';

  // No mostrar navbar en homepage principal
  if (pathname === '/') {
    return null;
  }

  const totalItems = cart?.items.reduce((sum: number, item) => sum + item.quantity, 0) || 0;

  const handleLogoClick = () => {
    router.push('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar búsqueda cuando tengamos la API
    console.log('Buscar:', searchQuery);
  };

  // Generar breadcrumbs dinámicamente
  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Inicio', href: '/' }];

    if (isClientPortal) {
      breadcrumbs.push({ label: 'Tienda', href: `/tienda/${storeId}` });
      
      if (pathname.includes('/catalogo')) {
        breadcrumbs.push({ label: 'Catálogo', href: `/tienda/${storeId}/catalogo` });
      } else if (pathname.includes('/producto/')) {
        breadcrumbs.push({ label: 'Catálogo', href: `/tienda/${storeId}/catalogo` });
        breadcrumbs.push({ label: 'Producto', href: '#' });
      } else if (pathname.includes('/carrito')) {
        breadcrumbs.push({ label: 'Carrito', href: `/tienda/${storeId}/carrito` });
      } else if (pathname.includes('/checkout')) {
        breadcrumbs.push({ label: 'Checkout', href: `/tienda/${storeId}/checkout` });
      } else if (pathname.includes('/confirmacion')) {
        breadcrumbs.push({ label: 'Confirmación', href: '#' });
      } else if (pathname.includes('/perfil/ajustes')) {
        breadcrumbs.push({ label: 'Perfil', href: `/tienda/${storeId}/perfil` });
        breadcrumbs.push({ label: 'Ajustes', href: '#' });
      } else if (pathname.includes('/perfil/direcciones')) {
        breadcrumbs.push({ label: 'Perfil', href: `/tienda/${storeId}/perfil` });
        breadcrumbs.push({ label: 'Direcciones', href: '#' });
      } else if (pathname.includes('/perfil')) {
        breadcrumbs.push({ label: 'Perfil', href: `/tienda/${storeId}/perfil` });
      } else if (pathname.includes('/pedido/')) {
        breadcrumbs.push({ label: 'Pedido', href: '#' });
      } else if (pathname.includes('/escanear')) {
        breadcrumbs.push({ label: 'Escanear QR', href: `/tienda/${storeId}/escanear` });
      }
    } else if (isPickerPortal) {
      breadcrumbs.push({ label: 'Portal Picker', href: '/picker' });
      
      if (pathname.includes('/historial')) {
        breadcrumbs.push({ label: 'Historial', href: '/picker/historial' });
      } else if (pathname.includes('/retiro')) {
        breadcrumbs.push({ label: 'Retiro', href: '/picker/retiro' });
      }
    } else if (isAdminPortal) {
      breadcrumbs.push({ label: 'Admin', href: '/admin' });
      
      if (pathname.includes('/productos')) {
        breadcrumbs.push({ label: 'Productos', href: '/admin/productos' });
      } else if (pathname.includes('/analytics')) {
        breadcrumbs.push({ label: 'Analytics', href: '/admin/analytics' });
      } else if (pathname.includes('/configuracion')) {
        breadcrumbs.push({ label: 'Configuración', href: '/admin/configuracion' });
      }
    } else if (isStoreProfile) {
      breadcrumbs.push({ label: 'Perfil de Sucursal', href: '/perfil-sucursal' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="w-8 h-8 bg-linear-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">Picky</span>
          </button>

          {/* Breadcrumbs - Centro (Solo visible en Cliente y Picker, NO en Admin) */}
          {!isAdminPortal && (
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-600 flex-1 overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1 shrink-0">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-gray-900">{crumb.label}</span>
                  ) : (
                    <button
                      onClick={() => router.push(crumb.href)}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Spacer para centrar cuando no hay breadcrumbs (Admin) */}
          {isAdminPortal && <div className="flex-1" />}

          {/* Búsqueda - Solo visible en portal cliente (desktop) */}
          {isClientPortal && (
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10 pr-4 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          )}

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
              aria-label="Cambiar tema"
            >
              <Sun className={`w-5 h-5 absolute transition-all duration-300 ${isDarkMode ? 'rotate-90 scale-0' : 'rotate-0 scale-100'} text-yellow-500`} />
              <Moon className={`w-5 h-5 absolute transition-all duration-300 ${isDarkMode ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} text-gray-700`} />
            </Button>

            {/* Portal Cliente */}
            {isClientPortal && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push(`/tienda/${storeId}/carrito`)}
                  aria-label="Ver carrito"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                      variant="destructive"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="Menú de usuario">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm font-semibold">
                          MN
                        </AvatarFallback>
                      </Avatar>
                      {/* Badge de notificaciones - siempre visible */}
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 border-2 border-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">Martín Navarro</p>
                      <p className="text-xs text-gray-500">Cliente Gold</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/tienda/${storeId}/perfil`)}>
                      <User className="w-4 h-4 mr-2" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/tienda/${storeId}/catalogo`)}>
                      <Package className="w-4 h-4 mr-2" />
                      Catálogo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/tienda/${storeId}/perfil/ajustes`)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogoClick}>
                      <Home className="w-4 h-4 mr-2" />
                      Volver al inicio
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Portal Picker */}
            {isPickerPortal && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Menú de usuario">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                        <Store className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge de notificaciones - siempre visible */}
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 border-2 border-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Deco Home Demo</p>
                    <p className="text-xs text-gray-500">Picker</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/perfil-sucursal')}>
                    <Store className="w-4 h-4 mr-2" />
                    Perfil de Tienda
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/picker')}>
                    <Package className="w-4 h-4 mr-2" />
                    Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/picker/historial')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Mi Historial
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoClick}>
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Portal Admin */}
            {isAdminPortal && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Menú de usuario">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                        <Store className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge de notificaciones - siempre visible */}
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 border-2 border-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Deco Home Demo</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/perfil-sucursal')}>
                    <Store className="w-4 h-4 mr-2" />
                    Perfil de Tienda
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/productos')}>
                    <Package className="w-4 h-4 mr-2" />
                    Productos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/configuracion')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoClick}>
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Perfil de Sucursal */}
            {isStoreProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menú de tienda">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-sm font-semibold">
                        <Store className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Deco Home Demo</p>
                    <p className="text-xs text-gray-500">Tienda</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoClick}>
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
