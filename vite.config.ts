import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import WebfontDownload from 'vite-plugin-webfont-dl'

export default defineConfig(({ command }) => ({
  // En dev : base '/' — en prod (build) : base GitHub Pages
  base: command === 'build' ? '/APP_SWEETMED/' : '/',
  plugins: [
    vue(),
    // Télécharge et auto-héberge les Google Fonts — zéro requête externe en prod
    WebfontDownload([
      'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap',
    ]),
    ViteImageOptimizer({
      webp: { quality: 75 },
      includePublic: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
