import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative paths let the same build work on GitHub Pages project sites
// (username.github.io/repository-name/) and on a custom domain root.
export default defineConfig({
  base: './',
  plugins: [react()],
})
