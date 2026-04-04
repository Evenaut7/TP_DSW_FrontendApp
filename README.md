# Trabajo Practico Desarrollo de Software <p> - Aplicacion Frontend

## Profesores

- Meca, Adrian
- Tabacman, Ricardo

## Integrantes

- Joaquin Murua
- Valentino Laveggi
- Gabriel Romero (com 304)

# 🗺️ TP DSW - Frontend App

Repositorio frontend para el Trabajo Práctico de DSW. Esta aplicación web permite a los usuarios visualizar, explorar y conocer detalles sobre diferentes Puntos de Interés (PDI) a través de un mapa interactivo.

🔗 **Demo en vivo:** [tp-dsw-frontend-app.vercel.app](https://tp-dsw-frontend-app.vercel.app)

---

## ✨ Características Principales

* **Mapa Interactivo:** Visualización de Puntos de Interés geolocalizados utilizando MapLibre GL.
* **Información Detallada:** Popups informativos integrados en el mapa con imágenes, descripciones y enlaces a los detalles de cada PDI.
* **Diseño Responsivo:** Interfaz construida con Tailwind CSS, optimizada para funcionar tanto en dispositivos móviles como en escritorio.
* **Gestión de Estado y API:** Consumo de la API REST del backend mediante custom hooks (`useApiGet`).
* **Manejo de Errores:** Modales personalizados para feedback visual durante la carga o ante fallos de red.

## 🛠️ Tecnologías Utilizadas

* **[React 18](https://react.dev/)** - Biblioteca principal para la construcción de interfaces.
* **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para mayor seguridad y mantenibilidad del código.
* **[Vite](https://vitejs.dev/)** - Herramienta de empaquetado y servidor de desarrollo ultrarrápido.
* **[MapLibre GL JS](https://maplibre.org/)** - Renderizado de mapas vectoriales interactivos.
* **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first para estilos rápidos y a medida.

## 📦 Scripts Disponibles

* `npm run dev`: Inicia el servidor de desarrollo de Vite.
* `npm run build`: Compila la aplicación para producción (TypeScript + Vite).
* `npm run lint`: Ejecuta ESLint para analizar el código en busca de problemas.
* `npm run preview`: Previsualiza localmente el build generado para producción.

## 📁 Estructura del Proyecto

```text
src/
├── assets/         # Imágenes, iconos y otros archivos estáticos
├── components/     # Componentes reutilizables de React (Navbar, Modales, etc.)
├── pages/          # Vistas principales de la aplicación (MapPage, etc.)
├── utils/          # Utilidades, custom hooks (api.ts) y helpers
├── App.tsx         # Componente raíz y enrutamiento
├── main.tsx        # Punto de entrada de la aplicación
└── index.css       # Estilos globales (Tailwind imports)
```

*Proyecto desarrollado para la cátedra de DSW.*
