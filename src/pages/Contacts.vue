<template>
  <q-page class="flex" padding>
    <q-card
      class="row full-width"
      flat
      v-if="contactsCount"
    >
      <q-card-section class="col-12 q-pa-sm">
        <div class="row">
          <div
            class="text-uppercase text-center text-weight-medium col"
            style="font-size: 1.3rem"

          >
            {{ $route.name }}
          </div>
          <q-space />

        </div>

      </q-card-section>
      <q-card-section class="col-12 q-pa-none">
        <q-input
          dense
          rounded
          outlined
          debounce="300"
          v-model="searchString"
          placeholder="Search name or phonenumber"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="col-12 q-pa-none">
        <q-scroll-area
          class="col-12 q-pa-none"
          :style="`height: 60vh; width: '90hw';`"
          ref="scrollArea"
          @scroll="onScroll"
        >
          <q-infinite-scroll @load="loadMoreContacts" :offset="50">
            <q-intersection
              v-for="contact in filteredSortedContacts.slice(0,
                contactsCount < countIncrements ? contactsCount : paginatedCount
              )"
              :key="contact.id"
              style="min-height: 2.5rem"
            >
              <q-slide-item left-color="warning">
                <template v-slot:right>
                  <q-btn
                    flat
                    label="Delete"
                    :to="`/contact/${contact.id}/delete`"
                  />
                </template>
                <q-item
                  style="border-bottom: solid 1px #dbdbdb"
                  class="q-py-xs"

                >
                  <q-item-section @click="$router.push(`/contact/${contact.id}/edit`)">
                    <q-item-label>{{ `${contact.firstName} ${contact.lastName}` }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      :icon="contact.isFavorite ? 'favorite' : 'favorite_outline'"
                      @click="toggleContactFavorite(contact); contact.isFavorite = !contact.isFavorite"
                    />
                  </q-item-section>
                </q-item>
              </q-slide-item>

            </q-intersection>
          </q-infinite-scroll>
        </q-scroll-area>
      </q-card-section>

      <q-space />

      <q-card-section class="q-py-sm text-center col-12">
        <div v-if="contactsLoadingMore" class="flex flex-center">
          <q-spinner-dots size="2rem" color="grey-10" />
        </div>
        <div class="text-grey-8 text-weight-medium">
          Showing {{ paginatedCount }} contact{{ paginatedCount > 1 ? 's' : '' }}
        </div>
        <q-btn-toggle
          v-model="sortBy"
          rounded
          no-caps
          outline
          unelevated
          color="white"
          text-color="secondary"
          toggle-color="secondary"
          class="items-center"
          :options="[
            { label: 'name', value: 'name' },
            { label: 'latest', value: 'latest' },
            { label: 'oldest', value: 'oldest' },
          ]"
        />
      </q-card-section>

    </q-card>
    <div v-else class="row absolute-center">
      <rv-empty-state
        class="q-pt-none"
        title="No contacts yet"
        message="Make friends. Then add their numbers."
        has-btn
        btn-label="Add Contact"
        @addRecord="$router.push('/contacts/create/')"
      />
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-dots size="150px" color="primary" />
    </q-inner-loading>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
        to="/contacts/create/"
      >
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RvEmptyState from 'src/components/misc/RvEmptyState'

export default {
  name: 'Contacts',
  data () {
    return {
      formShow: false,
      sortBy: 'latest',
      filteredSortedContacts: [],
      paginatedCount: 0,
      countIncrements: 10,
      contactsLoadingMore: false,
      searchString: ''
    }
  },
  components: { RvEmptyState },
  computed: {
    ...mapGetters('contacts', ['loading', 'error', 'contacts', 'contactsCount'])
  },
  methods: {
    ...mapActions('contacts', [
      'retrieveAllContacts', 'retrieveFavorites', 'toggleContactFavorite'
    ]),
    async onToggleContactFavorite () {
      await this.toggleContactFavorite()
      await this.initContacts()
    },
    async initContacts () {
      switch (this.$route.name) {
        case 'favorites': await this.retrieveFavorites(); break
        case 'recents': {
          await this.retrieveAllContacts().then(() => {
            this.sortBy = 'latest'
          })
          break
        }
        default: await this.retrieveAllContacts(); break
      }
      this.sortContacts(this.sortBy)
    },
    sortContacts (sortBy) {
      this.filteredSortedContacts = this.contacts.sort((a, b) => {
        switch (sortBy) {
          case 'name': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
          case 'latest': return new Date(b.created) - new Date(a.created)
          case 'oldest': return new Date(a.created) - new Date(b.created)
          default: return Date(a.created) - new Date(b.created)
        }
      })
    },
    filterContactsBySearch (searchString) {
      this.filteredSortedContacts = this.contacts.filter(contact => {
        return contact.firstName.toLowerCase().startsWith(searchString.toLowerCase()) ||
          contact.lastName.toLowerCase().startsWith(searchString.toLowerCase()) ||
          contact.phoneNumber.toLowerCase().startsWith(searchString.toLowerCase())
      })
    },
    onScroll ({ verticalPercentage }) {
      if (verticalPercentage >= 0.95 && this.paginatedCount < this.contactsCount) {
        this.contactsLoadingMore = true
        setTimeout(() => {
          console.log(verticalPercentage)
          this.loadMoreContacts()
          this.contactsLoadingMore = false
        }, 500)
      }
    },
    loadMoreContacts () {
      console.log('loading more contacts...')
      if (this.paginatedCount + this.countIncrements <= this.contactsCount) {
        this.paginatedCount += this.countIncrements
      } else {
        this.paginatedCount = this.contactsCount
      }
    }
  },
  watch: {
    sortBy: {
      handler (value) {
        this.sortContacts(value)
      }
      // immediate: true
    },
    searchString (value) {
      this.filterContactsBySearch(value)
    }
  },
  async created () {
    await this.initContacts()
  }
}
</script>
