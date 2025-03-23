import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.jsx',
      jsxRuntime: 'automatic',
      fastRefresh: true
    }),
    tailwindcss(),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'home': ['./src/pages/HomePage.jsx'],
          'explore': ['./src/pages/ExplorePage.jsx'],
          'details': ['./src/pages/DetailsPage.jsx'],
          'search': ['./src/pages/SearchPage.jsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none';"
    },
  },
  preview: {
    port: 3000
  }
});
