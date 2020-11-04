<template>
  <div class="col">
    <div class="row q-mb-lg">
      <div class="text-h5 text-weight-bold">All Services ({{services.length}})</div>
      <q-space></q-space>
      <q-btn
        color="primary"
        fab-mini
        icon="add"
        :to="{
            name: `admin-page-admin-database-service-crud`,
            params: {
              id,
              operation: 'create',
            }
          }"
      >
        <q-tooltip>Add a Service</q-tooltip>
      </q-btn>
    </div>
    <div
      class="flex row q-col-gutter-md q-pl-md"
      v-for="service in services"
      :key="service.id"
    >
      <q-item
        class="col-12 q-pa-xs q-pb-lg"
        style="height: 300px"
        clickable
      >
        <div class="row full-width full-height">
          <q-img
            class="col full-height"
            :src="service.photoMain.url"
            :ratio="1"
          />

          <q-card class="col full-height">
            <q-card-section>
              <div class="text-h6">{{ service.title }}</div>
            </q-card-section>

            <q-separator inset />
            <q-card-section v-html="service.desc">
            </q-card-section>

            <q-separator inset />

            <q-card-actions
              align="right"
            >
              <q-btn
                icon="edit"
                color="primary"
                :to="{
                  name: `admin-page-admin-database-service-crud`,
                  params: {
                    id,
                    operation: 'edit',
                    itemId: service.id
                  }
                }"
              />
              <q-btn
                icon="delete"
                color="negative"
                flat
                :to="{
                  name: `admin-page-admin-database-service-crud`,
                  params: {
                    id,
                    operation: 'delete',
                    itemId: service.id
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
  name: 'Service',
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
    ...mapGetters('services', ['loading', 'error', 'services'])
  }
}
</script>

<style>
</style>
