<template>
  <div class="col">
    <div class="row q-mb-lg">
      <div class="text-h5 text-weight-bold">All Module ({{modules.length}})</div>
      <q-space></q-space>
      <!-- TODO: Add link to create button -->
      <q-btn
        color="primary"
        fab-mini
        icon="add"
      >
        <q-tooltip>Add a module</q-tooltip>
      </q-btn>
    </div>
    <div
      class="flex row q-col-gutter-md q-pl-md"
      v-for="module in modules"
      :key="module.id"
    >
      <q-item
        class="col-12 q-pa-xs q-pb-lg"
        style="height: 300px"
        clickable
      >
        <div class=" row full-width full-height">
          <q-img
            class="col full-height"
            :src="module.photoMain.url"
            :ratio="1"
          />

          <q-card class="col full-height">
            <q-card-section>
              <div class="text-h6">{{ module.title }}</div>
            </q-card-section>

            <q-separator inset />
            <q-card-section v-html="module.desc">
            </q-card-section>

            <q-separator inset />

            <q-card-actions align="right">
              <!-- TODO: Add link to edit button -->
              <q-btn
                icon="edit"
                color="primary"
              />
              <!-- TODO: Add link to delete button -->
              <q-btn
                icon="delete"
                color="negative"
                flat
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-item>

    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears
        size="150px"
        color="primary"
      />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RvRedirect from 'src/components/mixins/RvRedirect'

export default {
  name: 'Module',
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      subjectFormShow: false
    }
  },
  mixins: [RvRedirect],
  computed: {
    ...mapGetters('userAuth', ['userType']),
    ...mapGetters('modules', ['loading', 'error', 'modules'])
  }
}
</script>

<style>
</style>
