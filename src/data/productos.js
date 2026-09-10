/**
 * FERREWEB - Catálogo Oficial de Productos
 * Evidencia: GA7-220501096-AA4-EV03
 * 
 * Estructura de datos técnica para la tienda virtual de ferretería.
 * Cada producto contiene información completa de inventario, ficha técnica y precios en COP.
 */

export const productos = [
  {
    id: 1,
    nombre: "Taladro Inalámbrico 20V Profesional",
    categoria: "Herramientas",
    precio: 450000,
    precioAnterior: 499000,
    enOferta: true,
    descuento: 10,
    descripcion: "Taladro percutor inalámbrico con motor sin escobillas de alto torque. Diseñado para perforación en mampostería, madera y metal con control de torque de 24 posiciones.",
    caracteristicas: [
      "Voltaje: 20V Max de Ión de Litio",
      "Velocidad sin carga: 0-500 / 0-1750 RPM",
      "Torque máximo: 65 Nm",
      "Mandril metálico autoajustable de 1/2 pulgada (13 mm)",
      "Luz LED integrada para áreas de poca iluminación",
      "Incluye 2 baterías de 2.0Ah, cargador rápido y maletín de transporte"
    ],
    stock: 15,
    rating: 4.8,
    icono: "🔩",
    imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    tags: ["herramienta", "electrónica", "construcción", "taladro", "inalámbrico"]
  },
  {
    id: 2,
    nombre: "Martillo de Goma Antirrebote 1.5 KG",
    categoria: "Herramientas",
    precio: 45000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Martillo técnico con cabeza de uretano y balines de acero en el interior que disipan el rebote, protegiendo superficies delicadas y reduciendo la fatiga del operador.",
    caracteristicas: [
      "Peso de la cabeza: 1.5 Kilogramos (3.3 lbs)",
      "Mango ergonómico de fibra de vidrio texturizado",
      "Superficie que no genera chispas ni marca baldosas o metales",
      "Resistencia a químicos, aceites y disolventes",
      "Ideal para ensamble automotriz, mampostería y pisos cerámicos"
    ],
    stock: 45,
    rating: 4.5,
    icono: "🔨",
    imagen: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    tags: ["herramienta", "martillo", "construcción", "antirrebote"]
  },
  {
    id: 3,
    nombre: "Cemento Portland Tipo 1 50KG",
    categoria: "Materiales",
    precio: 32000,
    precioAnterior: 35000,
    enOferta: true,
    descuento: 8,
    descripcion: "Cemento gris estructural de alta resistencia inicial y fraguado óptimo. Cumple con la norma técnica NTC 121 y ASTM C1157 para obras civiles y estructurales.",
    caracteristicas: [
      "Presentación: Saco de 50 Kilogramos",
      "Tipo: Portland de uso general y estructural",
      "Resistencia a compresión: > 35 MPa a 28 días",
      "Excelente trabajabilidad y retención de agua",
      "Aplicación: Concretos, morteros, vigas, columnas y pavimentos"
    ],
    stock: 120,
    rating: 4.9,
    icono: "📦",
    imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["cemento", "material", "construcción", "obra", "portland"]
  },
  {
    id: 4,
    nombre: "Arena Gruesa Lavada 50KG",
    categoria: "Materiales",
    precio: 15000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Arena de río tamizada y lavada, libre de materia orgánica y arcillas. Granulometría uniforme para garantizar mezclas de concreto de máxima compacidad.",
    caracteristicas: [
      "Presentación: Bulto sellado de 50 Kilogramos",
      "Módulo de finura controlado (2.6 - 3.1)",
      "Lavada y descalcificada para prevenir eflorescencias",
      "Uso en mezclas de pega, pañete rústico y fundición de losas"
    ],
    stock: 200,
    rating: 4.6,
    icono: "⚒️",
    imagen: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    tags: ["arena", "material", "construcción", "agregados"]
  },
  {
    id: 5,
    nombre: "Tubería Sanitaria PVC 3/4 pulg x 6m",
    categoria: "Tuberías",
    precio: 18900,
    precioAnterior: 21000,
    enOferta: true,
    descuento: 10,
    descripcion: "Tubo de PVC de alta presión para redes de distribución de agua potable domiciliaria e industrial. Certificación NTC 382 y bajo coeficiente de rugosidad.",
    caracteristicas: [
      "Diámetro nominal: 3/4 de pulgada (26.6 mm)",
      "Longitud: Tramo de 6 metros lineales",
      "Presión nominal de trabajo: RDE 21 (200 PSI a 23°C)",
      "Unión por soldadura líquida solvente PVC",
      "Inmune a la corrosión galvánica y química"
    ],
    stock: 85,
    rating: 4.7,
    icono: "🔌",
    imagen: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
    tags: ["tubería", "plomería", "agua", "pvc", "redes"]
  },
  {
    id: 6,
    nombre: "Codos de Cobre 90° 1 pulgada",
    categoria: "Tuberías",
    precio: 12000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Accesorio de cobre puro desoxidado con fósforo (DHP) para uniones soldadas en líneas de agua caliente, vapor y gas.",
    caracteristicas: [
      "Ángulo de curvatura: 90 Grados",
      "Diámetro: 1 pulgada",
      "Material: Cobre electrolítico 99.9% puro",
      "Tolerancia dimensional estricta bajo norma ANSI/ASME B16.22",
      "Resistencia a presiones extremas y fluctuaciones térmicas"
    ],
    stock: 50,
    rating: 4.8,
    icono: "🔗",
    imagen: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    tags: ["codo", "cobre", "plomería", "accesorios", "gas"]
  },
  {
    id: 7,
    nombre: "Cable Eléctrico THHN/THWN-2 #12 AWG 100m",
    categoria: "Electricidad",
    precio: 189000,
    precioAnterior: 210000,
    enOferta: true,
    descuento: 10,
    descripcion: "Rollo de conductor de cobre suave electrolítico de 7 hilos con aislamiento termoplástico de PVC y cubierta protectora de Nylon transparente.",
    caracteristicas: [
      "Calibre: 12 AWG (3.31 mm²)",
      "Longitud del rollo: 100 Metros continuos",
      "Tensión máxima de operación: 600V",
      "Temperatura nominal: 90°C en seco y mojado",
      "Retardante a la llama y resistente a la humedad y aceites (RETIE)"
    ],
    stock: 30,
    rating: 4.9,
    icono: "⚡",
    imagen: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
    tags: ["cable", "eléctrico", "cobre", "instalaciones", "retie"]
  },
  {
    id: 8,
    nombre: "Interruptor Triple Conmutable 3 Vías",
    categoria: "Electricidad",
    precio: 35000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Módulo de tres interruptores tipo escalera para control de luminarias desde múltiples puntos. Fabricado en policarbonato autoextinguible.",
    caracteristicas: [
      "Capacidad: 10A / 127-250V AC",
      "Contactos de plata de alta conductividad",
      "Chasis metálico galvanizado de fácil fijación",
      "Acabado blanco satinado resistente a rayos UV",
      "Certificado de conformidad RETIE vigente"
    ],
    stock: 150,
    rating: 4.6,
    icono: "💡",
    imagen: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
    tags: ["interruptor", "eléctrico", "instalación", "iluminación"]
  },
  {
    id: 9,
    nombre: "Pintura Látex Tipo 1 Interior/Exterior Galón",
    categoria: "Pintura",
    precio: 58000,
    precioAnterior: 65000,
    enOferta: true,
    descuento: 11,
    descripcion: "Pintura base agua vinil acrílica de máxima lavabilidad, alto poder cubriente y acabado mate uniforme para muros y cielorrasos.",
    caracteristicas: [
      "Presentación: 1 Galón (3.785 Litros)",
      "Rendimiento: 35 - 40 m² por galón a dos manos",
      "Bajo VOC y bajo olor, ideal para interiores",
      "Resistencia a más de 1.000 ciclos de lavado",
      "Antihongos y antibacterial"
    ],
    stock: 75,
    rating: 4.7,
    icono: "🎨",
    imagen: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    tags: ["pintura", "interior", "latex", "galon", "acabados"]
  },
  {
    id: 10,
    nombre: "Rodillo Profesional Microfibra 9 pulgadas",
    categoria: "Pintura",
    precio: 18500,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Rodillo para aplicación uniforme de vinilos, esmaltes y acrílicos. Fibra de alta densidad sin desprendimiento de mota para acabados lisos.",
    caracteristicas: [
      "Longitud del rodillo: 9 pulgadas (22.8 cm)",
      "Espesor de pelo: 3/8 pulg (10 mm)",
      "Tubo interior de polipropileno resistente a disolventes",
      "Mango ergonómico con rosca para extensión telescópica",
      "Fácil de lavar y reutilizable"
    ],
    stock: 100,
    rating: 4.5,
    icono: "🖌️",
    imagen: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
    tags: ["rodillo", "pintura", "herramienta", "aplicador"]
  },
  {
    id: 11,
    nombre: "Casco de Seguridad Industrial Tipo 1 Clase E",
    categoria: "Seguridad",
    precio: 32000,
    precioAnterior: 38000,
    enOferta: true,
    descuento: 15,
    descripcion: "Casco dieléctrico de protección contra impactos verticales y descargas eléctricas hasta 20.000V. Suspensión tipo ratchet de 4 puntos.",
    caracteristicas: [
      "Norma: ANSI/ISEA Z89.1-2014 Tipo I Clase E y G",
      "Material: Polietileno de alta densidad (HDPE)",
      "Ajuste tipo perilla/ratchet de alta precisión",
      "Banda frontal acolchada antisudor reemplazable",
      "Ranuras laterales universales para acople de orejeras y visor"
    ],
    stock: 200,
    rating: 4.8,
    icono: "🛡️",
    imagen: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80",
    tags: ["casco", "seguridad", "protección", "epp", "dieléctrico"]
  },
  {
    id: 12,
    nombre: "Guantes de Vaqueta Reforzados para Trabajo",
    categoria: "Seguridad",
    precio: 14000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Guantes de cuero vacuno curtido al cromo con refuerzo en palma y costuras en hilo de alta resistencia para manipulación de cargas abrasivas.",
    caracteristicas: [
      "Talla: Estándar (9 - 10)",
      "Cuero flexible calibre 1.1 - 1.3 mm",
      "Refuerzo interior en palma y dedos para agarre seguro",
      "Puño corto ribeteado de fácil colocación",
      "Protección contra raspaduras, chispas leves y rozamiento"
    ],
    stock: 250,
    rating: 4.6,
    icono: "🧤",
    imagen: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=800&q=80",
    tags: ["guantes", "seguridad", "protección", "cuero", "vaqueta"]
  },
  {
    id: 13,
    nombre: "Escalera de Tijera Aluminio 6 Peldaños 150KG",
    categoria: "Herramientas",
    precio: 290000,
    precioAnterior: 320000,
    enOferta: true,
    descuento: 9,
    descripcion: "Escalera plegable de aluminio estructural ultraligero con bandeja portaherramientas integrada y zapatas antideslizantes de goma.",
    caracteristicas: [
      "Altura total: 1.80 metros (6 peldaños)",
      "Capacidad de carga máxima: 150 Kilogramos",
      "Peldaños acanalados de 3 pulgadas para máximo soporte",
      "Separadores metálicos de seguridad antiplegado involuntario",
      "Peso liviano de 6.2 kg para fácil transporte"
    ],
    stock: 20,
    rating: 4.9,
    icono: "🪜",
    imagen: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=800&q=80",
    tags: ["escalera", "aluminio", "herramienta", "altura", "trabajo"]
  },
  {
    id: 14,
    nombre: "Juego de Destornilladores Aislados 1000V 12 Pzas",
    categoria: "Herramientas",
    precio: 89000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Set profesional de destornilladores de precisión y fuerza con aislamiento VDE certificado a 1000 voltios. Puntas magnetizadas de acero Cr-V.",
    caracteristicas: [
      "Incluye: 5 planos, 5 Phillips (estrella) y 2 Pozidriv + probador de fase",
      "Varillas en acero cromo-vanadio templado",
      "Puntas imantadas fosfatadas anticorrosión",
      "Aislamiento bicomponente según norma IEC 60900",
      "Estuche organizador rígido"
    ],
    stock: 60,
    rating: 4.7,
    icono: "🔧",
    imagen: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80",
    tags: ["destornillador", "set", "herramienta", "vde", "electricista"]
  },
  {
    id: 15,
    nombre: "Llave Ajustable Inglesa Cromada 10 pulgadas",
    categoria: "Herramientas",
    precio: 36000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Llave de mordaza graduable forjada en acero al carbono con escala métrica grabada a láser y acabado en cromo brillante antioxidación.",
    caracteristicas: [
      "Apertura máxima de mordaza: 30 mm",
      "Longitud total: 10 pulgadas (250 mm)",
      "Moleteado sin holguras para ajuste suave y firme",
      "Mango con diseño ergonómico de perfil ancho",
      "Tratamiento térmico en quijadas para evitar deformación"
    ],
    stock: 80,
    rating: 4.6,
    icono: "⚙️",
    imagen: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    tags: ["llave", "ajustable", "herramienta", "plomería", "mordaza"]
  },
  {
    id: 16,
    nombre: "Ladrillo Estructural Portante 6 Huecos x Unidad",
    categoria: "Materiales",
    precio: 1800,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Ladrillo de arcilla cocida de alta densidad para muros portantes y mampostería confinada. Resistencia superior al fuego y aislamiento térmico.",
    caracteristicas: [
      "Dimensiones: 30 cm x 10 cm x 20 cm",
      "Peso por unidad: 4.2 Kilogramos",
      "Resistencia a compresión: > 100 kg/cm²",
      "Rendimiento: Aprox. 16 unidades por metro cuadrado",
      "Excelente adherencia al mortero de pega"
    ],
    stock: 500,
    rating: 4.8,
    icono: "🧱",
    imagen: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    tags: ["ladrillo", "material", "construcción", "mampostería", "arcilla"]
  },
  {
    id: 17,
    nombre: "Malla Electrosoldada de Refuerzo 10x10cm (2.4x6m)",
    categoria: "Materiales",
    precio: 145000,
    precioAnterior: 160000,
    enOferta: true,
    descuento: 9,
    descripcion: "Panel de malla de acero corrugado trefilado soldado en cuadrícula. Esencial para losas de piso, contrapisos, muros de contención y pavimentos.",
    caracteristicas: [
      "Dimensiones del panel: 2.40 m x 6.00 m (14.4 m²)",
      "Cuadrícula: 10 cm x 10 cm",
      "Calibre del alambre: Grafil de 4.0 mm de diámetro",
      "Límite de fluencia: 5000 kg/cm² (500 MPa)",
      "Cumplimiento con norma técnica NTC 2310"
    ],
    stock: 40,
    rating: 4.7,
    icono: "⬜",
    imagen: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    tags: ["malla", "refuerzo", "acero", "concreto", "losas"]
  },
  {
    id: 18,
    nombre: "Tubo de Acero Galvanizado Cédula 40 2 pulg x 6m",
    categoria: "Tuberías",
    precio: 128000,
    precioAnterior: null,
    enOferta: false,
    descuento: 0,
    descripcion: "Tubería estructural y de conducción recubierta en zinc por inmersión en caliente. Máxima protección contra intemperie y agentes corrosivos.",
    caracteristicas: [
      "Diámetro: 2 pulgadas (60.3 mm exterior)",
      "Espesor de pared: 3.91 mm (Cédula 40)",
      "Longitud: 6.00 metros",
      "Recubrimiento galvanizado mínimo 400 g/m²",
      "Apto para redes contra incendios, pasamanos y estructuras"
    ],
    stock: 35,
    rating: 4.9,
    icono: "🔫",
    imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    tags: ["tubo", "galvanizado", "tuberías", "acero", "estructural"]
  },
  {
    id: 19,
    nombre: "Panel Solar Monocristalino 150W 12V",
    categoria: "Electricidad",
    precio: 450000,
    precioAnterior: 490000,
    enOferta: true,
    descuento: 8,
    descripcion: "Módulo fotovoltaico de celdas monocristalinas de alta eficiencia para sistemas solares aislados, iluminación rural, bombeo de agua y respaldo.",
    caracteristicas: [
      "Potencia máxima (Pmax): 150 Watts",
      "Voltaje en circuito abierto (Voc): 22.4V",
      "Corriente de cortocircuito (Isc): 8.65A",
      "Marco de aluminio anodizado resistente a vientos fuertes",
      "Vidrio templado antirreflectivo de 3.2 mm y caja IP67 con diodos bypass"
    ],
    stock: 15,
    rating: 4.8,
    icono: "☀️",
    imagen: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    tags: ["panel", "solar", "energía", "fotovoltaico", "renovable"]
  },
  {
    id: 20,
    nombre: "Bombilla LED Industrial Alta Potencia 50W E27",
    categoria: "Electricidad",
    precio: 25000,
    precioAnterior: 29000,
    enOferta: true,
    descuento: 14,
    descripcion: "Lámpara LED tipo T-Bulb de gran luminosidad para bodegas, talleres, locales comerciales y áreas residenciales amplias. Luz blanca fría 6500K.",
    caracteristicas: [
      "Potencia de consumo: 50W (Equivale a 350W incandescente)",
      "Flujo luminoso: 4.500 Lúmenes reales",
      "Base de rosca estándar E27 con adaptador E40",
      "Vida útil estimada: 25.000 Horas de uso continuo",
      "Disipador térmico interno de aluminio y cuerpo en termoplástico"
    ],
    stock: 180,
    rating: 4.7,
    icono: "💡",
    imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80",
    tags: ["bombilla", "led", "ahorro", "iluminación", "industrial"]
  }
];

/**
 * Lista de categorías oficiales con descripción e icono
 */
export const categorias = [
  { id: "todas", nombre: "Todas", icono: "Grid" },
  { id: "Herramientas", nombre: "Herramientas", icono: "Wrench" },
  { id: "Materiales", nombre: "Materiales", icono: "Boxes" },
  { id: "Tuberías", nombre: "Tuberías", icono: "Pipette" },
  { id: "Electricidad", nombre: "Electricidad", icono: "Zap" },
  { id: "Pintura", nombre: "Pintura", icono: "Paintbrush" },
  { id: "Seguridad", nombre: "Seguridad", icono: "ShieldCheck" }
];

/**
 * Función utilitaria para formatear valores numéricos a Pesos Colombianos (COP)
 * @param {number} valor 
 * @returns {string} Ejemplo: "$ 450.000"
 */
export const formatearPrecioCOP = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
};
