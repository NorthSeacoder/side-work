import path from 'path';
import {defineConfig} from 'vite';

module.exports = defineConfig({
    base: './',
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'index',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: ['fs', 'path','child_process']
        }
    }
});
