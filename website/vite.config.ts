import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    build: { manifest: true },
    define: { 'import.meta.env.SEO_NOINDEX': JSON.stringify(env.VERCEL_ENV === 'preview' || env.SEO_NOINDEX === 'true') },
    server: { host: '127.0.0.1', port: 3001, strictPort: true },
  };
});
