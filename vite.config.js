import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          comments: false,
        },
      },
    }),
    svgLoader(),
  ],
  server: {
    port: 8080,
    host: true,
  },
  build: {
    target: 'esnext',
    // sourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
