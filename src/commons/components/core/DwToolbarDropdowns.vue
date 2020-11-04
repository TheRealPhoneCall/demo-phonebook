<template>
  <div>
    <div class="row gt-xs">
      <q-item
        v-if="['admin', 'adviser'].includes(userType)"
        class="text-white"
        :to="`/${userType}/accounting`"
      >
        <q-item-section side>
          <q-icon color="white" name="fas fa-coins" />
        </q-item-section>
        <q-item-section class="text-weight-bold">{{credits | formatMoney("AUD") }}</q-item-section>
      </q-item>

      <q-btn-dropdown flat dense>
        <template #label>
          <q-btn dense round flat icon="notifications">
            <q-badge v-show="unreadNotifsCount" color="red" floating>{{ unreadNotifsCount }}</q-badge>
          </q-btn>
        </template>
        <div style="height: 30rem; width: 30rem">
          <sm-toolbar-notifs />
        </div>
      </q-btn-dropdown>

      <q-btn-dropdown no-caps flat>
        <template #label>
          <!-- <q-avatar size="30px" :label="fullName">
          <img :src="userAvatar">
        </q-avatar>
          {{ fullName }}-->
          <!-- <q-chip
          color="primary"
          text-color="white"
          >-->
          <q-avatar size="30px">
            <q-img :src="userAvatar" :ratio="1" />
          </q-avatar>
          <!-- {{ fullName }}
          </q-chip>-->
        </template>

        <div class="row no-wrap q-pa-none" style="width: 30rem">
          <div class="column q-pa-md bg-grey-1 text-grey-10" style="width: 15rem">
            <div class="text-h6">Settings</div>
            <div class="row items-center">
              <div class="text-grey-9">Notification sound</div>
              <q-space />
              <q-toggle v-model="toggleSound" color="primary" />
            </div>
          </div>
          <div v-if="authedUser" class="col column items-center q-pa-md">
            <q-avatar size="7rem">
              <q-img :src="userAvatar" :ratio="1" />
            </q-avatar>

            <div class="text-subtitle1 q-mt-sm">{{ fullName }}</div>
            <div class="text-caption q-mb-sm">{{ authedUser.email }}</div>
            <q-list class="q-pa-non q-gutter-y-sm">
              <q-select
                v-if="userTypes.length > 1"
                v-model="asOptVal"
                label="Switch UserType"
                style="width: 12.5rem"
                :options="asOptions"
                :option-label="'label'"
                @input="v => { goToDashboard(v); settingsModal=false }"
                emit-value
                map-options
                filled
                dense
              />
              <q-btn
                color="primary"
                class="full-width"
                label="Logout"
                size="md"
                @click="signOutAndExit()"
                v-close-popup
              />
            </q-list>
          </div>
        </div>
      </q-btn-dropdown>
    </div>

    <div class="row fit lt-sm items-center justify-end">
      <!-- <q-btn
        v-if="['admin', 'adviser'].includes(userType)"
        :to="`/${userType}/accounting`"
        icon="fas fa-coins"
        flat
        round
      ></q-btn>-->
      <q-btn round flat icon="notifications" @click="notifModal=!notifModal">
        <q-badge v-show="unreadNotifsCount" color="red" floating>{{ unreadNotifsCount }}</q-badge>
        <q-dialog v-model="notifModal" maximized>
          <div style="max-width: 30rem; max-height: 30rem">
            <sm-toolbar-notifs />
          </div>
        </q-dialog>
      </q-btn>
      <q-btn round flat icon="fas fa-ellipsis-v" @click="settingsModal=!settingsModal">
        <q-dialog v-model="settingsModal">
          <q-card class="text-grey-10 full-width" style="max-width: 30rem; max-height: 30rem">
            <q-expansion-item v-if="authedUser" label="Account" default-opened>
              <div class="column items-center q-pa-md bg-grey-1 q-gutter-y-sm">
                <q-avatar size="7rem">
                  <q-img :src="userAvatar" :ratio="1" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-sm">{{ fullName }}</div>
                <div class="text-caption q-mb-sm q-mt-none">{{ authedUser.email }}</div>
                <q-select
                  v-if="userTypes.length > 1"
                  v-model="asOptVal"
                  label="Switch UserType"
                  style="width: 12.5rem"
                  :options="asOptions"
                  :option-label="'label'"
                  @input="v => { goToDashboard(v); settingsModal=false }"
                  emit-value
                  map-options
                  filled
                  dense
                />
                <q-btn
                  color="primary"
                  style="width: 12.5rem"
                  label="Logout"
                  size="md"
                  @click="signOutAndExit()"
                  rounded
                  v-close-popup
                />
              </div>
            </q-expansion-item>

            <q-expansion-item v-if="['admin', 'adviser'].includes(userType)" label="Credits">
              <div class="column items-center q-gutter-y-sm q-pa-md bg-grey-1 text-grey-7">
                <q-icon color="grey-7" size="2rem" name="fas fa-coins" />
                <div class="text-weight-bold">{{credits | formatMoney("AUD") }}</div>
                <q-btn
                  label="Manage"
                  class="q-px-sm"
                  color="primary"
                  style="width: 7rem"
                  size="sm"
                  :to="`/${userType}/accounting`"
                  rounded
                  no-caps
                  dense
                />
              </div>
            </q-expansion-item>

            <q-expansion-item label="Settings">
              <div class="row items-center q-px-md text-caption bg-grey-1">
                <div class="text-grey-9">Notification sound</div>
                <q-space />
                <q-toggle v-model="toggleSound" color="primary" />
              </div>
            </q-expansion-item>
          </q-card>
        </q-dialog>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'

