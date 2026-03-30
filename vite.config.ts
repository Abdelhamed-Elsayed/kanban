import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Do NOT pre-bundle lucide-react so Rollup can tree-shake in build
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: { comments: false },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@dnd-kit'))         return 'vendor-dnd';
          if (id.includes('react-virtuoso'))   return 'vendor-virtuoso';
          if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router';
          if (id.includes('zustand'))          return 'vendor-store';
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'vendor-react';
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
