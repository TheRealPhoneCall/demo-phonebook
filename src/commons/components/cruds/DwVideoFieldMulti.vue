<template>
  <div>
    <q-field
      v-model="videos"
      bottom-slots
      :label="label"
      :filled="filled"
      lazy-rules
      stack-label
      :rules="rules"
    >
      <template v-slot:control>
        <transition-group
          class="row full-width q-pa-xs"
          appear
          enter-active-class="animated bounceIn"
          leave-active-class="animated bounceOut"
          tag="div"
        >
          <!-- to avoid warnings, make key as: :key="`vid-${id}`" -->
          <q-item
            v-for="video in videos"
            :key="video.id"
            clickable
            class="q-pa-xs"
            :class="videos.length > 1 ? 'col-6' : 'col-12'"
            @mouseover="hovered=video"
            @mouseleave="hovered=null"
          >
            <div class="fit">
              <iframe
                class="fit"
                v-if="video.type === 'xlink'"
                :src="video.url"
                frameborder="0"
                allowfullscreen
              />
              <video
                v-else
                controls
                class="fit bg-black"
              >
                <source :src="video.url" />
              </video>
            </div>
            <div
              v-if="hovered === video"
              class="row items-center justify-center absolute-full bg-black"
              style="opacity: 0.7"
            >
              <q-btn
                color="white"
                icon="close"
                size="md"
                @click="removeVideo(video)"
                round
                flat
              />
            </div>
          </q-item>
        </transition-group>
        <div class="full-width flex flex-center q-gutter-x-sm">
          <q-btn
            label="From external link"
            icon="link"
            size="sm"
            @click="fromLink"
            dense
          />
          <q-btn
            label="Upload video"
            icon="cloud_upload"
            size="sm"
            @click="show=true"
            dense
          />
        </div>
      </template>
    </q-field>

    <q-dialog v-model="show">
      <dw-fb-uploader
        multiple
        accept=".mp4, video/*"
        @upload="handleUpload"
      />
    </q-dialog>
  </div>
</template>

<script>
import DwFbUploader from '../core/DwFbUploader'
import { removeFbFiles } from '../../store/helpers/removeFbFiles'
import uuidv4 from 'uuid/v4'

export default {
  name: 'DwVideoFieldMulti',
  props: ['label', 'filled', 'value', 'rules'],
  components: { DwFbUploader },
  data: () => ({
    visible: false,
    videos: [],
    hovered: null
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
      console.log('upload: ', f)
      const { url, id } = f
      this.videos.push({ url, id, type: 'uploaded' })
      this.$emit('input', this.videos)
    },
    removeVideo (video) {
      if (video.type === 'uploaded') this.removeFbFiles([video.id])
      this.videos = this.videos.filter(t => t.id !== video.id)
      this.$emit('input', this.videos)
    },
    fromLink () {
      this.$q.dialog({
        title: 'External video link',
        message: 'Enter external link of video',
        prompt: {
          model: '',
          type: 'text'
        }
      }).onOk(link => {
        // convert youtube link to embed link
        let url
        const id = link.split('v=')[1]
        if (id) url = `https://www.youtube.com/embed/${id}`
        else url = link

        this.videos.push({ url, id: uuidv4(), type: 'xlink' })
        this.$emit('videos', this.videos)
      })
    }
  },
  created () {
    console.log('default: ', this.value)
    this.videos = this.value
  }
}
</script>
