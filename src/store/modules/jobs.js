// import db from '../../services/fbase'
import { loading } from '../helpers/loading'
import { fbaseColDocs } from '../helpers/fbaseColDocs'

export default {
  namespaced: true,
  state: {
    ...loading.state,
    ...fbaseColDocs.state
  },
  actions: {
    ...loading.actions, 
    ...fbaseColDocs.actions,
    initAndWatchJobs ({ commit, dispatch }) {
      commit('setColName', 'jobs')
      dispatch('initAndWatchCol')
    },
    retrieveAllJobs ({ commit, dispatch }) {
      commit('setColName', 'jobs')
      dispatch('retrieveAllDocs')
    }
  },
  mutations: {
    ...loading.mutations,
    ...fbaseColDocs.mutations
  },
  getters: {
    ...loading.getters,
    job (state) {
      return state.doc
    },
    jobs (state) {
      return state.docs
    }
  }
}
