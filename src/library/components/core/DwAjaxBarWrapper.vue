<template>
  <q-ajax-bar
    ref="qbar"
    position="top"
    color="white"
    size="5px"
    skip-hijack
  />
</template>

<script>
export default {
  name: 'DwAjaxBarWrapper',
  props: ['value'],
  data: () => ({
    increment: null,
    status: 'stopped'
  }),
  methods: {
    start () {
      this.$refs.qbar.start(0)
      this.status = 'started'
      if (this.increment) this.$refs.qbar.increment(this.increment)
    },
    stop () {
      this.$refs.qbar.stop()
      this.status = 'stopped'
      this.increment = null
    }
  },
  watch: {
    'value.percent': function (newVal, oldVal) {
      const inc = newVal - oldVal
      if (inc > 0) {
        if (this.status === 'stopped') this.increment = inc // cached if not yet started for some reason
        else this.$refs.qbar.increment(inc)
      }
    },
    'value.loading': function (loading) {
      if (loading) this.start()
      else this.stop()
    }
  }
}
</script>