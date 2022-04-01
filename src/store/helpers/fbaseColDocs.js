import db from '../../services/fbase'

export const fbaseColDocs = {
  state: {
    colName: '',
    col: null,
    docs: [],
    doc: {}
  },
  actions: {
    async initAndWatchCol ({ commit, state }) {
      console.log(`watch ${state.colName} collection changes`)
      commit('setDocs', [])

      db.collection(state.colName).onSnapshot(res => {
        commit('setLoading', true)
        const changes = res.docChanges()

        changes.forEach(change => {
          if (change.type === 'added') {
            commit('pushDoc', {
              ...change.doc.data(),
              id: change.doc.id
            })
          }
        })

        commit('setLoading', false)
      })
    },
    runRetreiveDocsSnapshot ({ commit }, payload) {
      const snapshot = payload

      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }

      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
        commit('pushDoc', {
          ...doc.data(),
          id: doc.id
        })
      })

      commit('setLoading', false)
    },
    async retrieveAllDocs ({ commit, dispatch, state }) {
      console.log(`retrieve ${state.colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      db.collection(state.colName).get()
        .then(snapshot => {
          dispatch('runRetreiveDocsSnapshot', snapshot)
        })
        .catch(err => {
          console.log(`error in documents retrieval: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async retrieveDocs ({ commit, dispatch, state }, payload) {
      console.log(`retrieve ${state.colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      const { ...filters } = payload

      db.collection(state.colName).where(...filters).get()
        .then(snapshot => {
          dispatch('runRetreiveDocsSnapshot', snapshot)
        })
        .catch(err => {
          console.log(`error in documents retrieval: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async createDoc ({ commit, state }, payload) {
      const { data } = payload
      console.log(`creating document`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(state.colName).add(data)
        .then(doc => {
          // commit('setDoc', doc.data())
          console.log(`${state.colName} document is created: ${state.doc}`)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in document creation: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async retrieveDoc ({ commit, state }, payload) {
      const id = payload
      console.log(`getting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(state.colName).doc(id).get()
        .then(doc => {
          if (doc.exists) {
            commit('setDoc', doc.data())
            console.log('document is retrieved:', state.doc)
          }
          else {
            console.log('document not found.')
          }

          commit('setLoading', false)
        })
        .catch((err) => {
          console.log(`error in ${state.colName} retrieving: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async updateDoc ({ commit, state }, payload) {
      const { id, data } = payload
      console.log(`setting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(state.colName).doc(id).set(data)
        .then(doc => {
          // commit('setDoc', doc.data())
          console.log(`${state.colName} document is updated: ${state.doc}`)

          commit('setLoading', false)
        })
        .catch(err => {
          console.log(`error in ${state.colName} setting: ${err}`)
          commit('setLoading', false)
          commit('setError', err)
        })
    },
    async deleteDoc ({ commit, state }, payload) {
      const id = payload
      console.log(`deleting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      db.collection(state.colName).doc(id).delete()
        .then(() => {
          console.log(`${state.colName} document is deleted: ${id}`)

          commit('setLoading', false)
        })
        .catch((err) => {
          console.log(`error in ${state.colName} fetching: ${err}`)
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
    setDoc (state, payload) {
      state.doc = payload
    },
    setColName (state, payload) {
      state.colName = payload
    }
  }
}
