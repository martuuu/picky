# 🎨 Picky Corralón - Branding Guide

## Nueva Identidad Visual

Este documento describe el sistema de diseño completo implementado para **Picky Corralón** con la nueva paleta de colores violeta/púrpura y efectos premium.

---

## 🎨 Paleta de Colores

### Colores Primarios (Violeta/Púrpura)
```css
--color-primary: #8b5cf6        /* Violeta principal */
--color-primary-dark: #7c3aed   /* Violeta oscuro */
--color-primary-light: #a78bfa  /* Violeta claro */
```

### Colores Secundarios (Rosa/Pink)
```css
--color-secondary: #ec4899       /* Rosa principal */
--color-secondary-dark: #db2777  /* Rosa oscuro */
--color-secondary-light: #f472b6 /* Rosa claro */
```

### Colores de Acento (Cyan)
```css
--color-accent: #06b6d4          /* Cyan principal */
--color-accent-dark: #0891b2     /* Cyan oscuro */
--color-accent-light: #22d3ee    /* Cyan claro */
```

### Fondos - Dark Theme (Preferido)
```css
--color-background-dark: #0f0a1f           /* Fondo principal oscuro */
--color-background-dark-elevated: #1a1229  /* Fondo elevado oscuro */
--color-background-dark-card: #251b3d      /* Fondo de tarjetas oscuro */
```

### Fondos - Light Theme
```css
--color-background-light: #faf8fc          /* Fondo principal claro */
--color-background-light-elevated: #ffffff /* Fondo elevado claro */
--color-background-light-card: #f5f3f7     /* Fondo de tarjetas claro */
```

---

## 🌈 Gradientes (2 Colores)

### Gradientes Disponibles
```css
/* Violeta → Violeta Oscuro */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)

/* Rosa → Rosa Oscuro */
--gradient-secondary: linear-gradient(135deg, #ec4899 0%, #db2777 100%)

/* Cyan → Cyan Oscuro */
--gradient-accent: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)

/* Violeta → Rosa (Principal) */
--gradient-purple-pink: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)

/* Violeta → Cyan */
--gradient-purple-cyan: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)

/* Rosa → Cyan */
--gradient-pink-cyan: linear-gradient(135deg, #ec4899 0%, #06b6d4 100%)
```

### Uso en Componentes
```tsx
// Botón con gradiente principal (violeta → rosa)
<Button variant="gradient-purple-pink">
  Texto del Botón
</Button>

// Botón con gradiente violeta → cyan
<Button variant="gradient-purple-cyan">
  Texto del Botón
</Button>

// Botón con gradiente rosa → cyan
<Button variant="gradient-pink-cyan">
  Texto del Botón
</Button>
```

---

## 🎯 Variantes de Botones

### Variantes Disponibles

#### 1. **default** - Violeta sólido
```tsx
<Button variant="default">Botón Default</Button>
```

#### 2. **gradient-purple-pink** - Gradiente Violeta → Rosa (Recomendado para CTAs)
```tsx
<Button variant="gradient-purple-pink">Comenzar a Comprar</Button>
```

#### 3. **gradient-purple-cyan** - Gradiente Violeta → Cyan
```tsx
<Button variant="gradient-purple-cyan">Acción Secundaria</Button>
```

#### 4. **gradient-pink-cyan** - Gradiente Rosa → Cyan
```tsx
<Button variant="gradient-pink-cyan">Acción Terciaria</Button>
```

#### 5. **secondary** - Rosa sólido
```tsx
<Button variant="secondary">Botón Secundario</Button>
```

#### 6. **accent** - Cyan sólido
```tsx
<Button variant="accent">Botón de Acento</Button>
```

#### 7. **outline** - Borde violeta, fondo transparente
```tsx
<Button variant="outline">Explorar Catálogo</Button>
```

#### 8. **ghost** - Sin fondo, hover violeta
```tsx
<Button variant="ghost">Botón Ghost</Button>
```

#### 9. **glass** - Efecto glassmorphism oscuro
```tsx
<Button variant="glass">Botón Glass</Button>
```

#### 10. **glass-light** - Efecto glassmorphism claro
```tsx
<Button variant="glass-light">Botón Glass Light</Button>
```

### Tamaños de Botones
```tsx
<Button size="sm">Pequeño</Button>
<Button size="default">Default</Button>
<Button size="lg">Grande</Button>
<Button size="xl">Extra Grande</Button>
<Button size="icon">Icono</Button>
<Button size="icon-sm">Icono Pequeño</Button>
<Button size="icon-lg">Icono Grande</Button>
```

---

## ✨ Efectos Visuales

### Texto con Gradiente
```tsx
{/* Gradiente violeta → rosa */}
<span className="gradient-text-primary">Texto con Gradiente</span>

{/* Gradiente violeta → cyan */}
<span className="gradient-text-accent">Texto con Gradiente Accent</span>
```

### Fondos con Gradiente
```tsx
<div className="bg-gradient-purple-pink">Fondo Violeta → Rosa</div>
<div className="bg-gradient-purple-cyan">Fondo Violeta → Cyan</div>
<div className="bg-gradient-pink-cyan">Fondo Rosa → Cyan</div>
```

