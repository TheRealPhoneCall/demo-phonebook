<template>
  <div
    class="col"
    id="module-info"
  >
    <q-form
      ref="productForm"
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
                  name: 'admin-page-admin-database-products',
                  params: id
                }"
            icon="keyboard_backspace"
          >
            <q-tooltip>Back</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div id="module_info" class="text-h6">Module Info</div> <br/>
          <q-input
            filled
            v-model="title"
            :debounce="500"
            label="Product Title"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input the title' ]"
          />

          <q-tabs
            v-model="descTab"
            align="left"
            inline-label
            no-caps
            dense
            class="text-primary"
          >
            <q-tab
              name="desc"
              label="Description"
            />
            <q-tab
              name="specs"
              label="Specifications"
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels
            v-model="descTab"
            animated
          >
            <q-tab-panel name="desc">
              <div class="text-bold">Product Description</div>
              <br/>
              <q-field
                v-model="desc"
                debounce="500"
                lazy-rules
                :rules="[ val => val !== null && val !== '' || 'Please type the product description']"
              >
                <q-editor
                  dense
                  mid-height="7rem"
                  v-model="desc"
                  class="fit text-black"
                />
              </q-field>
            </q-tab-panel>
            <q-tab-panel name="specs">
              <div class="text-bold">Product Specifications</div>
              <br/>
              <q-field
                v-model="specs"
                debounce="500"
                lazy-rules
                :rules="[ val => val !== null && val !== '' || 'Please type the product specifications']"
              >
                <q-editor
                  dense
                  mid-height="7rem"
                  v-model="specs"
                  class="fit text-black"
                />
              </q-field>
            </q-tab-panel>
          </q-tab-panels>

          <q-select
            filled
            v-model="privacy"
            :options="privacyOptions"
            label="Privacy"
            :rules="[ val => val && val.length > 0 || 'Please select the product\'s privacy status']"
          />

          <dw-related-field-multi
            label="Related Categories"
            type="chips"
            filled
            id-only
            :options="categoriesList"
            v-model="categories"
          />

          <dw-related-field-multi
            label="Origin Projects"
            type="chips"
            filled
            id-only
            :options="projectList"
            v-model="originProjects"
          />

          <div
            class="text-h6"
            id="owner-and-collaborators"
          >Owner and Collaborators</div> <br />
          <q-select
            filled
            v-model="owner"
            :display-value="owner.displayName"
            :options="revybersList"
            label="Product Owner"
            emit-value
            map-options
          /> <br />

          <q-select
            filled
            v-model="revyberTeam"
            :display-value="revyberTeam.title"
            :options="teamsList"
            label="Product Team"
            emit-value
            map-options
          /> <br/>

          <div class="row">
            <dw-related-field-multi
              class="col-6 q-pr-md"
              label="Collaborators"
              filled
              type="chips"
              id-only
              v-model="productRevybers"
              :options="revybersList"
            />

            <dw-related-field-multi
              class="col-6"
              label="Followers"
              filled
              type="chips"
              id-only
              v-model="productRevybees"
              :options="revybeesList"
            />
          </div>

          <div
            class="text-h6"
            id="status-and-reviews"
          >Status and Reviews</div> <br />
          <q-select
            filled
            v-model="status"
            :options="statusOptions"
            label="Product Status"
            :rules="[ val => val && val.length > 0 || 'Please select the product\'s current status']"
          />

          <!-- TODO: DwHistory component -->
          <!-- TODO: RvReactions component -->
          <!-- TODO: DwReviews component -->

          <div
            class="text-h6"
            id="pricing-and-inventory"
          >Pricing and Inventory</div> <br />

          <!-- FIXME: DwCurrencyField -->
          <dw-currency-field
            :currency-options="['PHP', 'USD']"
            label="Product Price"
            :debounce="500"
            v-model="price"
            :rules="[ val => val !== null && val !== '' || 'Please input the product\'s price']"
          />
          <!-- TODO: RvPricing component -->
          <!-- TODO: RvStocks component -->
          <!-- TODO: RvVariations component -->

          <div
            class="text-h6"
            id="media"
          >Product Photos</div> <br/>
          <div class="row">
            <dw-photo-field
              label="Main Photo"
              class="col q-pa-md"
              filled
              v-model="photoMain"
              :rules="[ val => val && val.url !== '' || 'Please select an image']"
            />
            <dw-photo-field-multi
              label="Photos"
              class="col q-pa-md"
              filled
              v-model="photos"
              :rules="[ val => val && val.url !== '' || 'Please select an image']"
            />
          </div>
          <dw-file-field-multi
            label="Files"
            :default="files"
            @new="t => files = [...files, t]"
            @delete="t => files = files.filter(x => x.fileId !== t)"
          />

          <!-- TO DO: Dates -->
          <div id="dates"></div>

          <div v-if="operation === 'delete'">
            <div class="text-body1">
              Are you sure you want to delete this product? This operation is irreversible!
            </div>
            <q-field
              ref="toggle"
              :value="acceptDelete"
              :rules="[ val => val || 'Please confirm that you want to delete this product']"
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
import { productMeta } from 'src/services/data/data'

