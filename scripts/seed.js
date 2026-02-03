const { Client } = require('pg');

async function seed() {
  const client = new Client({
    connectionString: "postgresql://postgres.qvbfzvjdpemzcmipvtsg:Olimpo.2013aA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Conectado a Supabase para seeding de Corralón...');

    const sql = `
-- Cleanup existing data
DELETE FROM "Product";
DELETE FROM "Category";

-- Seed Categories
INSERT INTO "Category" (id, name) VALUES 
('cat-1', 'Herramientas'),
('cat-2', 'Construcción'),
('cat-3', 'Pinturas'),
('cat-4', 'Grifería'),
('cat-5', 'Electricidad'),
('cat-6', 'Pisos y Revestimientos')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO "Product" (id, sku, name, description, price, "originalPrice", image, stock, "categoryId", "wholesalePrice", "wholesaleMinQuantity", variants, specs) VALUES 
(
    'p-1', 
    'PIN-LAT-01', 
    'Látex Interior Profesional 20L', 
    'Pintura al látex de alta calidad para interiores. Excelente poder cubritivo y lavabilidad. Máxima resistencia a manchas y secado rápido.', 
    45900, 
    52000, 
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800', 
    42, 
    'cat-3', 
    38500,
    10,
    '[
        {"label": "Tamaño", "type": "chip", "options": ["4L", "10L", "20L"]},
        {"label": "Color", "type": "color", "options": ["#FFFFFF", "#F5F5DC", "#E0E0E0", "#BDBDBD"]}
    ]'::jsonb,
    '[
        {"label": "Rendimiento", "value": "12 m2 por litro"},
        {"label": "Acabado", "value": "Mate"}
    ]'::jsonb
),
(
    'p-2', 
    'HER-TAL-18V', 
    'Taladro Percutor DeWalt 20V', 
    'Taladro percutor ultra potente con motor Brushless. Ideal para hormigón y metal. Incluye control de torque electrónico y luz LED integrada.', 
    185000, 
    NULL, 
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800', 
    15, 
    'cat-1', 
    165000,
    3,
    '[
        {"label": "Versión", "type": "chip", "options": ["Solo Herramienta", "Set c/ 2 Baterías", "Combo Maletín"]}
    ]'::jsonb,
    '[
        {"label": "Voltaje", "value": "20V Max"},
        {"label": "Mandril", "value": "13mm"}
    ]'::jsonb
),
(
    'p-3', 
    'CON-CEM-50KG', 
    'Cemento Portland Loma Negra 50kg', 
    'Cemento de uso general. Mayor durabilidad y resistencia inicial. Ideal para todo tipo de estructuras y cimentaciones.', 
    9500, 
    NULL, 
    'https://images.unsplash.com/photo-1518709779341-5d985063854b?auto=format&fit=crop&q=80&w=800', 
    500, 
    'cat-2', 
    8900,
    50,
    NULL,
    '[
        {"label": "Peso", "value": "50kg"},
        {"label": "Marca", "value": "Loma Negra"}
    ]'::jsonb
),
(
    'p-4', 
    'GRI-MON-COC', 
    'Grifería Monocomando Cocina FV', 
    'Diseño moderno en cromo brillante. Cierre cerámico de alta precisión. Fácil limpieza y larga durabilidad.', 
    89000, 
    NULL, 
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', 
    8, 
    'cat-4', 
    NULL,
    NULL,
    '[
        {"label": "Acabado", "type": "chip", "options": ["Cromo", "Negro Mate", "Acero Inoxidable"]}
    ]'::jsonb,
    '[
        {"label": "Material", "value": "Metálico"},
        {"label": "Garantía", "value": "5 años"}
    ]'::jsonb
),
(
    'p-5', 
    'LAD-HUE-12', 
    'Ladrillo Hueco 12x18x33', 
    'Ideal para cerramientos y muros no portantes. Alta resistencia y calidad.', 
    450, 
    NULL, 
    'https://images.unsplash.com/photo-1590074251206-aa431c9059cb?auto=format&fit=crop&q=80&w=800', 
    5000, 
    'cat-2', 
    390,
    1000,
    NULL,
    '[
        {"label": "Medidas", "value": "12x18x33 cm"},
        {"label": "Peso", "value": "4.8 kg"}
    ]'::jsonb
),
(
    'p-6', 
    'ELE-CAB-25', 
    'Cable Unipolar 2.5mm 100m', 
    'Rollo de cable unipolar normalizado. Ideal para instalaciones eléctricas domiciliarias.', 
    32000, 
    38000, 
    'https://images.unsplash.com/photo-1558210834-473f430c09ac?auto=format&fit=crop&q=80&w=800', 
    20, 
    'cat-5', 
    28500,
    5,
    '[
        {"label": "Color", "type": "chip", "options": ["Celeste", "Marrón", "Verde/Amarillo"]}
    ]'::jsonb,
    '[
        {"label": "Sección", "value": "2.5 mm2"},
        {"label": "Largo", "value": "100 metros"}
    ]'::jsonb
),
(
    'p-7', 
    'PIS-POR-60', 
    'Porcelanato 60x60 Pulido', 
    'Porcelanato de primera calidad, acabado pulido. Ideal para interiores de alto tránsito.', 
    18900, 
    NULL, 
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=800', 
    120, 
    'cat-6', 
    16500,
    20,
    NULL,
    '[
        {"label": "Medida", "value": "60x60 cm"},
        {"label": "Uso", "value": "Piso/Pared"}
    ]'::jsonb
);
    `;

    await client.query(sql);
    console.log('Database seeded successfully with Corralón data!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
