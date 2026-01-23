'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Tag, Sparkles, Users, TrendingUp } from 'lucide-react';
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
  const [showRelatedOffers, setShowRelatedOffers] = useState(false);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const products = parseProducts(mockProducts.products as Record<string, unknown>[]);
      const foundProduct = products.find(p => p.sku === sku);
      
      setProduct(foundProduct || null);
      
      // Load frequently bought together (simulate with products from same category)
      if (foundProduct) {
        const sameCategoryProducts = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 3);
        setFrequentlyBoughtTogether(sameCategoryProducts);
        
        // Load recommended products (simulate with featured products or different category)
        const recommended = products
          .filter(p => p.id !== foundProduct.id && p.category !== foundProduct.category)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setRecommendedProducts(recommended);
      }
      
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
        onClick: () => router.push(`/tienda/${storeId}/resumen`),
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
            <Button onClick={() => router.push(`/tienda/${storeId}/escanear`)}>
              Volver al scanner
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
          
          <h1 className="text-base font-semibold line-clamp-1 flex-1 mx-4">
            {product.name}
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => router.push(`/tienda/${storeId}/resumen`)}
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

      {/* Product Content - MAYORISTA REDESIGN */}
      <div className="flex-1 max-w-4xl mx-auto w-full pb-28">
        
        {/* Small Thumbnail + Category Badge */}
        <div className="bg-white p-4 flex items-start gap-4 border-b">
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border">
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {inCartQuantity > 0 && (
              <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{inCartQuantity}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <Badge variant="outline" className="text-xs mb-2">
              {product.category}
            </Badge>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>

        {/* HERO: PRECIO GIGANTE */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 border-b">
          <div className="text-center">
            {hasDiscount && (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <Badge className="bg-red-500 text-lg px-2 py-1">
                    -{discountPercent}%
                  </Badge>
                </div>
              </>
            )}
            
            <div className="text-6xl font-black text-green-600 mb-2">
              {formatPrice(product.price)}
            </div>
            
            <p className="text-sm text-gray-600">
              Precio por unidad
            </p>

            {/* Packaging/Bulto destacado */}
            {product.packaging && (
              <div className="mt-4 inline-block bg-white rounded-lg px-4 py-2 border-2 border-green-200">
                <p className="text-xs text-gray-500 mb-1">PRESENTACIÓN</p>
                <p className="text-lg font-bold text-gray-900">
                  📦 {product.packaging}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-center gap-2">
            {product.stock > 10 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base px-4 py-2">
                ✓ Stock disponible: {product.stock} unidades
              </Badge>
            ) : product.stock > 0 ? (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-base px-4 py-2">
                ⚠️ Últimas {product.stock} unidades
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-base px-4 py-2">
                Sin stock
              </Badge>
            )}
          </div>
        </div>

        {/* Volume Discounts - DESTACADO */}
        {product.volumeDiscounts && product.volumeDiscounts.length > 0 && (
          <Card className="m-4 border-2 border-purple-200 bg-linear-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Tag className="w-6 h-6 text-purple-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-bold text-purple-900 text-lg mb-3">
                    💰 Descuentos por Volumen
                  </p>
                  <div className="space-y-2">
                    {product.volumeDiscounts.map((discount, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="font-semibold text-gray-900">
                          {discount.minQuantity}+ unidades
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          {formatPrice(discount.pricePerUnit)} c/u
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 border-purple-300 text-purple-700"
                    onClick={() => {
                      toast.info('Comparador de Precios', {
                        description: 'Funcionalidad disponible próximamente',
                      });
                    }}
                  >
                    📊 Ver Comparador de Precios
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bulk Discounts (old format - backward compatibility) */}
        {product.bulkDiscounts && product.bulkDiscounts.length > 0 && (
          <Card className="m-4 bg-blue-50 border-blue-200">
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

        {/* Medidas y Packaging */}
        {(product.weight || product.dimensions || product.bulkType) && (
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="text-base">📏 Medidas y Packaging</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.bulkType && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-700">Tipo de Bulto</span>
                  <span className="text-gray-900 capitalize">{product.bulkType}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-700">Peso</span>
                  <span className="text-gray-900">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-700">Dimensiones</span>
                  <span className="text-gray-900">
                    {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quantity Selector - SIMPLIFIED */}
        <Card className="m-4">
          <CardContent className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cantidad a agregar
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-14 w-14"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                
                <span className="text-3xl font-bold w-20 text-center">
                  {quantity}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="h-14 w-14"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observations - ACCORDION */}
        <div className="m-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="observations">
              <AccordionTrigger className="text-base font-semibold px-4">
                💬 Observaciones (opcional)
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
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
                
                {/* Suggested observations */}
                {product.observations && product.observations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.observations.map((obs, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setObservations(obs)}
                          className="text-xs"
                        >
                          {obs}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Image Gallery Accordion */}
            {images.length > 1 && (
              <AccordionItem value="gallery">
                <AccordionTrigger className="text-base font-semibold px-4">
                  🖼️ Galería de Imágenes ({images.length})
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, index) => (
                      <div 
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-green-500 transition-colors cursor-pointer"
                        onClick={() => {
                          // Create a modal or lightbox effect
                          const imgWindow = window.open('', '_blank');
                          if (imgWindow) {
                            imgWindow.document.write(`
                              <html>
                                <head>
                                  <title>${product.name} - Imagen ${index + 1}</title>
                                  <style>
                                    body {
                                      margin: 0;
                                      display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      min-height: 100vh;
                                      background: #000;
                                    }
                                    img {
                                      max-width: 90vw;
                                      max-height: 90vh;
                                      object-fit: contain;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <img src="${img}" alt="${product.name}" />
                                </body>
                              </html>
                            `);
                          }
                        }}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Hacé click en una imagen para verla en grande
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Specifications Accordion */}
            {product.specifications && product.specifications.length > 0 && (
              <AccordionItem value="specs">
                <AccordionTrigger className="text-base font-semibold px-4">
                  📋 Especificaciones Técnicas
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
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
            )}
          </Accordion>
        </div>

        {/* Related Products Teaser */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <Card className="m-4 bg-linear-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-purple-900">
                <Sparkles className="w-5 h-5" />
                <p className="font-semibold">
                  Comprá en combo y ahorrá más
                </p>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                Agregá este producto al carrito para ver ofertas combinadas
              </p>
            </CardContent>
          </Card>
        )}

        {/* Frequently Bought Together */}
        {frequentlyBoughtTogether.length > 0 && (
          <div className="m-4">
            <Card className="border-2 border-orange-200 bg-linear-to-br from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
                  <Users className="w-5 h-5" />
                  🛒 Llevados juntos frecuentemente
                </CardTitle>
                <p className="text-sm text-orange-700">
                  Otros clientes compraron estos productos junto con este
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {frequentlyBoughtTogether.map((item) => {
                  const itemImages = item.images && item.images.length > 0 ? item.images : [item.imageUrl];
                  const itemInCart = getItemQuantity(item.id);
                  
                  return (
                    <div 
                      key={item.id}
                      className="bg-white rounded-lg p-3 flex gap-3 border hover:border-orange-300 transition-colors cursor-pointer"
                      onClick={() => router.push(`/tienda/${storeId}/producto/${item.sku}`)}
                    >
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={itemImages[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        {itemInCart > 0 && (
                          <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{itemInCart}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2 text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.stock > 0) {
                            addItem(item, 1);
                            toast.success('Agregado al carrito', {
                              description: item.name,
                            });
                          }
                        }}
                        disabled={item.stock === 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                
                <Button
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => {
                    let totalAdded = 0;
                    frequentlyBoughtTogether.forEach(item => {
                      if (item.stock > 0 && getItemQuantity(item.id) === 0) {
                        addItem(item, 1);
                        totalAdded++;
                      }
                    });
                    if (totalAdded > 0) {
                      toast.success('Productos agregados', {
                        description: `${totalAdded} productos agregados al carrito`,
                      });
                    }
                  }}
                >
                  ➕ Agregar todos al carrito
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="m-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  ⭐ También te puede interesar
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Productos recomendados para vos
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedProducts.map((item) => {
                    const itemImages = item.images && item.images.length > 0 ? item.images : [item.imageUrl];
                    const itemInCart = getItemQuantity(item.id);
                    const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                    const discountPercent = hasDiscount
                      ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                      : 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg overflow-hidden border hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => router.push(`/tienda/${storeId}/producto/${item.sku}`)}
                      >
                        <div className="relative w-full aspect-square bg-white">
                          <Image
                            src={itemImages[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {hasDiscount && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              -{discountPercent}%
                            </Badge>
                          )}
                          {itemInCart > 0 && (
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                              {itemInCart} en carrito
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <Badge variant="outline" className="text-xs mb-1">
                            {item.category}
                          </Badge>
                          <p className="font-medium text-sm line-clamp-2 text-gray-900 mb-2">
                            {item.name}
                          </p>
                          
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(item.price)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.originalPrice!)}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.stock > 0) {
                                addItem(item, 1);
                                toast.success('Agregado al carrito', {
                                  description: item.name,
                                });
                              }
                            }}
                            disabled={item.stock === 0}
                          >
                            {item.stock === 0 ? 'Sin stock' : 'Agregar'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/tienda/${storeId}/escanear`)}
          >
            Seguir escaneando
          </Button>
          
          <Button
            className="flex-1 h-12 text-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Agregar
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