### Efectos de Brillo (Glow)
```tsx
<div className="glow-primary">Brillo Violeta</div>
<div className="glow-secondary">Brillo Rosa</div>
<div className="glow-accent">Brillo Cyan</div>
```

### Glassmorphism
```tsx
{/* Modo oscuro */}
<div className="glass-dark">Contenido con Glass Effect Oscuro</div>

{/* Modo claro */}
<div className="glass-light">Contenido con Glass Effect Claro</div>
```

---

## 🎬 Animaciones

### Animaciones Disponibles
```css
/* Escaneo (línea que se mueve verticalmente) */
animate-scan

/* Brillo pulsante */
animate-glow

/* Flotación suave */
animate-float
```

### Uso en Componentes
```tsx
<div className="animate-float">Elemento Flotante</div>
<div className="animate-glow">Elemento con Brillo</div>
```

---

## 📐 Guías de Uso

### Jerarquía Visual

1. **CTAs Principales**: Usar `gradient-purple-pink` con `glow-primary`
   ```tsx
   <Button variant="gradient-purple-pink" className="glow-primary">
     Comenzar a Comprar
   </Button>
   ```

2. **CTAs Secundarios**: Usar `outline` o `secondary`
   ```tsx
   <Button variant="outline">Explorar Catálogo</Button>
   ```

3. **Acciones Terciarias**: Usar `ghost` o `link`
   ```tsx
   <Button variant="ghost">Ver más</Button>
   ```

### Badges y Etiquetas
```tsx
{/* Badge con gradiente */}
<span className="bg-gradient-purple-pink text-white px-3 py-1 rounded-full glow-primary">
  Oferta
</span>

{/* Badge de categoría */}
<span className="bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-lg">
  Categoría
</span>
```

### Precios y Valores Destacados
```tsx
{/* Precio con gradiente */}
<span className="gradient-text-primary font-black text-2xl">
  ${price.toLocaleString("es-AR")}
</span>
```

---

## 🌓 Dark Mode

El tema oscuro es el **preferido** para Picky Corralón. Los colores están optimizados para verse mejor en modo oscuro:

### Fondos Oscuros
- `bg-background-dark` - Fondo principal (#0f0a1f)
- `bg-background-dark-elevated` - Elementos elevados (#1a1229)
- `bg-background-dark-card` - Tarjetas (#251b3d)

### Efectos Ambientales
```tsx
{/* Orbes de fondo con efecto blur */}
<div className="fixed inset-0 pointer-events-none overflow-hidden">
  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
  <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-[100px] animate-float"></div>
</div>
```

---

## 📱 Componentes Actualizados

### Páginas Actualizadas
- ✅ `page.tsx` - Welcome/Home
- ✅ `scan/page.tsx` - Scanner
- ✅ `cart/page.tsx` - Carrito
- ✅ `store/[id]/page.tsx` - Catálogo

### Componentes Actualizados
- ✅ `Button.tsx` - Sistema de botones con gradientes
- ✅ `ProductCard.tsx` - Tarjetas de producto
- ✅ `BottomNav.tsx` - Navegación inferior
- ✅ `globals.css` - Sistema de diseño completo

---

## 🎨 Ejemplos de Uso

### Hero Section
```tsx
<div className="relative">
  {/* Efectos de fondo */}
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-float"></div>
  </div>
  
  {/* Logo con gradiente */}
  <div className="bg-gradient-purple-pink rounded-2xl glow-primary">
    <ScanBarcode size={32} />
  </div>
  
  {/* Título */}
  <h1>
    Corralón <span className="gradient-text-primary">Picky</span>
  </h1>
  
  {/* CTA */}
  <Button variant="gradient-purple-pink" size="lg" className="glow-primary">
    Comenzar a Comprar
  </Button>
</div>
```

### Product Card
```tsx
<div className="bg-white dark:bg-background-dark-card border border-slate-200 dark:border-primary/20 hover:glow-primary">
  {/* Badge de oferta */}
  <div className="bg-gradient-secondary glow-secondary">Oferta</div>
  
  {/* Categoría */}
  <span className="bg-primary/10 dark:bg-primary/20 gradient-text-primary">
    {category}
  </span>
  
  {/* Botón de agregar */}
  <Button variant="gradient-purple-pink" size="icon">
    <Plus />
  </Button>
</div>
```

---

## 🚀 Mejores Prácticas

1. **Usar gradientes con moderación**: Los gradientes son para CTAs principales y elementos destacados
2. **Combinar con glow effects**: Los botones con gradiente se ven mejor con `glow-primary`, `glow-secondary`, o `glow-accent`
3. **Mantener consistencia**: Usar `gradient-purple-pink` para todas las acciones principales
4. **Dark mode first**: Diseñar pensando primero en modo oscuro
5. **Efectos sutiles**: Los efectos de float y glow deben ser sutiles para no distraer

---

## 📝 Notas de Implementación

- Todos los colores están definidos en `globals.css` usando CSS variables
- Los gradientes usan `linear-gradient` con ángulo de 135deg
- Los efectos de glow usan `box-shadow` con colores semi-transparentes
- Las animaciones están optimizadas para rendimiento
- El sistema es completamente compatible con dark mode usando `dark:` prefixes

---

**Última actualización**: Febrero 2026
**Versión**: 2.0 - Rebranding Violeta/Púrpura