import SmToolbarNotifs from './SmToolbarNotifs'

export default {
  name: 'DwToolbarDropdowns',
  components: { SmToolbarNotifs },
  data () {
    return {
      mobileData: true,
      bluetooth: false,
      asOptVal: 'admin',
      // asOptions: [
      //   { label: 'As Admin', userType: 'admin' },
      //   { label: 'As Adviser', userType: 'adviser' },
      //   { label: 'As Paraplanner', userType: 'paraplanner' },
      //   { label: 'As Broker', userType: 'broker' }
      // ],

      notifModal: false,
      settingsModal: false
    }
  },
  computed: {
    ...mapGetters(['debug', 'sound']),
    ...mapGetters('userAuth', [
      'userSignedIn',
      'userAvatar',
      'userType',
      'authedUser',
      'userTypes'
    ]),
    ...mapGetters('notifs', ['unreadNotifsCount']),
    ...mapGetters('accounting', ['credits', 'defPaymentMethod']),
    asOptions () {
      return this.userTypes.map(v => ({
        label: `As ${v[0].toUpperCase()}${v.slice(1)}`,
        value: v
      }))
    },
    fullName () {
      if (!this.authedUser) return ''

      const { first_name, last_name } = this.authedUser
      return `${first_name} ${last_name}`
    },
    toggleSound: {
      get () {
        return this.sound === 'on'
      },
      set (val) {
        this.setSound(val ? 'on' : 'off')
      }
    }
  },
  methods: {
    ...mapActions('userAuth', ['signUserOutDjango']),
    ...mapActions('accounting', ['init', 'makePayment']),
    ...mapActions('notifs', ['initNotifs']),
    ...mapMutations('userAuth', ['setUserType', 'setBypassUserType']),
    ...mapMutations(['setSound']),
    moment,
    goToDashboard (userType) {
      // this.setUserType(userType)
      // this.setBypassUserType(true)
      if (userType === 'broker') {
        this.$router.push(`/${userType}/debt-reviews`)
      } else {
        this.$router.push(`/${userType}/soas`)
      }
    },
    async signOutAndExit () {
      await this.signUserOutDjango().then(() => {
        // this.$router.push('https://qualityparaplanning.com.au')
        if (!process.env.DEV) {
          window.location.href = 'https://qualityparaplanning.com.au'
        } else window.location.href = '/'
      })
    }
  },
  async created () {
    if (['admin', 'adviser'].includes(this.userType)) {
      await this.init()
    }
    await this.initNotifs()
    this.asOptVal = this.userType
  }
}
</script>
