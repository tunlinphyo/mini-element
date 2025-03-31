import { defineConfig } from 'vite'
import path from "path"

export default defineConfig({
    server: {
        host: true,
        historyApiFallback: true,
    },
    resolve: {
        alias: {
        //   "@": path.resolve(__dirname, "../"),
          "@mini-element": path.resolve(__dirname, "src/packages"),
        },
      },
})