import { rest } from '../helpers/rest'

export const graphql = {
  state: {
    colName: '',
    col: null,
    queryName: '',
    gqlQuery: '',
    mutationName: '',
    gqlMutation: '',
    gqlSubscription: '',
    docs: null,
    doc: null
  },
  actions: {
    ...rest.actions,
    makeGQLQuery ({ commit, state }, payload) {
      const { id, queryName, filterString } = payload
      console.log(filterString)

      let { gqlQuery } = payload
      commit('setGQLQuery', gqlQuery)

      if (id) {
        gqlQuery = gqlQuery.replace('[ID_HERE]', id)
      }

      if (queryName) {
        gqlQuery = gqlQuery.replace('[QUERY_NAME]', queryName)
      }

      if (filterString) {
        gqlQuery = gqlQuery.replace('[FILTER_STRING_HERE]', filterString)
      }

      // commit query
      commit('setGQLQuery', gqlQuery)
      console.log('gqlQuery:', state.gqlQuery)
    },
    makeGQLMutation ({ commit, state }, payload) {
      const { id, mutationName, filterString } = payload
      console.log(filterString)

      let { gqlMutation } = payload
      commit('setGQLMutation', gqlMutation)

      if (id) {
        gqlMutation = state.gqlMutation.replace('[ID_HERE]', id)
      }

      if (mutationName) {
        gqlMutation = state.gqlMutation.replace('[MUTATION_NAME]', mutationName)
      }

      if (filterString) {
        gqlMutation = state.gqlMutation.replace('[FILTER_STRING_HERE]', filterString)
      }

      // commit gqlMutation
      commit('setGQLMutation', gqlMutation)
    },
    async retrieveAllDocs ({ commit, dispatch, state, rootGetters }, payload) {
      console.log(`retrieve ${state.colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      const gqlQuery = payload
      commit('setGQLQuery', gqlQuery)

      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlQuery }
      }).then(data => {
        console.log('gql data:', data)
        const docs = data.data.data[state.queryName]
        commit('setDocs', docs)
        commit('setLoading', false)
      }).catch(error => {
        console.log('error!', error)
        commit('setLoading', false)
        commit('setError', error)
      })
    },
    async retrieveDocs ({ commit, dispatch, state, rootGetters }, payload) {
      console.log(`retrieve ${state.colName} collection documents`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDocs', [])

      // make query with filters, sorts and limit data
      dispatch('makeGQLQuery', payload)
      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlQuery }
      }).then(data => {
        console.log('gql data:', data)
        const docs = data.data.data[state.queryName]
        commit('setDocs', docs)
        commit('setLoading', false)
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error)
      })
    },
    async createDoc ({ commit, dispatch, state, rootGetters }, payload) {
      const { mutationName } = payload
      console.log(`creating document`)
      commit('setLoading', true)
      commit('clearError')

      // make mutation with filters, sorts and limit data
      commit('mutationName', mutationName)
      dispatch('makeGQLMutation', payload)
      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlMutation }
      }).then(data => {
        console.log('gql data:', data)
        const doc = data.data.data[state.mutationName]
        commit('setDoc', doc)
        commit('setLoading', false)
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error)
      })
    },
    async retrieveDoc ({ commit, state, dispatch, rootGetters }, payload) {
      const { id, queryName } = payload
      console.log(`getting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')
      commit('setDoc', {})

      commit('queryName', queryName)
      dispatch('makeGQLQuery', queryName)
      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlMutation }
      }).then(data => {
        console.log('gql data:', data)
        const doc = data.data.data[state.queryName]
        commit('setDoc', doc)
        commit('setLoading', false)
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error)
      })
    },
    async updateDoc ({ commit, state, dispatch, rootGetters }, payload) {
      const { id, mutationName } = payload
      console.log(`setting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      commit('queryName', mutationName)
      dispatch('makeGQLQuery', mutationName)
      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlMutation }
      }).then(data => {
        console.log('gql data:', data)
        const doc = data.data.data[state.mutationName]
        commit('setDoc', doc)
        commit('setLoading', false)
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error)
      })
    },
    async deleteDoc ({ commit, state, dispatch, rootGetters }, payload) {
      const { id, mutationName } = payload
      console.log(`deleting document with id ${id}`)
      commit('setLoading', true)
      commit('clearError')

      commit('queryName', mutationName)
      dispatch('makeGQLQuery', mutationName)
      await dispatch('postRequest', {
        url: rootGetters.gqlUrl,
        body: { query: state.gqlMutation }
      }).then(data => {
        console.log('gql data:', data)
        commit('setDoc', {})
        commit('setLoading', false)
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error)
      })
    }
  },
  mutations: {
    setDocs (state, payload) {
      state.docs = payload
    },
    setDoc (state, payload) {
      state.doc = payload
    },
    setColName (state, payload) {
      state.colName = payload
    },
    setQueryName (state, payload) {
      state.queryName = payload
    },
    setGQLQuery (state, payload) {
      state.gqlQuery = payload
    },
    setMutationName (state, payload) {
      state.mutationName = payload
    },
    setGQLMutation (state, payload) {
      state.gqlMutation = payload
    }
  }
}
