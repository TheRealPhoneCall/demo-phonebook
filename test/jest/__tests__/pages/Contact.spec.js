import { createLocalVue, shallowMount } from '@vue/test-utils'
import { mountFactory, qLayoutInjections } from '@quasar/quasar-app-extension-testing-unit-jest'
import Contact from 'src/pages/Contact.vue'
import routes from 'src/router/routes'
import * as All from 'quasar'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar } = All

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key]
  if (val && val.component && val.component.name != null) {
    object[key] = val
  }
  return object
}, {})

describe('Mount Contact Page', () => {
  const localVue = createLocalVue()
  localVue.use(Quasar, { components }) // , lang: langEn
  localVue.use(Vuex)
  localVue.use(VueRouter)

  let modules
  let store
  let router
  modules = {
    contacts: {
      namespaced: true,
      getters: {
        loading: () => false,
        error: () => null,
        contacts: () => [],
        contact: () => ({
          firstName: 'Daryl',
          lastName: 'Pongcol',
          phoneNumber: '+639171501005',
          isFavorite: false,
          created: new Date()
        })
      },
      actions: {
        createDoc: jest.fn(),
        retrieveDoc: jest.fn(),
        updateDoc: jest.fn(),
        deleteDoc: jest.fn(),
        retrieveAllContacts: jest.fn(),
        toggleContactFavorite: jest.fn()
      },
      mutations: {
        setDoc: jest.fn(),
        setLoading: jest.fn()
      }
    }
  }
  store = new Vuex.Store({
    modules, strict: true
  })
  router = new VueRouter({ routes })

  const factory = mountFactory(Contact, {
    mount: {
      localVue,
      store,
      router,
      provide: qLayoutInjections()
    }
  })

  // test cases
  it('mounts without errors', () => {
    const wrapper = factory()
    expect(wrapper).toBeTruthy()
  })

  it('name has to be Contact', () => {
    const wrapper = shallowMount(Contact, { localVue, store, router })
    expect(typeof wrapper.vm.$options.name).toBe('string')
    expect(wrapper.vm.$options.name).toBe('Contact')
  })

  it('check component data', () => {
    const wrapper = shallowMount(Contact, { localVue, store, router })
    expect(wrapper.vm.$data.acceptDelete).toBe(false)
    expect(wrapper.vm.$data.formError).toBe('')
  })

  it('check computed values', () => {
    const wrapper = shallowMount(Contact, { localVue, store, router })
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.error).toBe(null)
    expect(wrapper.vm.contacts).toEqual([])
  })
})
