'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, TrendingUp, Users, Package } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data para gráficos
  const salesByHour = [
    { hour: '09:00', ventas: 8500, pedidos: 3 },
    { hour: '10:00', ventas: 12300, pedidos: 5 },
    { hour: '11:00', ventas: 18900, pedidos: 7 },
    { hour: '12:00', ventas: 24500, pedidos: 9 },
    { hour: '13:00', ventas: 32100, pedidos: 12 },
    { hour: '14:00', ventas: 28700, pedidos: 10 },
    { hour: '15:00', ventas: 22400, pedidos: 8 },
    { hour: '16:00', ventas: 19800, pedidos: 7 },
    { hour: '17:00', ventas: 26300, pedidos: 10 },
    { hour: '18:00', ventas: 31200, pedidos: 11 },
    { hour: '19:00', ventas: 18500, pedidos: 6 },
  ];

  const salesByDay = [
    { day: 'Lun', ventas: 125000, pedidos: 42 },
    { day: 'Mar', ventas: 138000, pedidos: 48 },
    { day: 'Mie', ventas: 142000, pedidos: 51 },
    { day: 'Jue', ventas: 156000, pedidos: 54 },
    { day: 'Vie', ventas: 178000, pedidos: 62 },
    { day: 'Sab', ventas: 195000, pedidos: 68 },
    { day: 'Dom', ventas: 89000, pedidos: 31 },
  ];

  const categoryDistribution = [
    { name: 'Cocina y Mesa', value: 35, color: '#8b5cf6' },
    { name: 'Decoración', value: 28, color: '#ec4899' },
    { name: 'Limpieza', value: 18, color: '#3b82f6' },
    { name: 'Organización', value: 12, color: '#10b981' },
    { name: 'Otros', value: 7, color: '#f59e0b' },
  ];

  const conversionFunnel = [
    { stage: 'Visitantes', count: 450, percentage: 100 },
    { stage: 'Escanearon QR', count: 380, percentage: 84 },
    { stage: 'Agregaron al Carrito', count: 285, percentage: 63 },
    { stage: 'Iniciaron Checkout', count: 198, percentage: 44 },
    { stage: 'Completaron Pago', count: 165, percentage: 37 },
  ];

  const customerMetrics = {
    totalCustomers: 1250,
    newToday: 28,
    returningRate: 42,
    avgSessionTime: '8:34',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Análisis detallado de tu tienda</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold mt-1">{customerMetrics.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuevos Hoy</p>
                <p className="text-2xl font-bold mt-1">{customerMetrics.newToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa de Retorno</p>
                <p className="text-2xl font-bold mt-1">{customerMetrics.returningRate}%</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold mt-1">{customerMetrics.avgSessionTime}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="conversion">Conversión</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Hora (Hoy)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Ventas ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos por Hora (Hoy)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pedidos" fill="#3b82f6" name="Pedidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ventas Semanales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas ($)" />
                  <Bar dataKey="pedidos" fill="#ec4899" name="Pedidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embudo de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-gray-600">
                        {stage.count} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-linear-to-r from-purple-600 to-pink-600 h-8 rounded-full transition-all flex items-center justify-center"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        <span className="text-white text-xs font-semibold">
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Insights</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• 84% de los visitantes escanean al menos un producto</li>
                  <li>• 63% agregan productos al carrito</li>
                  <li>• 37% completan la compra (tasa de conversión)</li>
                  <li>• Oportunidad: Optimizar el checkout para aumentar conversión</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
