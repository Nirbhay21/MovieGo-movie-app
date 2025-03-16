import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: '**/*.jsx',
    }),
    ...tailwind(),
  ]
})
