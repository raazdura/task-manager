import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  }
  // preview: {
  //   port: 3000,
  //   strictPort: true,
  // },
  // server: {
  //   port: 3000,
  //   strictPort: true,
  //   host: true,
  //   origin: "https://0.0.0.0:3000",
  // },
})
