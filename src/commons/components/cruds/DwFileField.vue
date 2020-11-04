<template>
  <div>
    <q-field
      :value="uploaded.name"
      bottom-slots
      label="File field"
      filled
    >

      <template v-slot:control>
        <div
          class="self-center full-width no-outline"
          tabindex="0"
        >{{uploaded.name}}</div>
      </template>

      <template v-slot:after>
        <q-btn
          label="Select"
          @click="show=true"
        />
      </template>
    </q-field>
    <q-dialog v-model="show">
      <dw-fb-uploader @upload="handleUpload" />
    </q-dialog>
  </div>
</template>

<script>
import DwFbUploader from '../core/DwFbUploader'

export default {
  name: 'DwFileField',
  components: { DwFbUploader },
  data: () => ({
    visible: false,
    uploaded: {}
  }),
  computed: {
    show: {
      get () { return this.visible },
      set (value) { this.visible = value }
    }
  },
  methods: {
    handleUpload (f) {
      this.uploaded = f
    }
  }
}
</script>
