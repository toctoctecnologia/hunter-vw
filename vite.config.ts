import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
  plugins: [
    react(),
    tailwindcss(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.ts'),
      'next/image': path.resolve(__dirname, './src/shims/next-image.tsx'),
      'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
      'next/server': path.resolve(__dirname, './src/shims/next-server.ts'),
      'next/headers': path.resolve(__dirname, './src/shims/next-headers.ts'),
    },
  },
  server: {
    host: '::',
    port: 8080,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: isProduction ? false : true,
    manifest: true,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
  },
  };
});
