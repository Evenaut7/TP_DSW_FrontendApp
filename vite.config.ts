import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '');
  
  // Validar que las variables críticas estén configuradas
  if (!env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL no está configurado en .env');
  }
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/styles': path.resolve(__dirname, './src/styles'),
      },
    },
    // Exponer variables de entorno al cliente
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_APP_URL': JSON.stringify(env.VITE_APP_URL),
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.VITE_NODE_ENV),
      'import.meta.env.VITE_ENABLE_DEBUG': JSON.stringify(env.VITE_ENABLE_DEBUG),
    },
  };
})
