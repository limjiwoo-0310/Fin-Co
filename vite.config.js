import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages: https://<user>.github.io/Fin-Co/
  base: '/Fin-Co/',
  plugins: [react()],
})
