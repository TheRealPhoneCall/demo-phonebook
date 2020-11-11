<template>
  <div
    class="col"
    id="module-info"
  >
    <q-form
      ref="moduleForm"
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
                  name: 'admin-page-admin-database-modules',
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
              Are you sure you want to delete this module? This operation is irreversible!
            </div>
            <q-field
              ref="toggle"
              :value="acceptDelete"
              :rules="[ val => val || 'Please confirm that you want to delete this module']"
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
import { moduleMeta } from 'src/services/data/data'

import crudBase from './CrudBase'

// import DwCurrencyField from 'src/libraries/components/cruds/DwCurrencyField'
// import DwPhotoField from 'src/libraries/components/cruds/DwPhotoField'
// import DwPhotoFieldMulti from 'src/libraries/components/cruds/DwPhotoFieldMulti'
// import DwRelatedFieldMulti from 'src/libraries/components/cruds/DwRelatedFieldMulti'
// import DwFileFieldMulti from 'src/libraries/components/cruds/DwFileFieldMulti'

export default {
  name: 'Module',
  components: {
    // DwCurrencyField,
    // DwPhotoField,
    // DwPhotoFieldMulti,
    // DwRelatedFieldMulti,
    // DwFileFieldMulti
  },
  data () {
    return {
      formName: 'moduleForm'
    }
  },
  props: ['id', 'operation', 'itemId'],
  mixins: [crudBase],
  computed: {
    ...mapGetters('userAuth', ['userType']),
    ...mapGetters('modules', ['loading', 'error', 'module', 'docName']),
    ...mapListConverters({
      sampleList: { list: 'listName', id: 'id', label: 'title', icon: 'photoUrl' }
    }),
    ...mapGettersSetters(
      moduleMeta.getMapObject('modules/module', 'modules/setDoc')
    )
  },
  methods: {
    ...mapActions('modules', {
      createDoc: 'createDoc',
      retrieveDoc: 'retrieveDoc',
      retrieveModule: 'retrieveModule',
      deleteDoc: 'deleteDoc',
      updateDocModified: 'updateDocModified'
    }),
    ...mapMutations('modules', ['setDoc', 'setLoading', 'backupDoc', 'initModule']),
    preSubmit () {
      // TODO: Presubmit code here
    },
    async onSubmit () {
      if (this.isFormValidated) {
        this.preSubmit()
        this.submitPayload({
          id: this.itemId,
          data: moduleMeta.getDataPayload(this)
        })
      }
    }
  },
  async created () {
    console.log(this.$route.params)
    console.log(this.$route.path, this.operation, this.id)

    // must be ran first - in order for fields to react properly
    this.initModule()
    await this.initFormData(moduleMeta.getDefaults())

    // TODO: Run other create methods here
  }
}
</script>
