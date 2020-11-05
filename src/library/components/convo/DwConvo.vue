<template>
  <div >
    <div
      class="scroll overflow-hidden"
      :style="{ height: `${height}px`, width: '100%', maxHeight: '100rem' }"
    >
      <q-resize-observer @resize="resizeBox" />
      <q-scroll-observer @scroll="scrollHandler" />
      <dw-convo-layout
        :convos="convos"
        :active-convo="activeConvo"
        @startConvo="$emit('startConvo')"
        @setActiveConvo="$emit('setActiveConvo', $event)"
        @close="$emit('closePanel')"
      />
    </div>
  </div>
</template>

<script>
import DwConvoLayout from './DwConvoLayout'

export default {
  name: 'DwConvo',
  components: { DwConvoLayout },
  props: {
    convos: Array,
    activeConvo: Object,
    onPanel: Boolean,
    hasCloseBtn: Boolean
  },
  data: () => ({
    rendered: false,
    height: null,
    headerSize: 65,
    footerSize: 60,
    otherElementSize: 500
  }),
  methods: {
    resizeBox () {
      if (this.onPanel) {
        const { innerHeight } = window
        this.height = this.$q.screen.gt.sm ? innerHeight - 7 : innerHeight - this.headerSize
      }
      else {
        const { headerSize, footerSize, otherElementSize } = this
        this.height = window.innerHeight - headerSize - footerSize - otherElementSize
      }
    },
    scrollHandler () {
      console.log('handling scrolls')
      if (!this.onPanel) {
        const { headerSize, footerSize, otherElementSize } = this
        this.height = window.innerHeight - headerSize - footerSize - otherElementSize
      }
    }
  },
  created () {
    this.resizeBox()
    this.scrollHandler()
  }
}
</script>