import { createLocalVue, shallowMount } from '@vue/test-utils'
import { mountFactory, qLayoutInjections } from '@quasar/quasar-app-extension-testing-unit-jest'
import Contacts from 'src/pages/Contacts.vue'
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

describe('Mount Contacts Page', () => {
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
        contactsCount: () => 0
      },
      actions: {
        retrieveAllContacts: jest.fn(),
        retrieveFavorites: jest.fn(),
        toggleContactFavorite: jest.fn()
      }
    }
  }
  store = new Vuex.Store({
    modules, strict: true
  })
  router = new VueRouter({ routes })

  const factory = mountFactory(Contacts, {
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

  it('name has to be Contacts', () => {
    const wrapper = shallowMount(Contacts, { localVue, store, router })
    expect(typeof wrapper.vm.$options.name).toBe('string')
    expect(wrapper.vm.$options.name).toBe('Contacts')
  })

  it('check component data', () => {
    const wrapper = shallowMount(Contacts, { localVue, store, router })
    expect(wrapper.vm.$data.formShow).toBe(false)
    expect(wrapper.vm.$data.sortBy).toBe('latest')
    expect(wrapper.vm.$data.filteredSortedContacts).toEqual([])
    expect(wrapper.vm.$data.paginatedCount).toBe(0)
    expect(wrapper.vm.$data.countIncrements).toBe(10)
    expect(wrapper.vm.$data.contactsLoadingMore).toBe(false)
    expect(wrapper.vm.$data.searchString).toBe('')
  })

  it('check computed values', () => {
    const wrapper = shallowMount(Contacts, { localVue, store, router })
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.error).toBe(null)
    expect(wrapper.vm.contacts).toEqual([])
    expect(wrapper.vm.contactsCount).toBe(0)
  })
})
