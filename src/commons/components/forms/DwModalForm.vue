<template>
  <q-dialog
    v-if="modal_"
    v-model="modal_"
    persistent
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-form
        ref="formRef"
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-card-section class="row">
          <div class="text-h6">{{title}}</div>
          <q-space></q-space>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section class="row" v-if="message">
          <div class="col">
            <span class="text-subtitle1">{{message}}</span>
          </div>
        </q-card-section>

        <slot
          name="form-fields"
          :fields="fields"
        />

        <q-card-section
          v-if="formLoading.message"
          class="row"
        >
          <q-item>
            <q-item-section
              v-if="formLoading.loading"
              avatar
            >
              <q-spinner
                color="primary"
                size="3em"
                :thickness="10"
              />
            </q-item-section>
            <q-item-label>
              {{ formLoading.message }}
            </q-item-label>
          </q-item>
        </q-card-section>

        <q-card-actions class="bg-white row q-mb-lg q-mt-md text-teal">
          <div class="col text-right">
            <q-btn
              class="q-ml-sm"
              flat
              color="danger"
              label="Cancel"
              v-close-popup
              :loading="formLoading? formLoading.loading : false"
            />
            <q-btn
              :color="btnColor"
              :label="btnLabel"
              @click="onSubmit"
              :loading="formLoading? formLoading.loading : false"
            />
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DwModalForm',
  props: {
    btnColor: String,
    btnLabel: String,
    title: String,
    message: String,
    messageIcon: String,
    iconColor: String,
    formLoading: Object,
    modal: Boolean
    // value: Object
  },
  data () {
    return {
      fields: {}
    }
  },
  computed: {
    modal_: {
      get () {
        return this.modal
      },
      set () {
        this.$emit('closeModalForm')
      }
    }
  },
  // watch: {
  //   fields (value) {
  //     this.$emit('input', value)
  //   }
  // },
  methods: {
    // onSubmit (evt) {
    //   console.log('@submit - do something here', evt)
    //   evt.target.submit()

    //   this.$emit('onSubmit', evt)
    // },
    onSubmit () {
      this.$refs.formRef.validate().then(async (validated) => {
        if (validated) {
          console.log('@submit - do something here')
  
          this.$emit('onSubmit')
        }
      })
    },
    onReset () {
      console.log('@reset')
    }
  },
  destroyed () {
    console.log("DESTROYED")
  },
  created () {
    console.log("CREATED")
    this.fields = this.value ? this.value : {}
  }
}
</script>
