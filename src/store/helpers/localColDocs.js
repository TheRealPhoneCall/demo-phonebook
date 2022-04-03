import { db } from '../../services/local'

export const localColDocs = {
  state: {
    naming: {
      colName: '',
      docName: ''
    },
    col: null,
    docs: [],
    doc: {}
  },
  actions: {
    async retrieveAllDocs ({ commit, dispatch, state }) {
      const { colName } = state.naming
      console.log(`retrieve ${colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      await db.collection(colName).get()
        .then(docs => {
          commit('setDocs', docs)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in documents retrieval: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async retrieveDocs ({ commit, dispatch, state }, payload) {
      const { colName } = state.naming
      console.log(`retrieve ${colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      const { filters } = payload

      db.collection(colName).where(...filters).get()
        .then(docs => {
          commit('setDocs', docs)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in documents retrieval: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async checkIfExists ({ commit, dispatch, state }, payload) {
      const { colName } = state.naming
      console.log(`checking ${colName} if document exists`)
      commit('setLoading', true)

      const { filters } = payload
      let doc = {}
      await db.collection(colName).where(...filters).get()
        .then(docs => {
          doc = docs[0]
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in documents retrieval: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
      return doc !== null
    },
    async createDoc ({ commit, state }, payload) {
      const { colName } = state.naming
      const { data } = payload
      console.log(`creating document`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(colName).add(data)
        .then(doc => {
          commit('setDoc', doc)
          console.log(`${colName} document is created: ${state.doc}`)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in document creation: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async retrieveDoc ({ commit, state }, payload) {
      const { colName } = state.naming
      const id = payload
      console.log(`getting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(colName).doc(id).get()
        .then(doc => {
          if (doc) {
            commit('setDoc', doc)
            console.log('document is retrieved:', state.doc)
          }
          else {
            console.log('document not found.')
            commit('setError', 'Document not found.')
          }

          commit('setLoading', false)
        })
        .catch((err) => {
          console.log(`error in ${colName} retrieving: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async updateDoc ({ commit, state }, payload) {
      const { colName } = state.naming
      const { id, data } = payload
      console.log(`setting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(colName).doc(id).set(data)
        .then(doc => {
          commit('setDoc', doc)
          console.log(`${colName} document is updated: ${state.doc}`)

          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in ${colName} setting: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async deleteDoc ({ commit, state }, payload) {
      const { colName } = state.naming
      const id = payload
      console.log(`deleting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(colName).doc(id).delete()
        .then(() => {
          console.log(`${colName} document is deleted: ${id}`)
          commit('setLoading', false)
        })
        .catch((err) => {
          console.log(`error in ${colName} fetching: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    }
  },
  mutations: {
    pushDoc (state, payload) {
      state.docs.push(payload)
    },
    setDocs (state, payload) {
      state.docs = payload
    },
    sortDocs (state, payload) {
      const [field, order] = payload
      console.log(field, order)
      state.docs = state.docs.sort((a, b) => {
        if (order === 'ASC') {
          return a[field] - b[field]
        } else {
          return b[field] - a[field]
        }
      })
      console.log(state.docs)
    },
    setDoc (state, payload) {
      state.doc = payload
    },
    setDocField (state, payload) {
      state.doc = {
        ...state.doc,
        [payload.field]: payload.value
      }
    },
    setColName (state, payload) {
      state.colName = payload
    }
  }
}
