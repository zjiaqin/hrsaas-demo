import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail.vue'),
      meta: {
        title: '员工详情'
      },
      hidden: true
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true,
      mata: {
        title: '信息打印'
      }
    }
  ]
}
