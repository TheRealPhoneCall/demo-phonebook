<template>
  <q-page class="flex" padding>
    <div class="row q-col-gutter-md">
      <q-card
        :class="`q-pa-none`"
        flat
      >
        <q-card-section
          v-if="contactsCount"
          class="q-pa-sm"
        >
          <div v-if="$q.screen.gt.xs" class="row">
            <div
              class="text-uppercase text-center text-weight-medium col"
              style="font-size: 1.8rem"

            >
              Contacts
            </div>
            <q-space />
          </div>

          <q-card-section class="q-pa-none">
            <!-- <q-scroll-area
              class="q-pa-none"
              style="height: 30rem; width: 30rem"
              :key="notifsUID"
              @scroll="onScroll"
            > -->
            <q-scroll-area
              class="q-pa-none"
              :style="`height: 75vh; width: '90hw';`"
            >
              <q-intersection
                v-for="contact in contacts"
                :key="contact.id"
                style="min-height: 2.5rem"
              >
                <q-item
                  clickable
                  :to="`/contact/${contact.id}/update`"
                  style="border-bottom: solid 1px #dbdbdb"
                  class="q-py-xs"
                >
                  <q-item-section>
                    <q-item-label>{{ `${contact.firstName} ${contact.lastName}` }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-intersection>

              <!-- <div v-if="notifsLoadingMore" class="flex flex-center">
                <q-spinner-dots size="2rem" color="grey-10" />
              </div> -->
            </q-scroll-area>
          </q-card-section>
          <q-space />

          <q-card-section class="q-py-sm text-center">
            <div class="text-grey-8 text-weight-medium">
              Showing {{ contactsCount }} contact{{ contactsCount > 1 ? 's' : '' }}
              <!-- <span
                v-if="!contactsEnd"
              >. Show more contacts .</span> -->
            </div>
          </q-card-section>

        </q-card-section>
        <div
          v-if="!contactsCount"
          class="row q-pa-none absolute-center"
          style="font-size: 2rem"
        >
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <div
            class="text-weight-bold text-center"
            style="min-height: 100vh"
          >Please add your first contact</div>
        </div>
      </q-card>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
        to="/contacts/create"
      >
        <!-- <q-fab-action to="/contacts/create" color="primary" icon="library_add" /> -->
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Contacts',
  data () {
    return {
      formShow: false
    }
  },
  computed: {
    ...mapGetters('contacts', ['loading', 'error', 'contacts', 'contactsCount'])
  },
  methods: {
    ...mapActions('contacts', ['retrieveAllContacts'])
  },
  created () {
    this.retrieveAllContacts()
  }
}
</script>

<style>
</style>
