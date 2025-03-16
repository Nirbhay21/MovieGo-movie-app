import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: ['src/**/*.jsx', 'src/**/*.tsx'],
    }),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  }
})
