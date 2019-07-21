import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import jobs from './modules/jobs'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      jobs
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV

    // turn to false for now to ignore vuex warnings
    strict: false
  })

  return Store
}
