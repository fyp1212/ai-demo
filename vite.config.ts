import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    UnoCSS(),
    VueRouter({
      dts: './src/types/vue-router.d.ts',
      routesFolder: 'src/views',
      extensions: ['.vue'],
      importMode: 'async',
    }),
    AutoImport({
      dts: './src/types/auto-import.d.ts',
      imports: ['vue', 'pinia', VueRouterAutoImports],
      dirs: ['./src/serve', './src/stores', ],
    }),
    Components({
      dts: './src/types/components.d.ts',
    }),
  ],
  resolve: {
		alias: [
			{
				find: '@',                                   // 别名
				replacement: resolve(__dirname, 'src'),      // 别名对应地址
			}
		]
	}
  // server: {
  //   proxy: {
  //     '/server-api': {
  //       target: 'http://120.25.217.15:8000',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})