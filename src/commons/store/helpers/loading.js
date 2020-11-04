import { errorNotif } from './utils'

// set error popup defaults
errorNotif.setDefaults()

export const loading = {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
      if (state.error) {
        errorNotif.notify(state.error)
      }
    },
    clearError (state) {
      state.error = null
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
