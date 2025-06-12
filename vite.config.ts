/// <reference types="vitest" />
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
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', "src/tests/**/*.tsx"],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/cypress/**',
          '**/.{idea,git,cache,output,temp}/**',
          '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
        ],
      },
    },
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
