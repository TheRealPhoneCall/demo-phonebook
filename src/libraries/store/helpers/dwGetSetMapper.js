import store from '../../store'
import { copy } from 'src/store/helpers/utils'

// source: https://www.reddit.com/r/vuejs/comments/6sygx8/custom_vuex_mapper/?utm_source=share&utm_medium=web2x
export default function dwGetSetMapper (map) {
  return Object.keys(map).reduce((cp, key) => {
    const [getter, mutation] = map[key]
    let get = function () {
      try {
        return this.$store.getters[getter][key]
      }
      catch { return null }
    }
    let set = (!mutation) ? null : function (value) {
      this.$store.commit(mutation, {
        ...this.$store.getters[getter],
        [key]: value
      })
    }
    cp[key] = { get: get, set: set }
    return cp
  }, {})
}

// improved; using arrow functions
export const dwGetSetMapperV2 = (map) => {
  // cp - computed property
  return Object.keys(map).reduce((cp, key) => {
    const [getter, mutation] = map[key]
    const [rG, ...props] = getter.split('.')

    const get = () => {
      try {
        if (!props.length) return store().getters[rG][key]
        else return props.reduce((res, key) => res[key], store().getters[rG])[key]
      }
      catch { return null }
    }

    const set = (!mutation) ? null : (value) => {
      let res = copy(true, store().getters[rG]) // creates deep copy, use debounce for q-inputs for better performance
      const t = props.reduce((t, key) => t[key], res)
      t[key] = value
      store().commit(mutation, res)
    }
    cp[key] = { get: get, set: set }
    return cp
  }, {})
}