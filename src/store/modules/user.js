import { loading } from '../helpers/loading'
import { auth } from '../../services/fbase'

export default {
  namespaced: true,
  state: {
    ...loading.state,
    user: {},
    userSignedIn: false
  },
  actions: {
    ...loading.actions, 
    signUserIn ({ commit }, payload) {
      console.log('signing user in')
      commit('setLoading', true)
      commit('clearError')

      auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = auth.currentUser
          console.log('user is signed in', user)
          commit('setLoading', false)
          commit('setUser', user)
          commit('setUserSignedIn', true)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
          commit('setError', err)
          commit('setUserSignedIn', false)
        })
    },
    async signUserUp ({ commit, dispatch }, payload) {
      console.log('signing user up')
      commit('setLoading', true)
      commit('clearError')

      const { email, password, displayName, photoURL } = payload

      await auth.createUserWithEmailAndPassword(email, password)
        .then(async () => {
          const user = auth.currentUser
          console.log('user is signed in', user)
          commit('setUser', user)
          commit('setUserSignedIn', true)
          
          // update profile
          await dispatch('updateProfile', { displayName, photoURL })
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
          commit('setError', err)
          commit('setUserSignedIn', false)
        })
    },
    async updateProfile ({ commit, state }, payload) {
      const { displayName, photoURL } = payload

      await auth.currentUser.updateProfile({ displayName, photoURL })
        .then(() => {
          commit('setUser', { 
            ...state.user,
            displayName,
            photoURL 
          })
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
          commit('setError', err)
          commit('setUserSignedIn', false)
        })
    },
    signUserOut ({ commit }) {
      console.log('signing user out')
      commit('setLoading', true)
      commit('clearError')

      auth.signOut()
        .then(() => {
          console.log('user is signed out')
          commit('setLoading', false)
          commit('setUser', {})
          commit('setUserSignedIn', false)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
          commit('setError', err)
          commit('setUserSignedIn', false)
        })
    }
  },
  mutations: {
    ...loading.mutations,
    setUser (state, payload) {
      state.user = payload
    },
    setUserSignedIn (state, payload) {
      state.userSignedIn = payload
    }
  },
  getters: {
    ...loading.getters,
    user (state) {
      return state.user
    },
    userSignedIn (state) {
      return state.userSignedIn
    }
  }
}
