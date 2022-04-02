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

        <q-space />

        <!-- <q-btn
          flat
          dense
          v-if="userSignedIn"
          to="/sign-in"
          label="Sign In"
        /> -->

        <q-btn
          flat
          dense
          @click="signOutAndExit()"
          label="Sign Out"
        />

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>
