<template>
  <div class="col">
    <div class="row q-mb-lg">
      <div class="text-h5 text-weight-bold">All Revybals ({{projects.length}})</div>
      <q-space></q-space>
      <q-btn
        color="primary"
        fab-mini
        icon="add"
        :to="{
            name: `admin-page-admin-database-project-crud`,
            params: {
              id,
              operation: 'create',
            }
          }"
      >
        <q-tooltip>Add a Project</q-tooltip>
      </q-btn>
    </div>
    <div
      class="flex row q-col-gutter-md q-pl-md"
      v-for="project in projects"
      :key="project.id"
    >
      <q-item
        class="col-12 q-pa-xs q-pb-lg"
        style="height: 300px"
        clickable
      >
        <div class="row full-width full-height">
          <q-img
            class="col full-height"
            :src="project.photoMain.url"
            :ratio="1"
          />

          <q-card class="col full-height">
            <q-card-section>
              <div class="text-h6">{{ project.title }}</div>
            </q-card-section>

            <q-separator inset />
            <q-card-section v-html="project.desc">
            </q-card-section>

            <q-space />
            <q-card-actions
              align="right"
            >
              <q-btn
                icon="edit"
                color="primary"
                :to="{
                  name: `admin-page-admin-database-project-crud`,
                  params: {
                    id,
                    operation: 'edit',
                    itemId: project.id
                  }
                }"
              />
              <q-btn
                icon="delete"
                color="negative"
                flat
                :to="{
                  name: `admin-page-admin-database-project-crud`,
                  params: {
                    id,
                    operation: 'delete',
                    itemId: project.id
                  }
                }"
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
  name: 'Projects',
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
    ...mapGetters('projects', ['loading', 'error', 'projects'])
  }
}
</script>

<style>
</style>
