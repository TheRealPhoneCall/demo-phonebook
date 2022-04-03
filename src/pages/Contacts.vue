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
        <!-- <q-scroll-area
          class="q-pa-none"
          style="height: 30rem; width: 30rem"
          :key="notifsUID"
          @scroll="onScroll"
        > -->
        <q-scroll-area
          class="col-12 q-pa-none"
          :style="`height: 65vh; width: '90hw';`"
        >
          <q-intersection
            v-for="contact in sortedContacts"
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
                clickable
                :to="`/contact/${contact.id}/edit`"
                style="border-bottom: solid 1px #dbdbdb"
                class="q-py-xs"
              >
                <q-item-section>
                  <q-item-label>{{ `${contact.firstName} ${contact.lastName}` }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    :icon="contact.isFavorite ? 'favorite' : 'favorite_outline'"
                    @click="toggleContactFavorite(contact)"
                  />
                </q-item-section>
              </q-item>
            </q-slide-item>
          </q-intersection>

          <!-- <div v-if="notifsLoadingMore" class="flex flex-center">
            <q-spinner-dots size="2rem" color="grey-10" />
          </div> -->
        </q-scroll-area>
      </q-card-section>

      <q-space />

      <q-card-section class="q-py-sm text-center col-12">
        <div class="text-grey-8 text-weight-medium">
          Showing {{ contactsCount }} contact{{ contactsCount > 1 ? 's' : '' }}
          <!-- <span
            v-if="!contactsEnd"
          >. Show more contacts .</span> -->
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RvEmptyState from 'src/components/misc/RvEmptyState'

export default {
  name: 'Contacts',
  data () {
    return {
      formShow: false,
      sortBy: ['name', 'ASC'],
      sortedContacts: []
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
    ...mapMutations('contacts', ['sortDocs']),
    sortContacts (sortBy) {
      this.sortedContacts = this.contacts.sort((a, b) => {
        switch (sortBy) {
          case 'name': return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
          case 'latest': return new Date(a.created) - new Date(b.created)
          case 'oldest': return new Date(b.created) - new Date(a.created)
          default: return Date(a.created) - new Date(b.created)
        }
      })
    }
  },
  watch: {
    sortBy: {
      handler (value) {
        this.sortContacts(value)
      },
      immediate: true
    }
  },
  async created () {
    switch (this.$route.name) {
      case 'favorites': await this.retrieveFavorites(); break
      case 'recents': {
        await this.retrieveAllContacts().then(() => {
          this.sortBy = ['created', 'ASC']
        })
        break
      }
      default: await this.retrieveAllContacts(); break
    }
  }
}
</script>
