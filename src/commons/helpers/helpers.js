// source: https://www.reddit.com/r/vuejs/comments/6sygx8/custom_vuex_mapper/?utm_source=share&utm_medium=web2x

export function mapGettersSetters (map, direct) {
  return Object.keys(map).reduce((cp, key) => {
    const [getter, mutation] = map[key]
    let get = function () {
      const indirectGetter = this.$store.getters[getter][key] || null
      try { return direct ? this.$store.getters[getter] : indirectGetter }
      catch (e) {
        console.log('error in getter', e)
        return null
      }
    }
    let set = (!mutation) ? null : function (value) {
      this.$store.commit(mutation, direct ? value : {
        ...this.$store.getters[getter],
        [key]: value
      })
    }
    cp[key] = { get: get, set: set }
    return cp
  }, {})
}

// Source: https://github.com/vuejs/Discussion/issues/405#issuecomment-287371191
export function mapFilters (filters) {
  return filters.reduce((result, filter) => {
    result[filter] = function (...args) {
      return this.$options.filters[filter](...args)
    }
    return result
  }, {})
}

export function mapListConverters (listObject) {
  return Object.entries(listObject).reduce((converters, [key, value]) => {
    const { list, id, label, icon, caption } = value
    converters[key] = function () {
      console.log('list', list, this[list])
      return this[list].map(object => {
        let iconUrl = object[icon]
        if (icon === 'url') {
          iconUrl = object.photoMain.url
        }
        return {
          id: object[id],
          label: object[label],
          icon: icon ? iconUrl : null,
          caption: caption ? object[caption] : null
        }
      })
    }
    return converters
  }, {})
}
