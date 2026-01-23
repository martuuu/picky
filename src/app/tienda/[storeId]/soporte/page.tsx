'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, AlertCircle, CheckCircle2, Upload, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

type ProblemType = 'PRODUCTO_INCORRECTO' | 'FALTA_STOCK' | 'CANCELAR' | 'OTRO';

export default function SoportePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;

  const [problemType, setProblemType] = useState<ProblemType | ''>('');
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-cargar orden activa si existe
  useState(() => {
    const orders = JSON.parse(localStorage.getItem('picky_orders') || '[]');
    const activeOrders = orders.filter((o: { status: string }) => 
      o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
    );
    if (activeOrders.length > 0) {
      setOrderId(activeOrders[0].orderNumber);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemType) {
      toast.error('Seleccioná el tipo de problema');
      return;
    }

    if (!description.trim()) {
      toast.error('Describí tu problema');
      return;
    }

    if (!contactPhone.trim() && !contactEmail.trim()) {
      toast.error('Ingresá al menos un método de contacto');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar ticket
      const ticketNumber = `TICKET-${Date.now()}`;
      const ticket = {
        id: ticketNumber,
        storeId,
        problemType,
        orderId: orderId || 'Sin pedido asociado',
        description,
        contactPhone,
        contactEmail,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      };

      // Guardar en localStorage
      const tickets = JSON.parse(localStorage.getItem('picky_support_tickets') || '[]');
      tickets.push(ticket);
      localStorage.setItem('picky_support_tickets', JSON.stringify(tickets));

      // Success
      toast.success('Ticket creado exitosamente', {
        description: `Número de ticket: ${ticketNumber}`,
        duration: 5000,
      });

      // Vibration feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }

      // Redirect después de 2 segundos
      setTimeout(() => {
        router.push(`/tienda/${storeId}`);
      }, 2000);

    } catch {
      toast.error('Error al enviar solicitud', {
        description: 'Por favor, intentá nuevamente',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Centro de Ayuda</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24">
        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">¿Tenés algún problema con tu pedido?</p>
                <p className="text-blue-800">
                  Completá el formulario y nuestro equipo se contactará con vos lo antes posible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={problemType}
                onValueChange={(value) => setProblemType(value as ProblemType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná el tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCTO_INCORRECTO">
                    📦 Producto incorrecto o dañado
                  </SelectItem>
                  <SelectItem value="FALTA_STOCK">
                    ⚠️ Producto sin stock
                  </SelectItem>
                  <SelectItem value="CANCELAR">
                    ❌ Quiero cancelar mi pedido
                  </SelectItem>
                  <SelectItem value="OTRO">
                    💬 Otro problema
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Order ID */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Número de Pedido (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Ej: PK-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Si tenés un pedido asociado, ingresá el número aquí
              </p>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descripción del Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describí con detalle qué sucedió..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {description.length}/500 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Photo Upload (Simulated) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Hacé click para subir una foto
                </p>
                <p className="text-xs text-gray-500">
                  (Simulado - No disponible en prototipo)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="11 1234-5678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <p className="text-xs text-gray-500">
                Te contactaremos por estos medios para resolver tu consulta
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </form>

        {/* Contact Alternatives */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Otras formas de contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                WhatsApp: <a href="tel:+541112345678" className="text-blue-600 font-medium">+54 11 1234-5678</a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                Email: <a href="mailto:soporte@picky.app" className="text-blue-600 font-medium">soporte@picky.app</a>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
