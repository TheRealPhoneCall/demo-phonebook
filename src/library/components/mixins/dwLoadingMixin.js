import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'dwLoadingMixin',
  computed: {
    ...mapGetters('loading', ['loading'])
  },
  methods: {
    ...mapActions('loading', ['startLoading', 'setLoading', 'stopLoading']),
    notifyError (error) {
      this.$q.notify({ message: error })
    }
  },
  created () {
    this.$q.notify.setDefaults({
      color: 'negative',
      icon: 'report_problem',
      textColor: 'white',
      position: 'bottom-right',
      multiLine: true,
      timeout: 3000
    })
  }
}