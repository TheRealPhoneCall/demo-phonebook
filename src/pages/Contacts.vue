<template>
  <q-page class="flex" padding>
    <div class="row q-col-gutter-md">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="col-xs-12 col-sm-6 col-md-3"

      >
        <q-card dark bordered class="bg-grey-9 my-card">
          <q-card-section>
            <div class="text-h6">{{ contact.firstName }}</div>
            <div class="text-subtitle2">{{ contact.lastName }}</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            <q-btn
              icon="edit"
              color="primary"
              :to="`/contact/${contact.id}/edit`"
            />
            <q-btn
              icon="delete"
              color="negative"
              flat
              :to="`/contact/${contact.id}/delete`"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="accent"
      >
        <q-fab-action to="/contacts/create" color="primary" icon="library_add" />
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
    ...mapGetters('contacts', ['loading', 'error', 'contacts'])
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
