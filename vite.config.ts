import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const updatedEnv = Object.fromEntries(
    Object.entries(loadEnv(mode, process.cwd())).map(([key, val]) => [
      key.replace(/^VITE_/, ""),
      val,
    ])
  );

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/lib": path.resolve(__dirname, "./src/lib"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    define: {
      'process.env': updatedEnv,
    },
  })
}
