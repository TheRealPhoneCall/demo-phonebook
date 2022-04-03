const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/favorites',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'favorites', component: () => import('pages/Contacts.vue') }
    ]
  },
  {
    path: '/contacts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Contacts.vue') },
      // for contact create
      { path: ':operation', props: true, component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/contact/:id/',
    name: 'contact',
    props: true,
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // for contact update and delete
      { path: ':operation', props: true, component: () => import('pages/Contact.vue') }
    ]
  },
  {
    path: '/recents',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'recent', component: () => import('pages/Contacts.vue') }
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
