<template>
  <div
    class="col"
    id="module-info"
  >
    <q-form
      ref="projectForm"
      @submit="onSubmit"
      v-if="!loading && title"
    >
      <q-card flat>
        <q-card-section class="row items-center q-pa-none q-mb-lg">
          <div class="text-h5 text-weight-bold">{{ operationText }} Form</div>
          <q-space />
          <q-btn
            color="primary"
            fab-mini
            :to="{
                  name: 'admin-page-admin-database-projects',
                  params: id
                }"
            icon="keyboard_backspace"
          >
            <q-tooltip>Back</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <!-- TODO: Write your fields here -->

          <div v-if="operation === 'delete'">
            <div class="text-body1">
              Are you sure you want to delete this project? This operation is irreversible!
            </div>
            <q-field
              ref="toggle"
              :value="acceptDelete"
              :rules="[ val => val || 'Please confirm that you want to delete this project']"
              borderless
              dense
            >
              <template v-slot:control>
                <q-checkbox
                  v-model="acceptDelete"
                  label="Accept delete"
                  color="negative"
                />
              </template>
            </q-field>
          </div>

        </q-card-section>
        <br />
        <br />
        <q-card-section class="q-pa-none">
          <div v-if="operation === 'delete'">
            <q-btn
              label="Delete"
              color="negative"
              :loading="loading"
              @click="onDelete"
            />
            <q-btn
              label="Cancel"
              color="primary"
              flat
              :to="collectionUrl"
            />
          </div>
          <div
            v-else
            style="width: 100%;"
          >
            <q-btn
              label="Submit"
              type="submit"
              color="primary"
              :loading="loading"
            />
            <q-btn
              label="Cancel"
              color="primary"
              flat
              :to="collectionUrl"
            />
          </div>
        </q-card-section>

      </q-card>

    </q-form>

    <q-inner-loading :showing="loading">
      <q-spinner-gears
        size="150px"
        color="primary"
      />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { mapGettersSetters, mapListConverters } from 'src/store/helpers/helpers'
import { projectMeta } from 'src/services/data/data'

import crudBase from './CrudBase'

// import DwCurrencyField from 'src/libraries/components/cruds/DwCurrencyField'
// import DwPhotoField from 'src/libraries/components/cruds/DwPhotoField'
// import DwPhotoFieldMulti from 'src/libraries/components/cruds/DwPhotoFieldMulti'
// import DwRelatedFieldMulti from 'src/libraries/components/cruds/DwRelatedFieldMulti'
// import DwFileFieldMulti from 'src/libraries/components/cruds/DwFileFieldMulti'

export default {
  name: 'Project',
  components: {
    // DwCurrencyField,
    // DwPhotoField,
    // DwPhotoFieldMulti,
    // DwRelatedFieldMulti,
    // DwFileFieldMulti
  },
  data () {
    return {
      formName: 'projectForm'
    }
  },
  props: ['id', 'operation', 'itemId'],
  mixins: [crudBase],
  computed: {
    ...mapGetters('userAuth', ['userType']),
    ...mapGetters('projects', ['loading', 'error', 'project', 'docName']),
    ...mapListConverters({
      sampleList: { list: 'listName', id: 'id', label: 'title', icon: 'photoUrl' }
    }),
    ...mapGettersSetters(
      projectMeta.getMapObject('projects/project', 'projects/setDoc')
    )
  },
  methods: {
    ...mapActions('projects', {
      createDoc: 'createDoc',
      retrieveDoc: 'retrieveDoc',
      retrieveModule: 'retrieveProject',
      deleteDoc: 'deleteDoc',
      updateDocModified: 'updateDocModified'
    }),
    ...mapMutations('projects', ['setDoc', 'setLoading', 'backupDoc', 'initModule']),
    preSubmit () {
      // TODO: Presubmit code here
    },
    async onSubmit () {
      if (this.isFormValidated) {
        this.preSubmit()
        this.submitPayload({
          id: this.itemId,
          data: projectMeta.getDataPayload(this)
        })
      }
    }
  },
  async created () {
    console.log(this.$route.params)
    console.log(this.$route.path, this.operation, this.id)

    // must be ran first - in order for fields to react properly
    this.initModule()
    await this.initFormData(projectMeta.getDefaults())

    // TODO: Run other create methods here
  }
}
</script>
