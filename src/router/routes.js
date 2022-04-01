
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Main.vue') }
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
    path: '/contacts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Contacts.vue') },
      { path: ':operation', props: true, component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/contact/:id/',
    name: 'contact',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':operation', props: true, component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/contacts-new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Contacts.vue') },
      { path: ':operation', props: true, component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/contact-new/:id/',
    name: 'contact-new',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':operation', props: true, component: () => import('pages/ContactNew.vue') }
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
