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
import uuidv4 from 'uuid/v4'
import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'

import { setTimeout } from 'timers'

export default {
  name: 'Contact',
  data () {
    return {
      acceptDelete: false
    }
  },
  props: ['id', 'operation'],
  computed: {
    ...mapGetters('contacts', ['loading', 'error', 'contact']),
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
          title: value
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
    ...mapActions('contacts', ['createDoc', 'retrieveDoc', 'updateDoc', 'deleteDoc']),
    ...mapMutations('contacts', ['setDoc', 'setLoading']),
    async onSubmit () {
      console.log('Adding contact: ', this.title, this.desc, this.id)

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

        setTimeout(() => {
          this.$router.push('/contacts')
        }, 1000)
      }
    }
  },
  created () {
    console.log(this.$route.path, this.operation, this.id)

    switch (this.operation) {
      case 'create':
        console.log('create mode')
        this.setDoc({ id: uuidv4(), firstName: '', lastName: '', phoneNumber: '', isFavorite: false, created: new Date() })
        break
      case 'edit':
      case 'delete':
        console.log('edit/delete mode')
        this.retrieveDoc(this.id)
        break
    }
  }
}
</script>
