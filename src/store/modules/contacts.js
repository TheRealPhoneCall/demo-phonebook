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
      dispatch('initAndWatchCol')
    },
    retrieveAllContacts ({ commit, dispatch }) {
      dispatch('retrieveAllDocs')
    },
    async retrieveFavorites ({ commit, dispatch }) {
      await dispatch('retrieveDocs', {
        filters: [
          ['isFavorite', '==', true]
        ]
      }).then(() => {

      })
    },
    async retrieveRecents ({ commit, dispatch }) {
      await dispatch('retrieveDocs').then(() => {
        commit('sortDocs', ['created', 'asc'])
      })
    },
    async toggleContactFavorite ({ commit, dispatch }, payload) {
      const contact = payload
      await dispatch('updateDoc', {
        id: contact.id,
        data: {
          ...contact,
          isFavorite: !contact.isFavorite
        }
      })
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
    },
    contactsCount (state) {
      return state.docs.length
    },

    sortedContacts: (state) => (sortArg) => {
      const [field, order] = sortArg
      return state.docs.sort((a, b) => {
        if (order === 'ASC') {
          return a[field] - b[field]
        } else {
          return b[field] - a[field]
        }
      })
    }
  }
}
