'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, ShoppingCart, X, Package, User } from 'lucide-react';
import { ProductCard } from '@/components/cliente/ProductCard';
import { useCartStore } from '@/stores/useCartStore';
import { Category } from '@/types/product';
import { parseProducts } from '@/lib/utils';
import mockProducts from '@/data/mock-products.json';
import mockCategories from '@/data/mock-categories.json';

export default function CatalogoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  
  const { cart, getItemQuantity } = useCartStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoading(false);
    };
    loadData();
  }, []);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = parseProducts(mockProducts.products as Record<string, unknown>[]);

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/tienda/${storeId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg font-semibold">Catálogo</h1>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/tienda/${storeId}/perfil`)}
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => router.push(`/tienda/${storeId}/carrito`)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto px-4 pb-3">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start h-auto p-1 bg-gray-100">
                <TabsTrigger value="all" className="text-sm whitespace-nowrap">
                  Todos
                </TabsTrigger>
                {(mockCategories.categories as Category[]).map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-sm whitespace-nowrap"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pb-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inCart={getItemQuantity(product.id)}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No encontramos productos
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              {searchTerm
                ? `No hay productos que coincidan con "${searchTerm}"`
                : 'No hay productos en esta categoría'}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => router.push(`/tienda/${storeId}/carrito`)}
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0">
              {cartItemsCount}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
