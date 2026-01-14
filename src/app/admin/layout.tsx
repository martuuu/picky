'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Package, Settings, LayoutDashboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Inicio', href: '/' }];
    
    if (segments[0] === 'admin') {
      breadcrumbs.push({ label: 'Admin', href: '/admin' });
      
      if (segments[1] === 'analytics') {
        breadcrumbs.push({ label: 'Analytics', href: '/admin/analytics' });
      } else if (segments[1] === 'productos') {
        breadcrumbs.push({ label: 'Productos & QR', href: '/admin/productos' });
      } else if (segments[1] === 'configuracion') {
        breadcrumbs.push({ label: 'Configuración', href: '/admin/configuracion' });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-purple-600">Picky Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Panel de Administración</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin') && pathname === '/admin'
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/analytics" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/analytics')
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/productos" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/productos')
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Productos & QR</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/configuracion" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/configuracion')
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Configuración</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => router.push('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs font-medium text-purple-900">Bazar Casa Bella</p>
            <p className="text-xs text-purple-600 mt-1">store-001</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span className="text-gray-400">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-600 hover:text-purple-600">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
