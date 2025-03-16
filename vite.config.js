import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  plugins: [
    react({
      include: "**/*.jsx",
    }),
    tailwindcss()
  ],
})