import crudBase from './CrudBase'

import DwCurrencyField from 'src/components/cruds/DwCurrencyField'
import DwPhotoField from 'src/components/cruds/DwPhotoField'
import DwPhotoFieldMulti from 'src/components/cruds/DwPhotoFieldMulti'
import DwRelatedFieldMulti from 'src/components/cruds/DwRelatedFieldMulti'
import DwFileFieldMulti from 'src/components/cruds/DwFileFieldMulti'

export default {
  name: 'Product',
  components: {
    DwCurrencyField,
    DwPhotoField,
    DwPhotoFieldMulti,
    DwRelatedFieldMulti,
    DwFileFieldMulti
  },
  data () {
    return {
      formName: 'productForm',
      descTab: 'desc',
      priceCurrency: 'PHP',
      statusOptions: [
        'Started',
        'Planning & Designing',
        'Building',
        'Testing',
        'Iterating',
        'Finalization'
      ],
      privacyOptions: ['Public', 'Private']
    }
  },
  props: ['id', 'operation', 'itemId'],
  mixins: [crudBase],
  computed: {
    ...mapGetters('userAuth', ['userType']),
    ...mapGetters('products', ['loading', 'error', 'product', 'docName']),
    ...mapGetters('projects', ['projects']), // TODO: Make this revyber projects
    ...mapGetters('teams', ['teams']),
    ...mapGetters('revybers', ['revybers']),
    ...mapGetters('revybees', ['revybees']),
    ...mapGetters('categories', { allCategories: 'categories' }),
    ...mapListConverters({
      projectList: { list: 'projects', id: 'id', label: 'title' },
      teamsList: { list: 'teams', id: 'id', label: 'title' },
      revybersList: { list: 'revybers', id: 'id', label: 'displayName', icon: 'photoURL' },
      revybeesList: { list: 'revybees', id: 'id', label: 'displayName', icon: 'photoURL' },
      categoriesList: { list: 'allCategories', id: 'id', label: 'title' }
    }),
    ...mapGettersSetters(
      productMeta.getMapObject('products/product', 'products/setDoc')
    )
  },
  methods: {
    ...mapActions('products', {
      createDoc: 'createDoc',
      retrieveDoc: 'retrieveDoc',
      retrieveModule: 'retrieveProduct',
      deleteDoc: 'deleteDoc',
      updateDocModified: 'updateDocModified'
    }),
    ...mapActions('teams', ['retrieveAllTeams']),
    ...mapActions('revybers', ['retrieveAllRevybersInfo']),
    ...mapActions('revybees', ['retrieveAllRevybeesInfo']),
    ...mapActions('categories', ['retrieveAllCategories']),
    ...mapMutations('products', ['setDoc', 'setLoading', 'backupDoc', 'initModule']),
    preSubmit () {
      this.owner = { id: this.owner.id, displayName: this.owner.label }
      this.revyberTeam = { id: this.revyberTeam.id, title: this.revyberTeam.label }
      this.photoCarousel = this.photos
    },
    async onSubmit () {
      if (this.isFormValidated) {
        this.preSubmit()
        this.submitPayload({
          id: this.itemId,
          data: productMeta.getDataPayload(this)
        })
      }
    }
  },
  async created () {
    console.log(this.$route.params)
    console.log(this.$route.path, this.operation, this.id)

    // must be ran first - in order for fields to react properly
    this.initModule()
    await this.initFormData(productMeta.getDefaults())

    // run next
    await this.retrieveAllTeams()
    await this.retrieveAllCategories()
    await this.retrieveAllRevybersInfo()
    await this.retrieveAllRevybeesInfo()
    console.log('owner', this.owner)
    console.log('product', this.product)
    console.log('revybers', this.productRevybers)
    console.log('revybees', this.productRevybees)
  }
}
</script>
