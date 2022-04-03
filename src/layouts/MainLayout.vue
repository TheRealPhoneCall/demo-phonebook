<template>
  <q-layout view="lHh Lpr lFf">
    <rv-header />

    <q-page-container>
      <router-view />
    </q-page-container>

    <rv-footer />
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import RvFooter from 'src/layouts/RvFooter'
import RvHeader from 'src/layouts/RvHeader'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: this.$q.platform.is.desktop
    }
  },
  components: {
    RvFooter,
    RvHeader
  },
  methods: {
    openURL
  }
}
</script>
