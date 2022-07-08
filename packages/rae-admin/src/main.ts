import {createApp} from 'vue';
import App from './App.vue';

import '@unocss/reset/tailwind.css';
import '~/common/styles/index.less';
import 'uno.css';

import {setupStore} from '~/common/stores';
import {setupRouter} from '~/common/router';
import {setupGlobDirectives} from '~/common/directives';

import comp from '~/common/components';

function setupApp() {
    const app = createApp(App);

    // Configure store
    setupStore(app);

    // Configure router
    setupRouter(app);

    // Configure directives
    setupGlobDirectives(app);

    app.use(comp).mount('#app');
}

setupApp();
