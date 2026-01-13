'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Package, LayoutGrid, LogOut, QrCode } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PickerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Pedidos',
      href: '/picker',
      icon: LayoutGrid,
      active: pathname === '/picker',
    },
    {
      label: 'Escanear Retiro',
      href: '/picker/retiro',
      icon: QrCode,
      active: pathname === '/picker/retiro',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Picky Picker</h1>
              <p className="text-xs text-gray-500">Portal de Preparación</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  item.active ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
