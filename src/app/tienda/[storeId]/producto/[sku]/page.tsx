'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Tag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { Product } from '@/types/product';
import { formatPrice, parseProducts } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import mockProducts from '@/data/mock-products.json';
import { RelatedOffersSheet } from '@/components/cliente/RelatedOffersSheet';

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const sku = params.sku as string;

  const { cart, addItem, getItemQuantity } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRelatedOffers, setShowRelatedOffers] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const products = parseProducts(mockProducts.products as Record<string, unknown>[]);
      const foundProduct = products.find(p => p.sku === sku);
      
      setProduct(foundProduct || null);
      setLoading(false);
    };

    if (sku) {
      loadProduct();
    }
  }, [sku]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock < quantity) {
      toast.error('Stock insuficiente', {
        description: `Solo hay ${product.stock} unidades disponibles`,
      });
      return;
    }

    addItem(product, quantity, observations || undefined);
    
    toast.success('Producto agregado al carrito', {
      description: `${quantity}x ${product.name}`,
      action: {
        label: 'Ver carrito',
        onClick: () => router.push(`/tienda/${storeId}/carrito`),
      },
    });

    // Show related offers modal if product has related products
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      setShowRelatedOffers(true);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Producto no encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              No pudimos encontrar el producto con código: {sku}
            </p>
            <Button onClick={() => router.push(`/tienda/${storeId}/catalogo`)}>
              Ver catálogo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const inCartQuantity = getItemQuantity(product.id);
  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold line-clamp-1 flex-1 mx-4">
            {product.name}
          </h1>
          
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

      {/* Product Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {/* Image Carousel */}
        <div className="relative bg-white">
          <div className="relative aspect-square">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-lg px-3 py-1">
                -{discountPercent}%
              </Badge>
            )}

            {inCartQuantity > 0 && (
              <Badge className="absolute top-4 right-4 bg-green-600 flex items-center gap-1 px-3 py-1">
                <ShoppingCart className="w-4 h-4" />
                {inCartQuantity} en carrito
              </Badge>
            )}
          </div>

          {/* Image Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>

          {/* Title & Price */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 10 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ En stock ({product.stock} disponibles)
              </Badge>
            ) : product.stock > 0 ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                ⚠️ Últimas unidades (quedan {product.stock})
              </Badge>
            ) : (
              <Badge variant="destructive">
                Sin stock
              </Badge>
            )}
          </div>

          {/* Bulk Discounts */}
          {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Tag className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      💰 Ofertas por cantidad
                    </p>
                    {product.bulkDiscounts.map((discount, index) => (
                      <p key={index} className="text-sm text-blue-700">
                        • {discount.label}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Accordion */}
          {product.specifications && product.specifications.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-lg font-semibold">
                  Especificaciones Técnicas
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b last:border-0">
                        <span className="font-medium text-gray-700">{spec.label}</span>
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Quantity Selector */}
          <Card>
            <CardContent className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-2xl font-bold w-16 text-center">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="h-12 w-12"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardContent className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (opcional)
              </label>
              <Textarea
                placeholder="Ej: Sin tornillos, solo tuercas"
                value={observations}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservations(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {observations.length}/200 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Related Products Teaser */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <Card className="bg-linear-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-purple-900">
                  <Sparkles className="w-5 h-5" />
                  <p className="font-semibold">
                    Otros clientes también compraron productos relacionados
                  </p>
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Agregá este producto al carrito para ver ofertas combinadas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Seguir viendo
          </Button>
          
          <Button
            className="flex-1 h-12 text-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Agregar al carrito
          </Button>
        </div>
      </div>

      {/* Related Offers Modal */}
      {product && product.relatedProducts && (
        <RelatedOffersSheet
          isOpen={showRelatedOffers}
          onClose={() => setShowRelatedOffers(false)}
          relatedProductIds={product.relatedProducts}
          storeId={storeId}
        />
      )}
    </div>
  );
}
