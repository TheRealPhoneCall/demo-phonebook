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

    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="400"
      show-if-above
      content-class="bg-grey-3"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section>
              Account
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/page2">
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Messages
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="money" />
            </q-item-section>

            <q-item-section>
              Billing
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple to="/jobs">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section>
              Jobs
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <!-- <img src="~assets/daryl-avatar.png"> -->
            <img :src="user.photoURL">
          </q-avatar>
          <div class="text-weight-bold">{{ user.displayName }}</div>
          <div>{{ user.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapGetters('user', ['userSignedIn', 'user'])
  },
  methods: {
    ...mapActions('user', ['signUserOut']),
    openURL,
    signOutAndExit () {
      this.signUserOut()
      this.$router.push('/sign-in')
    }
  }
}
</script>
