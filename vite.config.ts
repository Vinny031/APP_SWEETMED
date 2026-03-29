import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig(({ command }) => ({
  // En dev : base '/' — en prod (build) : base GitHub Pages
  base: command === 'build' ? '/APP_SWEETMED/' : '/',
  plugins: [
    vue(),
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
