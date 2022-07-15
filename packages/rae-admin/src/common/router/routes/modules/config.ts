import type { RouteRecordRaw } from 'vue-router'
import {
  AppstoreOutlined
} from '@ant-design/icons-vue'
import { DefaultLayout } from '~/common/layouts'

const route: RouteRecordRaw = {
  path: '/config',
  name: 'Config',
  component: DefaultLayout,
  redirect: '/config/common-config',
  meta: {
    title: '配置管理',
    icon: AppstoreOutlined,
    sort: 2
  },
  children: [
    {
      path: 'common-config',
      name: 'CommonConfig',
      component: () => import('~/views/config/common-config/index.vue'),
      meta: {
        title: '通用配置',
        sort: 1
      }
    }


  ]
}

export default route
