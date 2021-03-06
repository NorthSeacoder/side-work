import {App} from 'vue';
import {Modal} from 'ant-design-vue';
import 'ant-design-vue/es/modal/style/css'; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
import SimpleModal from './simple-modal';
export default {
    install(app: App) {
        // antd-vue component
        [Modal].forEach((plugin) => app.use(plugin));

        // our component
        [SimpleModal].forEach((comp) => app.component(comp.name, comp));
    }
};
