'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { BarChart3, Package, Clock, TrendingUp } from 'lucide-react';

export default function HistorialPickerPage() {
  const router = useRouter();

  // Mock historical data
  const stats = {
    today: { orders: 12, items: 87, avgTime: '8.5 min' },
    week: { orders: 68, items: 542, avgTime: '9.2 min' },
    month: { orders: 287, items: 2340, avgTime: '9.0 min' },
    allTime: { orders: 1523, items: 12450, avgTime: '9.3 min' }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/picker')}
          >
            ← Volver al Portal Picker
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Historial de Preparación</h1>
          <p className="text-gray-600">Estadísticas y métricas de rendimiento</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold">{stats.today.orders}</p>
              <p className="text-xs text-gray-500">{stats.today.items} items • {stats.today.avgTime} avg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Esta Semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold">{stats.week.orders}</p>
              <p className="text-xs text-gray-500">{stats.week.items} items • {stats.week.avgTime} avg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Este Mes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold">{stats.month.orders}</p>
              <p className="text-xs text-gray-500">{stats.month.items} items • {stats.month.avgTime} avg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Total Histórico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold">{stats.allTime.orders}</p>
              <p className="text-xs text-gray-500">{stats.allTime.items} items • {stats.allTime.avgTime} avg</p>
            </CardContent>
          </Card>
        </div>

        {/* En Desarrollo */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              🚧 Dashboard de Métricas En Desarrollo
            </CardTitle>
            <CardDescription>
              Esta página está en construcción. Próximamente incluirá:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">📊 Gráficos de Rendimiento:</p>
              <p className="text-sm text-gray-600 pl-4">• Line chart: Pedidos preparados por día/semana/mes</p>
              <p className="text-sm text-gray-600 pl-4">• Bar chart: Tiempo promedio por pedido</p>
              <p className="text-sm text-gray-600 pl-4">• Pie chart: Distribución por estado (completados/cancelados/errores)</p>
              <p className="text-sm text-gray-600 pl-4">• Heatmap: Horas pico de actividad</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">🏆 Rankings y Leaderboards:</p>
              <p className="text-sm text-gray-600 pl-4">• Top pickers del mes (por velocidad)</p>
              <p className="text-sm text-gray-600 pl-4">• Top pickers por precisión (menos errores)</p>
              <p className="text-sm text-gray-600 pl-4">• Badges y achievements (100 pedidos, 500 pedidos, etc)</p>
              <p className="text-sm text-gray-600 pl-4">• Comparación con promedio del equipo</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">📋 Historial Detallado:</p>
              <p className="text-sm text-gray-600 pl-4">• Tabla con todos los pedidos preparados</p>
              <p className="text-sm text-gray-600 pl-4">• Filtros por fecha, estado, cliente</p>
              <p className="text-sm text-gray-600 pl-4">• Búsqueda por número de pedido</p>
              <p className="text-sm text-gray-600 pl-4">• Exportar a CSV/PDF para reportes</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">⏱️ Análisis de Tiempos:</p>
              <p className="text-sm text-gray-600 pl-4">• Tiempo promedio por producto</p>
              <p className="text-sm text-gray-600 pl-4">• Productos más lentos de localizar</p>
              <p className="text-sm text-gray-600 pl-4">• Sugerencias de optimización de layout</p>
              <p className="text-sm text-gray-600 pl-4">• Tiempo de espera del cliente (desde pago hasta listo)</p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm font-semibold">🎯 Métricas de Calidad:</p>
              <p className="text-sm text-gray-600 pl-4">• Tasa de error (productos incorrectos/faltantes)</p>
              <p className="text-sm text-gray-600 pl-4">• Retrabajos (pedidos devueltos para corrección)</p>
              <p className="text-sm text-gray-600 pl-4">• Feedback de clientes (calificaciones post-retiro)</p>
              <p className="text-sm text-gray-600 pl-4">• Índice de eficiencia general (composite score)</p>
            </div>
          </CardContent>
        </Card>

        {/* Mock Chart Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Pedidos por Día (Último mes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Line Chart Preview</p>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo Promedio por Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Bar Chart Preview</p>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4" />
                Top 10 Productos Preparados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Ranking List Preview</p>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Distribución por Estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Pie Chart Preview</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Recent Orders Table */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-sm">Últimos 10 Pedidos Preparados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">#{1000 + i}</span>
                    <Badge variant="secondary">Completado</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>5 items</span>
                    <span>7.5 min</span>
                    <span>Hace {i * 2} horas</span>
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
