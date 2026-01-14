'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Download, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  DollarSign,
  Eye
} from 'lucide-react';
import mockProducts from '@/data/mock-products.json';

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const products = mockProducts.products.slice(0, 10); // Mostrar primeros 10

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateQR = (sku: string) => {
    // Simulación de generación de QR
    alert(`Generando QR para producto: ${sku}`);
  };

  const handleDownloadAllQR = () => {
    alert('Descargando todos los códigos QR como PDF...');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos & Códigos QR</h1>
        <p className="text-gray-500 mt-1">Gestiona tu catálogo y genera códigos QR</p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleDownloadAllQR} className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Descargar Todos los QR
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Vista Grid</TabsTrigger>
          <TabsTrigger value="table">Vista Tabla</TabsTrigger>
        </TabsList>

        {/* Grid View */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                      {!product.isActive && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500">{product.sku}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">${product.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleGenerateQR(product.sku)}
                      >
                        <QrCode className="h-3 w-3 mr-1" />
                        QR
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Producto</th>
                      <th className="text-left py-3 px-4">SKU</th>
                      <th className="text-left py-3 px-4">Categoría</th>
                      <th className="text-right py-3 px-4">Precio</th>
                      <th className="text-center py-3 px-4">Stock</th>
                      <th className="text-center py-3 px-4">Estado</th>
                      <th className="text-center py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0 relative">
                              {product.imageUrl ? (
                                <Image 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-sm">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{product.sku}</td>
                        <td className="py-3 px-4 text-sm">{product.category}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">
                          ${product.price}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline">
                            {product.stock}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant="outline"
                            className={product.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                          >
                            {product.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleGenerateQR(product.sku)}
                            >
                              <QrCode className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Generation Info Card */}
      <Card className="mt-8 bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generación de Códigos QR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800">
            <div>
              <h4 className="font-semibold mb-2">📱 Para Móvil</h4>
              <p>Los clientes escanean el QR y acceden directamente al producto en su celular.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🖨️ Impresión</h4>
              <p>Descarga el PDF con todos los QR listos para imprimir y colocar en tu tienda.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Tracking</h4>
              <p>Cada escaneo se registra automáticamente en Analytics para medir engagement.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
