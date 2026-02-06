import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx',
      exclude: [
        /.*\.html$/, // 排除所有 .html 文件，让 Vite 直接服务它们
        /.*\.jpg$/,
        /.*\.png$/,
        /.*\.css$/,
        /.*\.js$/
      ]
    })
  ]
})
