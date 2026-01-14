'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Palette,
  Bell,
  CreditCard,
  Shield,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConfiguracionPage() {
  const [storeName, setStoreName] = useState('Bazar Casa Bella');
  const [storeDescription, setStoreDescription] = useState('Todo para tu hogar desde 1995');
  const [storeAddress, setStoreAddress] = useState('Av. Corrientes 1234, CABA');
  const [storePhone, setStorePhone] = useState('+54 11 4567-8900');
  const [storeEmail, setStoreEmail] = useState('info@casabella.com.ar');
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');

  // Notifications
  const [notifNewOrder, setNotifNewOrder] = useState(true);
  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifOrderReady, setNotifOrderReady] = useState(false);

  const handleSaveGeneral = () => {
    toast.success('Configuración guardada correctamente');
  };

  const handleSaveNotifications = () => {
    toast.success('Preferencias de notificaciones actualizadas');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Personaliza tu tienda y preferencias</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Información de la Tienda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nombre de la Tienda</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nombre de tu tienda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Descripción</Label>
                <Textarea
                  id="store-description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Descripción breve de tu tienda"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="store-phone"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </Label>
                <Input
                  id="store-address"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveGeneral} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalización Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Color Principal</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-12"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Este color se usará en botones, links y elementos destacados
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Vista Previa</h4>
                <div className="space-y-3">
                  <Button style={{ backgroundColor: primaryColor }}>
                    Botón de Ejemplo
                  </Button>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-sm">Color seleccionado: {primaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveGeneral} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Nuevos Pedidos</h4>
                    <p className="text-sm text-gray-600">
                      Recibe notificaciones cuando llegue un nuevo pedido
                    </p>
                  </div>
                  <Switch
                    checked={notifNewOrder}
                    onCheckedChange={setNotifNewOrder}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Stock Bajo</h4>
                    <p className="text-sm text-gray-600">
                      Alerta cuando un producto tenga menos de 5 unidades
                    </p>
                  </div>
                  <Switch
                    checked={notifLowStock}
                    onCheckedChange={setNotifLowStock}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Pedidos Listos</h4>
                    <p className="text-sm text-gray-600">
                      Notificar cuando un pedido esté listo para retirar
                    </p>
                  </div>
                  <Switch
                    checked={notifOrderReady}
                    onCheckedChange={setNotifOrderReady}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSaveNotifications} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4" />
                  Guardar Preferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">MP</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">MercadoPago</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Acepta pagos con tarjetas de crédito y débito de forma segura
                    </p>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="mp-token">Access Token</Label>
                        <Input
                          id="mp-token"
                          type="password"
                          placeholder="APP_USR-..."
                          defaultValue="••••••••••••••••"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="mp-public">Public Key</Label>
                        <Input
                          id="mp-public"
                          type="password"
                          placeholder="APP_USR-..."
                          defaultValue="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cambiar Contraseña</h4>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Contraseña actual"
                    />
                    <Input
                      type="password"
                      placeholder="Nueva contraseña"
                    />
                    <Input
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Autenticación de Dos Factores</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                  <Button variant="outline">
                    Configurar 2FA
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 text-red-600">Zona de Peligro</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Esta acción es irreversible y eliminará todos los datos
                  </p>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
