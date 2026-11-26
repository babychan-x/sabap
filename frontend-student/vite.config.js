import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 学生用は 5173、管理者用は 5174（同時に動かせるように分けている）
    port: 5173,
    strictPort: true,
    // 画面から '/api/...' に送ったリクエストを、バックエンド（Spring Boot。8080番）に転送する。
    // こうすると、コードにバックエンドの場所（http://localhost:8080）を書かずに済む（管理者用と同じ設定）。
    proxy: { '/api': 'http://localhost:8080' },
  },
})
