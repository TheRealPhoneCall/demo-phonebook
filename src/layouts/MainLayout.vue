<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="drawer = !drawer"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          myPhonebook
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <rv-footer />
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import RvFooter from 'src/layouts/RvFooter'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: this.$q.platform.is.desktop
    }
  },
  components: {
    RvFooter
  },
  methods: {
    openURL
  }
}
</script>
