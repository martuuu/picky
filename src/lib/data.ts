export interface Product {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  stock: number;
  zone?: string; // Store location, e.g. "Pasillo 4 - Estante 2"
  wholesalePrice?: number;
  wholesaleMinQuantity?: number;
  specs: {
    label: string;
    value: string;
  }[];
  variants?: {
    label: string;
    options: string[];
    type: "chip" | "color" | "list";
  }[];
  reviews?: {
    user: string;
    rating: number;
    comment: string;
  }[];
}

export const products: Product[] = [
  // === PINTURAS ===
  {
    id: "p-1",
    sku: "PIN-LAT-01",
    name: "Látex Interior Profesional 20L",
    brand: "Alba",
    category: "Pinturas",
    price: 45900,
    originalPrice: 52000,
    wholesalePrice: 38500,
    wholesaleMinQuantity: 10,
    zone: "Pasillo 3 - Estante A",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    description: "Pintura al látex de alta calidad para interiores. Excelente poder cubritivo y lavabilidad. Máxima resistencia a manchas y secado rápido. Ideal para renovar ambientes con un acabado mate perfecto.",
    stock: 42,
    variants: [
      { label: "Tamaño", type: "chip", options: ["4L", "10L", "20L"] },
      { label: "Color", type: "color", options: ["#FFFFFF", "#F5F5DC", "#E0E0E0", "#BDBDBD"] }
    ],
    specs: [
      { label: "Rendimiento", value: "12 m² por litro" },
      { label: "Acabado", value: "Mate" },
      { label: "Peso", value: "28 kg" },
      { label: "Marca", value: "Alba" }
    ],
    reviews: [
      { user: "Juan P.", rating: 5, comment: "Excelente cobertura, con dos manos quedó perfecto." },
      { user: "María G.", rating: 4, comment: "Muy buena relación precio-calidad." }
    ]
  },
  {
    id: "p-1b",
    sku: "PIN-EXT-01",
    name: "Pintura Exterior Revestimiento 20L",
    brand: "Sinteplast",
    category: "Pinturas",
    price: 58500,
    zone: "Pasillo 3 - Estante B",
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&q=80&w=800",
    description: "Revestimiento exterior de alta resistencia a la intemperie. Impermeabilizante con microfibras. Ideal para fachadas, muros y revoques exteriores.",
    stock: 28,
    wholesalePrice: 49000,
    wholesaleMinQuantity: 6,
    variants: [
      { label: "Acabado", type: "chip", options: ["Liso", "Texturado", "Granulado"] },
      { label: "Color", type: "color", options: ["#F5F5DC", "#D4C5A9", "#C5AE8A", "#6B5344"] }
    ],
    specs: [
      { label: "Rendimiento", value: "8 m² por litro" },
      { label: "Capas", value: "2 manos recomendadas" },
      { label: "Secado", value: "4 horas" },
      { label: "Marca", value: "Sinteplast" }
    ]
  },
  {
    id: "p-1c",
    sku: "PIN-ESMALTE-01",
    name: "Esmalte Sintético Brillante 4L",
    brand: "Tersuave",
    category: "Pinturas",
    price: 22900,
    originalPrice: 26000,
    zone: "Pasillo 3 - Estante C",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800",
    description: "Esmalte sintético de alta calidad para maderas y metales. Acabado brillante duradero. Resistente a la humedad y fácil limpieza.",
    stock: 55,
    specs: [
      { label: "Superficie", value: "Madera y Metal" },
      { label: "Acabado", value: "Brillante" },
      { label: "Secado", value: "8 horas" },
      { label: "Marca", value: "Tersuave" }
    ],
    variants: [
      { label: "Color", type: "color", options: ["#FFFFFF", "#000000", "#C0C0C0", "#8B4513"] }
    ]
  },

  // === HERRAMIENTAS ===
  {
    id: "p-2",
    sku: "HER-TAL-18V",
    name: "Taladro Percutor DeWalt 20V",
    brand: "DeWalt",
    category: "Herramientas",
    price: 185000,
    zone: "Pasillo 1 - Estante A",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
    description: "Taladro percutor ultra potente con motor Brushless. Ideal para perforar hormigón, metal y madera con precisión quirúrgica. Incluye control de torque electrónico y luz LED integrada.",
    stock: 15,
    wholesalePrice: 165000,
    wholesaleMinQuantity: 3,
    variants: [
      { label: "Versión", type: "chip", options: ["Solo Herramienta", "Set c/ 2 Baterías", "Combo Maletín"] }
    ],
    specs: [
      { label: "Voltaje", value: "20V Max" },
      { label: "Mandril", value: "13mm" },
      { label: "Velocidad", value: "0-2000 RPM" },
      { label: "Torque", value: "65 Nm" }
    ]
  },
  {
    id: "p-2b",
    sku: "HER-AMP-7.25",
    name: "Amoladora Angular 7\" 2200W",
    brand: "Bosch",
    category: "Herramientas",
    price: 98000,
    zone: "Pasillo 1 - Estante B",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
    description: "Amoladora de máxima potencia para trabajos pesados. Motor de 2200W con disco de 180mm. Protección electrónica contra sobrecargas.",
    stock: 12,
    specs: [
      { label: "Potencia", value: "2200 W" },
      { label: "Disco", value: "180 mm" },
      { label: "RPM", value: "8500" },
      { label: "Marca", value: "Bosch" }
    ]
  },
  {
    id: "p-2c",
    sku: "HER-SIE-SET",
    name: "Set Sierra Circular 7¼\" + Guía",
    brand: "Skil",
    category: "Herramientas",
    price: 76500,
    originalPrice: 89000,
    zone: "Pasillo 1 - Estante C",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800",
    description: "Sierra circular profesional con guía de corte y dos hojas incluidas. Ideal para cortes en madera, MDF y melamina. Bevel hasta 56°.",
    stock: 8,
    specs: [
      { label: "Potencia", value: "1800 W" },
      { label: "Disco", value: "7¼\"" },
      { label: "Profundidad corte", value: "62 mm" },
      { label: "Marca", value: "Skil" }
    ]
  },

  // === CONSTRUCCIÓN ===
  {
    id: "p-3",
    sku: "CON-CEM-50KG",
    name: "Cemento Portland Loma Negra 50kg",
    brand: "Loma Negra",
    category: "Construcción",
    price: 9500,
    zone: "Pasillo 12 - Sección Granel",
    image: "https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800",
    description: "Cemento de uso general de alta performance. Mayor durabilidad y resistencia inicial. Ideal para la elaboración de hormigones de todo tipo de estructuras y cimentaciones.",
    stock: 500,
    wholesalePrice: 8200,
    wholesaleMinQuantity: 20,
    specs: [
      { label: "Peso", value: "50 kg" },
      { label: "Marca", value: "Loma Negra" },
      { label: "Fraguado", value: "Normal" },
      { label: "Resistencia", value: "H-25" }
    ]
  },
  {
    id: "p-5",
    sku: "LAD-HUE-12",
    name: "Ladrillo Hueco 12x18x33",
    brand: "Cerámicas del Sur",
    category: "Construcción",
    price: 450,
    zone: "Exterior - Depósito Materiales",
    image: "https://images.unsplash.com/photo-1590074251206-aa431c9059cb?auto=format&fit=crop&q=80&w=800",
    description: "Ideal para cerramientos y muros no portantes. Alta resistencia y calidad. Cocción uniforme garantizada.",
    stock: 5000,
    wholesalePrice: 380,
    wholesaleMinQuantity: 500,
    specs: [
      { label: "Medidas", value: "12x18x33 cm" },
      { label: "Peso", value: "4.8 kg" },
      { label: "Marca", value: "Cerámicas del Sur" }
    ]
  },
  {
    id: "p-3b",
    sku: "CON-YES-30KG",
    name: "Yeso Proyectable Durlock 30kg",
    brand: "Durlock",
    category: "Construcción",
    price: 7800,
    zone: "Pasillo 11 - Estante A",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    description: "Yeso proyectable de alta resistencia para terminaciones perfectas. Fraguado controlado y excelente adherencia. Ideal para revoques gruesos e interiores.",
    stock: 120,
    specs: [
      { label: "Peso", value: "30 kg" },
      { label: "Rendimiento", value: "12 kg por m²" },
      { label: "Fraguado", value: "45 minutos" },
      { label: "Marca", value: "Durlock" }
    ]
  },

  // === GRIFERÍA & PLOMERÍA ===
  {
    id: "p-4",
    sku: "GRI-MON-COC",
    name: "Grifería Monocomando Cocina FV",
    brand: "FV",
    category: "Grifería",
    price: 89000,
    zone: "Pasillo 6 - Estante A",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    description: "Diseño moderno en cromo brillante. Cierre cerámico de alta precisión. Fácil limpieza y larga durabilidad.",
    stock: 8,
    variants: [
      { label: "Acabado", type: "chip", options: ["Cromo", "Negro Mate", "Acero Inoxidable"] }
    ],
    specs: [
      { label: "Material", value: "Latón cromado" },
      { label: "Garantía", value: "5 años" },
      { label: "Marca", value: "FV" }
    ]
  },
  {
    id: "p-6b",
    sku: "PLO-TUB-CPVC",
    name: "Tubo CPVC 3/4\" x 3m (x10 unidades)",
    brand: "Tigre",
    category: "Plomería",
    price: 12400,
    zone: "Pasillo 7 - Sección Tubos",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    description: "Tubo CPVC premium para instalaciones de agua caliente y fría. Alta resistencia a la temperatura y presión. Certificado IRAM.",
    stock: 80,
    wholesalePrice: 10500,
    wholesaleMinQuantity: 10,
    specs: [
      { label: "Diámetro", value: "3/4\" (19mm)" },
      { label: "Longitud", value: "3 metros" },
      { label: "Temperatura max", value: "90°C" },
      { label: "Marca", value: "Tigre" }
    ]
  },

  // === ELECTRICIDAD ===
  {
    id: "p-6",
    sku: "ELE-CAB-25",
    name: "Cable Unipolar 2.5mm 100m",
    brand: "Prysmian",
    category: "Electricidad",
    price: 32000,
    originalPrice: 38000,
    zone: "Pasillo 9 - Estante A",
    image: "https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=800",
    description: "Rollo de cable unipolar normalizado IRAM 2178. Ideal para instalaciones eléctricas domiciliarias e industriales.",
    stock: 20,
    variants: [
      { label: "Color", type: "chip", options: ["Celeste", "Marrón", "Verde/Amarillo", "Negro", "Blanco"] }
    ],
    specs: [
      { label: "Sección", value: "2.5 mm²" },
      { label: "Largo", value: "100 metros" },
      { label: "Tensión", value: "450/750V" },
      { label: "Marca", value: "Prysmian" }
    ]
  },
  {
    id: "p-6c",
    sku: "ELE-INT-DOBLE",
    name: "Interruptor Doble Cambre Dominó",
    brand: "Cambre",
    category: "Electricidad",
    price: 4800,
    zone: "Pasillo 9 - Estante C",
    image: "https://images.unsplash.com/photo-1578390432942-d323db577965?auto=format&fit=crop&q=80&w=800",
    description: "Interruptor doble línea Dominó. Fácil instalación y diseño moderno. Compatible con todos los marcos estándar Cambre.",
    stock: 200,
    specs: [
      { label: "Amperaje", value: "10A" },
      { label: "Tensión", value: "250V" },
      { label: "Marca", value: "Cambre" }
    ]
  },

  // === PISOS Y REVESTIMIENTOS ===
  {
    id: "p-7",
    sku: "PIV-CER-60X60",
    name: "Cerámico Exterior Antideslizante 60x60",
    brand: "San Lorenzo",
    category: "Pisos",
    price: 8900,
    zone: "Pasillo 5 - Sección Pisos",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01b0?auto=format&fit=crop&q=80&w=800",
    description: "Cerámico para exterior con alto coeficiente de rozamiento. Resistente a la helada y la humedad. Textura antideslizante certificada.",
    stock: 350,
    wholesalePrice: 7600,
    wholesaleMinQuantity: 20,
    specs: [
      { label: "Medidas", value: "60x60 cm" },
      { label: "Espesor", value: "9 mm" },
      { label: "Coef. rozamiento", value: "R11" },
      { label: "Marca", value: "San Lorenzo" }
    ]
  },
  {
    id: "p-7b",
    sku: "PIV-POR-60X60N",
    name: "Porcellanato Pulido Negro 60x60",
    brand: "Cortines",
    category: "Pisos",
    price: 18500,
    zone: "Pasillo 5 - Sección Pisos Premium",
    image: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab3?auto=format&fit=crop&q=80&w=800",
    description: "Porcellanato de alta resistencia al tránsito. Acabado pulido espejado, absorción de agua < 0.5%. Ideal para interiores modernos.",
    stock: 180,
    specs: [
      { label: "Medidas", value: "60x60 cm" },
      { label: "Espesor", value: "10 mm" },
      { label: "Resistencia", value: "PEI 4" },
      { label: "Marca", value: "Cortines" }
    ]
  },

  // === ADHESIVOS Y SELLADORES ===
  {
    id: "p-8",
    sku: "ADH-CEG-25KG",
    name: "Adhesivo Cementicio Klaukol Flexible 25kg",
    brand: "Klaukol",
    category: "Adhesivos",
    price: 5400,
    zone: "Pasillo 10 - Estante A",
    image: "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?auto=format&fit=crop&q=80&w=800",
    description: "Adhesivo cementicio flexible C2 para colocación de cerámicos y porcellanatos. Apto para ambientes húmedos y exteriores.",
    stock: 250,
    wholesalePrice: 4600,
    wholesaleMinQuantity: 10,
    specs: [
      { label: "Peso", value: "25 kg" },
      { label: "Tipo", value: "C2 Flexible" },
      { label: "Rendimiento", value: "4 kg/m²" },
      { label: "Marca", value: "Klaukol" }
    ]
  },
  {
    id: "p-8b",
    sku: "ADH-SIL-300ML",
    name: "Sellador Siliconado Transparente 300ml",
    brand: "Poxipol",
    category: "Adhesivos",
    price: 2900,
    zone: "Pasillo 10 - Estante B",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
    description: "Sellador siliconado neutro 100% resistente al agua. Adherencia superior en vidrio, cerámica, metal y plástico. Apto para exterior.",
    stock: 150,
    specs: [
      { label: "Contenido", value: "300 ml" },
      { label: "Secado", value: "24 horas" },
      { label: "Temperatura", value: "-40°C a +150°C" },
      { label: "Marca", value: "Poxipol" }
    ]
  },

  // === MADERAS ===
  {
    id: "p-9",
    sku: "MAD-MDF-183X244",
    name: "Placa MDF Crudo 18mm 183x244cm",
    brand: "Masisa",
    category: "Maderas",
    price: 34500,
    zone: "Depósito Maderas - Sección MDF",
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800",
    description: "Placa de fibra de densidad media de alta calidad. Superficie lisa uniforme, ideal para muebles, carpintería y cerramientos. Libre de formaldehído.",
    stock: 60,
    specs: [
      { label: "Medidas", value: "183 x 244 cm" },
      { label: "Espesor", value: "18 mm" },
      { label: "Peso", value: "48 kg" },
      { label: "Marca", value: "Masisa" }
    ]
  },
  {
    id: "p-9b",
    sku: "MAD-MEL-BLANCO",
    name: "Melamina Blanca 18mm 183x244cm",
    brand: "Arauco",
    category: "Maderas",
    price: 38900,
    zone: "Depósito Maderas - Sección Melaminas",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    description: "Tablero de melamina con acabado blanco brillante en ambas caras. Resistente a la humedad, rayones y altas temperaturas. Ideal para muebles de cocina y baño.",
    stock: 45,
    specs: [
      { label: "Medidas", value: "183 x 244 cm" },
      { label: "Espesor", value: "18 mm" },
      { label: "Color", value: "Blanco Brillante" },
      { label: "Marca", value: "Arauco" }
    ]
  }
];

export const categories = [
  "Todos",
  "Herramientas",
  "Construcción",
  "Pinturas",
  "Grifería",
  "Plomería",
  "Electricidad",
  "Pisos",
  "Adhesivos",
  "Maderas"
];

export const brands = [
  "Alba", "Sinteplast", "Tersuave",
  "DeWalt", "Bosch", "Skil",
  "Loma Negra", "Durlock", "Cerámicas del Sur",
  "FV", "Tigre", "Roca",
  "Prysmian", "Cambre",
  "San Lorenzo", "Cortines",
  "Klaukol", "Poxipol",
  "Masisa", "Arauco"
];
