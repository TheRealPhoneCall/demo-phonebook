<template>
  <q-page padding class="row">
    <!-- content -->
    <q-form
      ref="orderForm"
      @submit="onSubmit"
      class="q-gutter-md col-md-10"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ operationText }} Order</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            :value="clientName"
            debounce="500"
            label="Client Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input the client name']"
          />

          <q-input
            filled
            :value="partnerName"
            debounce="500"
            label="Partner Name"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || 'Please type the partner name or input None.']"
          />
          
          <!-- TODO: Add more OA form components here -->

          <div v-show="operation === 'delete'" >
            <div class="text-body1">
              Are you sure you want to delete this job? This operation is irreversible! 
              Deleting a job will not remove the documents or collections for this job. 
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
            <q-btn label="Cancel" color="primary" flat to="/jobs" />
          </div>
          <div v-else>
            <q-btn label="Submit" type="submit" color="primary" :loading="loading"/>
            <q-btn label="Cancel" color="primary" flat to="/jobs" />
          </div>
        </q-card-section>
      </q-card>
      
    </q-form>
    <div class="col-md-2">
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>SoA Details</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Risk Profile</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Scope of Advice</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Strategies</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'

import { setTimeout } from 'timers'

export default {
  name: 'OrderForm',
  data () {
    return {
      acceptDelete: false
    }
  },
  props: ['id', 'operation'],
  computed: {
    ...mapGetters('jobs', ['loading', 'error', 'job']),
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
    clientName: {
      get () { return this.job.clientName },
      set (value) {
        this.setDoc({
          ...this.job,
          clientName: value
        })
      }
    },
    partnerName: {
      get () { return this.job.partnerName },
      set (value) {
        this.setDoc({
          ...this.job,
          partnerName: value
        })
      }
    }
  },
  methods: {
    ...mapActions('jobs', ['createDoc', 'retrieveDoc', 'updateDoc', 'deleteDoc']),
    ...mapMutations('jobs', ['setDoc', 'setLoading']),
    async onSubmit () {
      console.log('Adding job: ', this.clientName, this.partnerName, this.id)

      const jobPayload = { 
        id: this.id,
        data: {
          clientName: this.clientName,
          partnerName: this.partnerName
        }
      }
      
      if (this.$refs.orderForm.validate()) {
        switch (this.operation) {
          case 'create':
            await this.createDoc(jobPayload)
            break
          case 'edit':
            await this.updateDoc(jobPayload)
            break
          case 'delete':
            await this.deleteDoc(this.id)
            break
        }

        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      }
    }
  },
  created () {
    console.log(this.$route.path, this.operation, this.id)

    switch (this.operation) {
      case 'create':
        console.log('create mode')
        this.setDoc({ clientName: '', partnerName: '' })
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

<style>
</style>
