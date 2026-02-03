export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  stock: number;
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
  {
    id: "p-1",
    sku: "PIN-LAT-01",
    name: "Látex Interior Profesional 20L",
    category: "Pinturas",
    price: 45900,
    originalPrice: 52000,
    wholesalePrice: 38500,
    wholesaleMinQuantity: 10,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    description: "Pintura al látex de alta calidad para interiores. Excelente poder cubritivo y lavabilidad. Máxima resistencia a manchas y secado rápido. Ideal para renovar ambientes con un acabado mate perfecto.",
    stock: 42,
    variants: [
      {
        label: "Tamaño",
        type: "chip",
        options: ["4L", "10L", "20L"]
      },
      {
        label: "Color",
        type: "color",
        options: ["#FFFFFF", "#F5F5DC", "#E0E0E0", "#BDBDBD"]
      }
    ],
    specs: [
      { label: "Rendimiento", value: "12 m2 por litro" },
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
    id: "p-2",
    sku: "HER-TAL-18V",
    name: "Taladro Percutor DeWalt 20V",
    category: "Herramientas",
    price: 185000,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
    description: "Taladro percutor ultra potente con motor Brushless. Ideal para perforar hormigón, metal y madera con precisión quirúrgica. Incluye control de torque electrónico y luz LED integrada.",
    stock: 15,
    wholesalePrice: 165000,
    wholesaleMinQuantity: 3,
    variants: [
      {
        label: "Versión",
        type: "chip",
        options: ["Solo Herramienta", "Set c/ 2 Baterías", "Combo Maletín"]
      }
    ],
    specs: [
      { label: "Voltaje", value: "20V Max" },
      { label: "Mandril", value: "13mm" },
      { label: "Velocidad", value: "0-2000 RPM" },
      { label: "Torque", value: "65 Nm" }
    ]
  },
  {
    id: "p-3",
    sku: "CON-CEM-50KG",
    name: "Cemento Portland Loma Negra 50kg",
    category: "Construcción",
    price: 9500,
    image: "https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800",
    description: "Cemento de uso general de alta performance. Mayor durabilidad y resistencia inicial. Ideal para la elaboración de hormigones de todo tipo de estructuras y cimentaciones.",
    stock: 500,
    specs: [
        { label: "Peso", value: "50kg" },
        { label: "Marca", value: "Loma Negra" },
        { label: "Fraguado", value: "Normal" }
    ]
  },
  {
    id: "p-4",
    sku: "GRI-MON-COC",
    name: "Grifería Monocomando Cocina FV",
    category: "Grifería",
    price: 89000,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    description: "Diseño moderno en cromo brillante. Cierre cerámico de alta precisión. Fácil limpieza y larga durabilidad.",
    stock: 8,
    variants: [
        {
            label: "Acabado",
            type: "chip",
            options: ["Cromo", "Negro Mate", "Acero Inoxidable"]
        }
    ],
    specs: [
        { label: "Material", value: "Metálico" },
        { label: "Garantía", value: "5 años" }
    ]
  },
  {
    id: "p-5",
    sku: "LAD-HUE-12",
    name: "Ladrillo Hueco 12x18x33",
    category: "Construcción",
    price: 450,
    image: "https://images.unsplash.com/photo-1590074251206-aa431c9059cb?auto=format&fit=crop&q=80&w=800",
    description: "Ideal para cerramientos y muros no portantes. Alta resistencia y calidad.",
    stock: 5000,
    specs: [
        { label: "Medidas", value: "12x18x33 cm" },
        { label: "Peso", value: "4.8 kg" }
    ]
  },
  {
    id: "p-6",
    sku: "ELE-CAB-25",
    name: "Cable Unipolar 2.5mm 100m",
    category: "Electricidad",
    price: 32000,
    originalPrice: 38000,
    image: "https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=800",
    description: "Rollo de cable unipolar normalizado. Ideal para instalaciones eléctricas domiciliarias.",
    stock: 20,
    variants: [
        {
            label: "Color",
            type: "chip",
            options: ["Celeste", "Marrón", "Verde/Amarillo"]
        }
    ],
    specs: [
        { label: "Sección", value: "2.5 mm2" },
        { label: "Largo", value: "100 metros" }
    ]
  }
];

export const categories = [
  "Todos",
  "Herramientas", 
  "Construcción", 
  "Pinturas", 
  "Grifería", 
  "Electricidad"
];
