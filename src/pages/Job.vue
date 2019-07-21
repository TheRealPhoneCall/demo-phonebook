<template>
  <q-page padding>
    <q-form
      ref="jobForm"
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ operationText }} Job</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            :value="title"
            debounce="500"
            label="Job Title"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input the tile']"
          />

          <q-input
            filled
            :value="desc"
            debounce="500"
            label="Description"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || 'Please type the description']"
          />

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
  name: 'Job',
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
    title: {
      get () { return this.job.title },
      set (value) {
        this.setDoc({
          ...this.job,
          title: value
        })
      }
    },
    desc: {
      get () { return this.job.desc },
      set (value) {
        this.setDoc({
          ...this.job,
          desc: value
        })
      }
    }
  },
  methods: {
    ...mapActions('jobs', ['createDoc', 'retrieveDoc', 'updateDoc', 'deleteDoc']),
    ...mapMutations('jobs', ['setDoc', 'setLoading']),
    async onSubmit () {
      console.log('Adding job: ', this.title, this.desc, this.id)

      const jobPayload = { 
        id: this.id,
        data: {
          title: this.title,
          desc: this.desc
        }
      }
      
      if (this.$refs.jobForm.validate()) {
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
          this.$router.push('/jobs')
        }, 1000)
      }
    }
  },
  created () {
    console.log(this.$route.path, this.operation, this.id)

    switch (this.operation) {
      case 'create':
        console.log('create mode')
        this.setDoc({ title: '', desc: '' })
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
