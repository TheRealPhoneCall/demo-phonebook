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

        <div class="row q-pa-none">
          <div class="col text-center">
            <q-icon
              name="account_circle"
              size="5rem"
            />
            <div class="text-center text-bold text-h6">
              {{ firstName }} {{ lastName }}
            </div>
            <div
              v-if="operation === 'edit'"
              class="fit row wrap justify-between items-start items-center content-start q-px-md q-pt-md q-gutter-xs"
            >
              <q-btn
                outline color="secondary" rounded no-caps disable label="Message" size="md"
                class="col text-center" stack icon="chat_bubble"
              />
              <q-btn
                outline color="secondary" rounded no-caps disable label="Call" size="md"
                class="col text-center" stack icon="call"
              />
              <q-btn
                outline color="secondary" rounded no-caps disable label="Video" size="md"
                class="col text-center" stack icon="video_call" />
              <q-btn
                rounded color="secondary" no-caps size="md" class="col text-center" stack
                :label="isFavorite ?  'Unfavorite' : 'Favorite'"
                :icon="isFavorite ? 'favorite' : 'favorite_outline'"
                @click="toggleContactFavorite(contact)"
              />
            </div>
          </div>
        </div>

        <q-card-section>
          <q-input
            filled
            v-model="firstName"
            debounce="500"
            label="First name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type the first name']"
          />

          <q-input
            filled
            v-model="lastName"
            debounce="500"
            label="Last name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type the last name']"
          />

          <q-input
            filled
            v-model="phoneNumber"
            debounce="500"
            label="Phone number"
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type the phone number'

            ]"
          />
          <!-- val => checkIfExists(val) || 'Phone number already exists in your phonebook.' -->

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
          <div v-show="error || formError" class="text-bold text-negative">
            {{ error || formError }}
          </div>

        </q-card-section>
        <q-card-section>
          <div v-if="operation === 'delete'">
            <q-btn label="Delete" type="submit" color="negative" :loading="loading"/>
            <q-btn label="Cancel" color="primary" flat to="/contacts" />
          </div>
          <div v-else>
            <q-btn label="Save" type="submit" color="primary" :loading="loading"/>
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

import libphonenumber from 'google-libphonenumber'

import { setTimeout } from 'timers'

export default {
  name: 'Contact',
  data () {
    return {
      acceptDelete: false,
      formError: ''
    }
  },
  props: ['id', 'operation'],
  computed: {
    ...mapGetters('contacts', ['loading', 'error', 'contact', 'contacts']),
    operationText () {
      switch (this.operation) {
        case 'create':
          return 'Create'
        case 'edit':
          return 'Edit'
        case 'delete':
          return 'Delete'
        default:
          return 'Create'
      }
    },
    firstName: {
      get () { return this.contact.firstName },
      set (value) {
        this.setDoc({
          ...this.contact,
          firstName: value
        })
      }
    },
    lastName: {
      get () { return this.contact.lastName },
      set (value) {
        this.setDoc({
          ...this.contact,
          lastName: value
        })
      }
    },
    phoneNumber: {
      get () { return this.contact.phoneNumber },
      set (value) {
        this.setDoc({
          ...this.contact,
          phoneNumber: value
        })
      }
    },
    isFavorite: {
      get () { return this.contact.isFavorite },
      set (value) {
        this.setDoc({
          ...this.contact,
          isFavorite: value
        })
      }
    },
    created: {
      get () { return this.contact.created },
      set (value) {
        this.setDoc({
          ...this.contact,
          created: value
        })
      }
    }
  },
  methods: {
    ...mapActions('contacts', [
      'createDoc', 'retrieveDoc', 'updateDoc', 'deleteDoc', 'toggleContactFavorite', 'retrieveAllContacts'
    ]),
    ...mapMutations('contacts', ['setDoc', 'setLoading']),
    isNumberExists (phoneNumber) {
      return this.contacts.find(contact => contact.phoneNumber === phoneNumber)
    },
    isNumberFormatValid (phoneNumber) {
      const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
      try {
        const validity = phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber))
        console.log('phonenumber E.164 validity', validity)
        return validity
      } catch (err) {
        this.formError = err
      }
    },
    async onSubmit () {
      console.log(`Submitting contact: `, this.contact)

      // check if number already exists
      if (this.operation === 'create' && this.isNumberExists(this.phoneNumber)) {
        console.log('Number already exists, submit prevented.')
        this.formError = 'Number already exists in your phonebook. Must be unique.'
        return
      }

      // validate phone via E.164 format
      if (this.operation === 'create' && !this.isNumberFormatValid(this.phoneNumber)) {
        console.log('Not a valid phone number..')
        return
      }

      const payload = {
        id: this.id,
        data: {
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          isFavorite: this.isFavorite,
          created: this.created
        }
      }

      if (this.$refs.contactForm.validate()) {
        switch (this.operation) {
          case 'create':
            await this.createDoc(payload)
            break
          case 'edit':
            await this.updateDoc(payload)
            break
          case 'delete':
            await this.deleteDoc(this.id)
            break
        }

        await this.retrieveAllContacts()
        setTimeout(() => {
          this.$router.push('/contacts')
        }, 1000)
      }
    }
  },
  async created () {
    // console.log(this.$route.path, this.$route.name, this.operation, this.id)

    switch (this.operation) {
      case 'create':
        console.log('create mode')
        this.setDoc({ firstName: '', lastName: '', phoneNumber: '', isFavorite: false, created: new Date() })
        break
      case 'edit':
      case 'delete':
        console.log('edit/delete mode')
        await this.retrieveDoc(this.id)
        break
    }

    // console.log('@created contact =', this.contact)
  }
}
</script>
