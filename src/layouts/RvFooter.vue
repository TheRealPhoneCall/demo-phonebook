<template>
  <q-footer
    elevated
    class="bg-grey-8 text-white"
  >
    <q-toolbar class="fit q-pa-none">
      <div class="fit row wrap justify-center">
        <transition-group
          :class="$q.screen.gt.xs ? 'col-9' : 'col-12'"
          leave-active-class="animated zoomOut"
          tag="div"
        >
          <q-tabs
            v-model="footerTab"
            key="tabs"
            dense
            class="fit row wrap justify-between items-start items-center content-start q-pa-none"
          >
            <q-tab
              v-for="tab in tabs"
              :key="`tab-${tab.name}`"
              no-caps
              class="col q-pt-xs"
              :name="tab.name"
              :label="tab.label"
              :tooltip="tab.tooltip"
              :icon="tab.icon"
              @click="setTab(tab.name)"
            />
          </q-tabs>
        </transition-group>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script>
export default {
  name: 'RvFooter',
  data () {
    return {
      footerTab: 'contacts',
      tabs: [
        { name: 'favorites', label: 'Favorites', tooltip: 'Favorites', icon: 'favorites' },
        { name: 'contacts', label: 'Contacts', tooltip: 'Contacts', icon: 'fas fa-users' },
        { name: 'recents', label: 'Recents', tooltip: 'Recents', icon: 'fas fa-clock' }
      ]
    }
  },
  computed: {

  },
  methods: {
    display (label) {
      return this.$q.screen.gt.xs ? label : ''
    },
    setTab (tab) {
      switch (tab) {
        case 'favorites':
          this.footerTab = 'favorites'
          this.$router.push('/favorites')
          break
        case 'contacts':
          this.footerTab = 'contacts'
          this.$router.push('/contacts')
          break
        case 'recents':
          this.footerTab = 'recents'
          this.$router.push('/recents')
          break
        default:
          this.footerTab = 'contacts'
          this.$router.push('/contacts')
          break
      }
    }
  }
}
</script>
