import type {PluginOption, Plugin} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import setupIcons from './icons';
import setupAutoImport from './auto-import';
import setupVueComponents from './vue-components';

export default function setupVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
    const vitePlugins: (PluginOption | PluginOption[] | Plugin)[] = [vue(), vueJsx(), Unocss()];

    // unplugin-auto-import
    vitePlugins.push(setupAutoImport());

    // unplugin-vue-components
    vitePlugins.push(setupVueComponents());

    // unplugin-icons
    vitePlugins.push(setupIcons());

    return vitePlugins;
}
