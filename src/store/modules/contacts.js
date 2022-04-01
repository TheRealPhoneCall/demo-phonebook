// import db from '../../services/fbase'
import { loading } from '../helpers/loading'
import { localColDocs } from '../helpers/localColDocs'

export default {
  namespaced: true,
  state: {
    ...loading.state,
    ...localColDocs.state,
    naming: {
      colName: 'contacts',
      docName: 'contact'
    }
  },
  actions: {
    ...loading.actions,
    ...localColDocs.actions,
    initAndWatchContacts ({ commit, dispatch }) {
      commit('setColName', 'contacts')
      dispatch('initAndWatchCol')
    },
    retrieveAllContacts ({ commit, dispatch }) {
      commit('setColName', 'contacts')
      dispatch('retrieveAllDocs')
    }
  },
  mutations: {
    ...loading.mutations,
    ...localColDocs.mutations
  },
  getters: {
    ...loading.getters,
    contact (state) {
      return state.doc
    },
    contacts (state) {
      return state.docs
    }
  }
}
