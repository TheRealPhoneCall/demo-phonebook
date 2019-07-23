
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Main.vue') }
    ]
  },
  {
    path: '/page2',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Page2.vue') }
    ]
  },
  {
    path: '/sign-in',
    component: () => import('layouts/SplashLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/SignIn.vue') }
    ]
  },
  {
    path: '/sign-up',
    component: () => import('layouts/SplashLayout.vue'),
    children: [
      { path: '', component: () => import('pages/users/SignUp.vue') }
    ]
  },
  {
    path: '/jobs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Jobs.vue') },
      { path: ':operation', props: true, component: () => import('pages/Job.vue') }
    ]
  },
  {
    path: '/job/:id/',
    name: 'job',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':operation', props: true, component: () => import('pages/Job.vue') }
    ]
  },
  // user centric operations
  {
    path: '/adviser/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Jobs.vue') },
      { path: ':operation', props: true, component: () => import('pages/Order.vue') }
    ]
  },
  {
    path: '/adviser/order/:id/',
    name: 'order',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':operation', props: true, component: () => import('pages/Order.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
