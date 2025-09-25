
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const allowed_host_str = env.VITE_HOSTS_ALLOWED 

  return {
    plugins: [react()],
    build: {
      outDir: '../dist'
    },
    server: {
      host: env.VITE_ADDRESS,
      port: env.VITE_PORT,
      allowedHosts: allowed_host_str.split(',').map(host => host.trim()).filter(host => host)
    }
  }
})
