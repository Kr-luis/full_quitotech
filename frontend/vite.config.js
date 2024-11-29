import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Usa el puerto especificado por Render o el 3000 como fallback
    host: true, // Escucha en todas las interfaces para ser accesible en Render
  },
});
