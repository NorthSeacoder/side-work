
import type { RouteRecordRaw } from 'vue-router'
import { EnumPath } from '~/common/enums'
import { BlankLayout } from '~/common/layouts'

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: EnumPath.HOME
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: BlankLayout,
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found-page',
        component: () => import('~/views/page/not-found/index.vue')
      }
    ]
  }
]
