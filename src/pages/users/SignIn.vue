<template>
  <q-page padding>
    <q-form
      ref="signinForm"
      @submit="onSubmit"
      class="q-gutter-md row justify-center"
    >
      <q-card style="width: 40%" class="fixed-center">
        <q-card-section>
          <div class="text-h6">Login</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input the email']"
          />

          <q-input v-model="password" filled type="password">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

        </q-card-section>
        <q-card-section>
          <q-btn label="Login" type="submit" color="primary" :loading="loading"/>
          <q-btn label="Sign Up" color="primary" flat to="/sign-up" />
        </q-card-section>
      </q-card>
      
    </q-form>
  </q-page>
</template>

<script>
import { 
  mapGetters, 
  mapActions
} from 'vuex'

export default {
  name: 'SignIn',
  data () {
    return {
      email: '',
      password: '',
      accept: false,
      isPwd: true
    }
  },
  computed: {
    ...mapGetters('user', ['loading', 'error', 'userSignedIn'])
  },
  methods: {
    ...mapActions('user', ['signUserIn']),
    async onSubmit () {      
      if (this.$refs.signinForm.validate()) {        
        console.log(`Signing user ${this.email}.`)

        try {
          await this.signUserIn({ email: this.email, password: this.password })

          console.log(`User signed in.`)

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

<style>
</style>
