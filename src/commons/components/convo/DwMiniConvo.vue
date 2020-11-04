<template>
  <div>
    <q-page-sticky
      :position="position"
      :offset="offset"
    >
      <q-btn
        color="primary"
        icon="chat"
        round
        size="1.15rem"
        @click="rendered = true; setMiniConvo(true)"
      />
    </q-page-sticky>

    <q-page-sticky
      v-if="rendered"
      v-show="miniConvo"
      :position="position"
      :offset="offset"
    >
      <q-card :style="{ height: `${height}px`, width: '35rem', maxHeight: '40rem' }">
        <q-resize-observer @resize="onResize" />
        <dw-convo-layout
          has-close-btn
          @close="setMiniConvo(false)"
        />
      </q-card>
    </q-page-sticky>
  </div>
</template>

<script>
import DwConvoLayout from './DwConvoLayout'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DwMiniConvo',
  props: ['position', 'offset'],
  components: { DwConvoLayout },
  data: () => ({
    rendered: false,
    height: null,
    headerSize: 80,
    footerSize: 50
  }),
  computed: {
    ...mapGetters('ui', ['miniConvo'])
  },
  methods: {
    ...mapMutations('ui', ['setMiniConvo']),
    onResize () {
      const { headerSize, footerSize } = this
      this.height = window.innerHeight - headerSize - footerSize
    }
  },
  created () {
    const { headerSize, footerSize } = this
    this.height = window.innerHeight - headerSize - footerSize
  }
}
</script>