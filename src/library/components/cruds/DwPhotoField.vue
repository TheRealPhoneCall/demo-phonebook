<template>
  <div style="max-width: 200px">
    <dw-fb-uploader
      label="Upload"
      :autoremove="true"
      accept=".jpg, image/*"
      @upload="handleUpload"
      style="width: 100%"
    />
    <br />
    <q-field
      v-if="img"
      v-model="img"
      bottom-slots
      :label="label"
      :filled="filled"
      lazy-rules
      stack-label
      :rules="rules"
    >
      <template v-slot:control>
        <div class="full-height full-width q-gutter-y-sm">
          <q-item
            class="q-pa-none"
            @mouseover="hover=true"
            @mouseleave="hover=false"
          >
            <q-img
              :src="img ? img.url: ''"
              :ratio="1"
              style="height:200px; max-width: 200px"
            />
            <div
              v-if="hover && img"
              class="row items-center justify-center absolute-full bg-black"
              style="opacity: 0.7"
            >
              <q-btn
                color="white"
                icon="close"
                size="md"
                round
                flat
                @click="removeImg"
              />
            </div>
          </q-item>
        </div>
      </template>
    </q-field>
  </div>
</template>

<script>
import DwFbUploader from '../core/DwFbUploader'
import { removeFbFiles } from '../../store/helpers/removeFbFiles'

export default {
  name: 'DwPhotoField',
  props: {
    'label': String,
    'filled': Boolean,
    'value': Object,
    'rules': Array
  },
  components: { DwFbUploader },
  data: () => ({
    visible: false,
    img: null,
    hover: false
  }),
  computed: {
    show: {
      get () { return this.visible },
      set (value) { this.visible = value }
    }
  },
  methods: {
    removeFbFiles,
    handleUpload (f) {
      const { url, id } = f
      this.img = { url, id }
      this.$emit('input', this.img)
    },
    removeImg () {
      if (this.img.id) {
        this.removeFbFiles([this.img.id])
      }
      this.img = null
    }
  },
  created () {
    this.img = this.value ? this.value : {}
  }
}
</script>
