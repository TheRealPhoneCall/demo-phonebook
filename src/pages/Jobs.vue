<template>
  <q-page class="flex" padding>
    <div class="row q-col-gutter-md">
      <div
        v-for="job in jobs"
        :key="job.id"
        class="col-xs-12 col-sm-6 col-md-3" 
        
      >
        <q-card dark bordered class="bg-grey-9 my-card">
          <q-card-section>
            <div class="text-h6">{{ job.title }}</div>
            <div class="text-subtitle2">{{ job.desc }}</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, voluptas ut, 
            illum temporibus facere sunt tenetur iure, molestiae excepturi amet ipsa maxime fugit 
            perspiciatis. Dolor in nemo libero nobis officia! Similique, explicabo! Magni, 
            quisquam cumque. Nobis fuga, officiis dolorum magni distinctio asperiores odit error 
            id ut aliquam, deserunt iste quae.
          </q-card-section>

          <q-card-section>
            <q-btn 
              icon="edit"
              color="primary" 
              :to="`/job/${job.id}/edit`" 
            />
            <q-btn 
              icon="delete" 
              color="negative" 
              flat
              :to="`/job/${job.id}/delete`" 
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
        <q-fab-action to="/jobs/create" color="primary" icon="library_add" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Jobs',
  data () {
    return {
      jobFormShow: false
    }
  },
  computed: {
    ...mapGetters('jobs', ['loading', 'error', 'jobs'])
  },
  methods: {
    ...mapActions('jobs', ['retrieveAllJobs'])
  },
  created () {
    this.retrieveAllJobs()
  }
}
</script>

<style>
</style>
