'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Mock data - En producción vendría de la API
  const stats = {
    todaySales: 125000,
    todayOrders: 42,
    avgOrderValue: 2976,
    activeCustomers: 28,
    pendingOrders: 5,
    preparingOrders: 3,
    readyOrders: 2,
    completedToday: 32,
  };

  const recentOrders = [
    {
      id: 'PK-001234',
      customer: 'María González',
      amount: 4500,
      items: 3,
      status: 'PREPARING',
      time: '2 min',
    },
    {
      id: 'PK-001233',
      customer: 'Juan Pérez',
      amount: 12800,
      items: 8,
      status: 'READY_FOR_PICKUP',
      time: '15 min',
    },
    {
      id: 'PK-001232',
      customer: 'Ana López',
      amount: 3200,
      items: 2,
      status: 'COMPLETED',
      time: '1 hora',
    },
    {
      id: 'PK-001231',
      customer: 'Carlos Ruiz',
      amount: 8900,
      items: 5,
      status: 'PAID',
      time: '3 min',
    },
  ];

  const topProducts = [
    { name: 'Olla de Acero Inoxidable 24cm', sales: 18, revenue: 340200 },
    { name: 'Juego de Platos 18 Piezas', sales: 12, revenue: 294000 },
    { name: 'Set Cuchillos Acero', sales: 15, revenue: 224250 },
    { name: 'Sartén Antiadherente 28cm', sales: 22, revenue: 281600 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vista general de tu tienda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ventas Hoy
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.todaySales / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+12% vs ayer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Hoy
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+8% vs ayer</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ticket Promedio
            </CardTitle>
            <Package className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgOrderValue}</div>
            <p className="text-xs text-gray-500 mt-1">Por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clientes Activos
            </CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">En tienda ahora</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuevos</p>
                <p className="text-3xl font-bold mt-1">{stats.pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preparando</p>
                <p className="text-3xl font-bold mt-1">{stats.preparingOrders}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Listos</p>
                <p className="text-3xl font-bold mt-1">{stats.readyOrders}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-3xl font-bold mt-1">{stats.completedToday}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{order.id}</p>
                      <Badge 
                        variant="outline"
                        className={
                          order.status === 'PAID' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'PREPARING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.status === 'READY_FOR_PICKUP' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {order.status === 'PAID' && 'Nuevo'}
                        {order.status === 'PREPARING' && 'Preparando'}
                        {order.status === 'READY_FOR_PICKUP' && 'Listo'}
                        {order.status === 'COMPLETED' && 'Completado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.items} items • Hace {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.sales} ventas • ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(product.sales / 22) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
