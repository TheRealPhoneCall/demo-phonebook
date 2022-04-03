<template>
  <q-page padding>
    <q-form
      ref="contactForm"
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ operationText }} Contact</div>
          <q-space />
        </q-card-section>

        <div class="row q-pa-md">
          <div class="col text-center">
            <q-icon
              name="account_circle"
              size="4rem"
            />
            <div class="text-center text-caption text-bold">
              {{ firstName }} {{ lastName }}

            </div>
            <br />
            <div class="text-center text-caption text-bold">
              <q-rating
                size="1.5em"
                readonly
                :value="doc.rating || 0"
                icon="star_border"
                icon-selected="star"
                color="primary"
              />
            </div>
          </div>
        </div>

        <q-card-section>
          <q-input
            filled
            :value="firstName"
            debounce="500"
            label="First name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type the first name']"
          />

          <q-input
            filled
            :value="lastName"
            debounce="500"
            label="Last name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type the last name']"
          />

          <q-input
            filled
            :value="phoneNumber"
            debounce="500"
            label="Phone number"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || 'Please type the phone number']"
          />

          <div v-show="operation === 'delete'" >
            <div class="text-body1">
              Are you sure you want to delete this contact? You sure you won't miss them?
            </div>
            <q-checkbox
              v-model="acceptDelete"
              label="Accept delete"
              color="negative"
            />
          </div>

        </q-card-section>
        <q-card-section>
          <div v-if="operation === 'delete'">
            <q-btn label="Delete" type="submit" color="negative" :loading="loading"/>
            <q-btn label="Cancel" color="primary" flat to="/contacts" />
          </div>
          <div v-else>
            <q-btn label="Submit" type="submit" color="primary" :loading="loading"/>
            <q-btn label="Cancel" color="primary" flat to="/contacts" />
          </div>
        </q-card-section>
      </q-card>

    </q-form>
  </q-page>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'
import CrudBase from 'src/components/mixins/Crudbase'
import { mapGettersSetters } from 'src/libraries/helpers/helpers'
import { contactMeta } from 'src/services/data'

export default {
  name: 'ContactNew',
  mixins: { CrudBase },
  props: ['id', 'operation'],
  computed: {
    ...mapGetters('contacts', ['loading', 'error', 'contact']),
    ...mapGettersSetters({
      firstName: ['contacts/contact', 'contacts/setDoc'],
      lastName: ['contacts/contact', 'contacts/setDoc'],
      phoneNumber: ['contacts/contact', 'contacts/setDoc'],
      isFavorite: ['contacts/contact', 'contacts/setDoc']
    })
    // ...mapGettersSetters(
    //   contactMeta.getMapObject('contacts/contact', 'contacts/setDoc')
    // )
  },
  methods: {
    ...mapActions('contacts', ['createDoc', 'retrieveDoc', 'updateDoc', 'deleteDoc']),
    ...mapMutations('contacts', ['setDoc', 'setLoading']),
    async onSubmit () {
      console.log('Adding contact: ', this.title, this.desc, this.id)

      if (this.isFormValidated) {
        this.preSubmit()
        this.submitPayload({
          id: this.id,
          data: contactMeta.getDataPayload(this)
        })
      }
    }
  },
  async created () {
    console.log(this.$route.path, this.operation, this.id)

    // must be ran first - in order for fields to react properly
    await this.initFormData(contactMeta.getDefaults())

    console.log('@ page created: contact', this.contact)
  }
}
</script>
