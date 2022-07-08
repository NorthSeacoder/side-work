import type { RouteRecordRaw } from 'vue-router'
import {
  AppstoreOutlined
} from '@ant-design/icons-vue'
import { DefaultLayout } from '~/common/layouts'

const route: RouteRecordRaw = {
  path: '/knowledge',
  name: '资料管理',
  component: DefaultLayout,
  redirect: '/knowledge/manage',
  meta: {
    title: 'Knowledge',
    icon: AppstoreOutlined,
    sort: 1
  },
  children: [
    {
      path: 'knowledge/manage',
      name: 'KnowledgeManage',
      component: () => import('~/views/knowledge/manage/index.vue'),
      meta: {
        title: '资料管理',
        sort: 1
      }
    }


  ]
}

export default route
