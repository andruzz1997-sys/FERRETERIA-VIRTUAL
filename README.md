# 🔨 FERREWEB - Tienda Virtual de Ferretería

![React JS](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![SENA](https://img.shields.io/badge/SENA-Evidencia%20GA7--220501096--AA4--EV03-39A900?style=for-the-badge)

---

## 📌 Información del Proyecto

- **Programa:** Análisis y Desarrollo de Software (ADSO) - SENA
- **Evidencia:** `GA7-220501096-AA4-EV03` — Componente frontend del proyecto formativo y proyectos de clase.
- **Proyecto:** **FERREWEB** (Tienda Virtual para Ferreterías y Suministros Industriales).
- **Autor / Aprendiz:** Equipo Desarrollador FERREWEB

---

## 📖 Descripción

**FERREWEB** es una plataforma e-commerce moderna desarrollada con **React JS** y empaquetada con **Vite**, orientada a la comercialización de herramientas manuales, eléctricas, materiales de construcción, tuberías, electricidad, pintura y elementos de seguridad industrial.

La plataforma implementa una arquitectura modular de componentes reutilizables, navegación Single Page Application (SPA), catálogo dinámico con búsqueda en tiempo real, filtros por categoría, ordenamiento por precios en pesos colombianos (COP), ficha técnica detallada por producto y carrito de compras interactivo persistente.

---

## 🚀 Tecnologías Utilizadas

- **React JS (v18.3.1):** Biblioteca principal para la construcción de interfaces de usuario declarativas y reactivas.
- **Vite (v5.4.11):** Entorno de desarrollo rápido y empaquetador de módulos optimizado.
- **React Router DOM (v6.28.0):** Gestión del enrutamiento del lado del cliente (SPA).
- **Lucide React:** Iconografía técnica vectorial moderna y consistente.
- **CSS3 Moderno:** Variables CSS (Design Tokens), Flexbox, CSS Grid y diseño responsivo para móviles, tablets y escritorios.
- **JavaScript (ES6+):** Programación funcional, Hooks (`useState`, `useEffect`, `useMemo`, `useParams`, `useSearchParams`).

---

## 📁 Estructura del Proyecto

El código fuente sigue las mejores prácticas de organización y arquitectura en React:

```text
FERREWEB/
├── src/
│   ├── assets/
│   │   ├── images/              # Recursos gráficos y fotografías del proyecto
│   │   └── styles/
│   │       └── index.css        # Sistema de diseño, variables y estilos globales
│   ├── components/
│   │   ├── Navbar.jsx           # Barra de navegación interactiva y contador de carrito
│   │   ├── Footer.jsx           # Pie de página institucional y datos de contacto
│   │   └── ProductCard.jsx      # Tarjeta reutilizable de producto con precio COP
│   ├── pages/
│   │   ├── Home.jsx             # Página principal: Hero, categorías y destacados
│   │   ├── Catalogo.jsx         # Catálogo con búsqueda, filtros y ordenamiento
│   │   └── DetalleProducto.jsx  # Vista detallada: Ficha técnica y selección de cantidad
│   ├── data/
│   │   └── productos.js         # Catálogo estructurado en formato JavaScript (20 productos)
│   ├── App.jsx                  # Componente raíz con estado de carrito y enrutador
│   └── main.jsx                 # Punto de entrada de ReactDOM
├── index.html                   # Contenedor HTML principal
├── vite.config.js               # Configuración de Vite para React
├── package.json                 # Gestión de dependencias y scripts de ejecución
├── enlace_repositorio.txt       # Enlace al repositorio de GitHub
└── README.md                    # Documentación del proyecto
```

---

## 🛠️ Instalación y Requisitos

### Requisitos Previos:
- **Node.js:** Versión 16.0 o superior (Recomendado v18+ o v20+).
- **npm:** Versión 8.0 o superior.

### Pasos de Instalación:

1. **Clonar o ubicarse en el directorio del proyecto:**
   ```bash
   cd "PROYECTO FERREWEB"
   ```

2. **Instalar todas las dependencias del proyecto:**
   ```bash
   npm install
   ```

---

## 💻 Ejecución del Proyecto

### 1. Modo Desarrollo (Servidor Local):
Para iniciar el servidor de desarrollo en tiempo real con Vite:

```bash
npm run dev
```

El servidor estará disponible en la URL local (por defecto `http://localhost:5173` o el puerto asignado).

### 2. Modo Producción (Compilación):
Para generar la compilación optimizada para despliegue:

```bash
npm run build
```

Para previsualizar la compilación de producción:

```bash
npm run preview
```

---

## ✨ Funcionalidades Principales Desarrolladas

1. **Página Principal (Home):**
   - Presentación institucional de FERREWEB con Hero Banner dinámico.
   - Indicadores de confianza: Despacho 24-48h, Precios claros en COP, Envíos gratis desde $350.000.
   - Cuadrícula interactiva de categorías con acceso directo al catálogo.
   - Vitrina de ofertas destacadas y productos populares con componentes `ProductCard`.

2. **Catálogo de Productos:**
   - 20 productos técnicos con información completa.
   - Búsqueda en tiempo real por nombre, especificación técnica o etiquetas (*tags*).
   - Filtros de categorías (*Herramientas, Materiales, Tuberías, Electricidad, Pintura, Seguridad*).
   - Ordenamiento por precio (menor a mayor / mayor a menor) y calificación.
   - Contador de resultados reactivo y visualización de estado vacío amigable.

3. **Detalle del Producto:**
   - Enrutamiento dinámico mediante parámetros de URL (`/producto/:id`).
   - Galería de imágenes y badges de oferta/categoría.
   - Ficha técnica completa con especificaciones detalladas.
   - Control de cantidad con validación de stock disponible en inventario.
   - Botón de agregar al carrito con retroalimentación visual.
   - Sugerencias de productos relacionados de la misma categoría.

4. **Carrito de Compras Persistente:**
   - Panel lateral desplegable (*Drawer*) accesible desde cualquier vista.
   - Persistencia de datos en `localStorage`.
   - Calculadora de envío gratis con barra de progreso dinámica.
   - Modificación de cantidades y eliminación individual de ítems.

---

## 👨‍💻 Autor

- **Proyecto:** FERREWEB - Componente Frontend
- **Evidencia SENA:** GA7-220501096-AA4-EV03
- **Centro de Formación:** SENA - ADSO
