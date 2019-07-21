<template>
  <q-page padding>
    <q-form
      ref="signupForm"
      @submit="onSubmit"
      class="q-gutter-md row justify-center"
    >
      <q-card style="width: 40%" class="fixed-center">
        <q-card-section>
          <div class="text-h6">Sign Up</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="firstName"
            label="First Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input your first name']"
          />

          <q-input
            filled
            v-model="lastName"
            label="Last Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input your last name']"
          />

          <q-input
            filled
            v-model="photoURL"
            label="Photo URL"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input your photo URL']"
          />

          <q-input
            filled
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input your email']"
          />

          <q-input v-model="password" filled type="password" label="Password">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input v-model="passwordConfirm" filled type="password" 
            label="Confirm Password"
            debounce="1000"
          >
            <template v-slot:append>
              <q-icon
                :name="isPasswordConfirmed ? 'done' : 'close'"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-checkbox 
            v-model="accept" 
            label="Do you accept our user agreement?" 
            color="primary"
          />

        </q-card-section>
        <q-card-section>
          <q-btn label="Sign Up" type="submit" color="primary" :loading="btnLoading"/>
          <q-btn label="Cancel" color="primary" flat to="/subjects" />
        </q-card-section>
      </q-card>
      
    </q-form>
  </q-page>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      photoURL: '',
      btnLoading: false,
      accept: false,
      isPwd: true
    }
  },
  computed: {
    ...mapGetters('user', ['loading', 'error', 'userSignedIn']),
    isPasswordConfirmed () {
      return this.password !== '' && this.password === this.passwordConfirm
    },
    displayName () {
      return `${this.firstName} ${this.lastName}`
    }
  },
  methods: {
    ...mapActions('user', ['signUserUp']),
    async onSubmit () {      
      if (this.$refs.signupForm.validate() && this.isPasswordConfirmed) {
        const { displayName, email, password, photoURL } = this

        try {
          await this.signUserUp({ displayName, email, password, photoURL })

          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }
        catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>
