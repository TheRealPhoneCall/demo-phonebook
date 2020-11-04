<template>
  <!-- <q-page-sticky
    :position="position"
    :offset="offset"
  > -->
  <div>
    <scroll-active
      tag="div"
      :exact="true"
      :modifyUrl="false"
      :offset="50"
      :duration="800"
      bezier-easing-value=".5,0,.35,1"
      @itemchanged="onItemChanged"
    >
      <q-btn
        v-for="section in pageSections"
        :key="section.id"
        :link="`#${section.linkId}`"
        class="full-width scrollactive-item"
        style="font: inherit; font-color: inherit"
        align="left"
        rounded
        no-caps
        v-ripple
        size="md"
        :flat="activeSection === `#${section.linkId}` ? false : true"
      >
        {{ section.name }}
      </q-btn>
    </scroll-active>
  </div>
  <!-- </q-page-sticky> -->
</template>

<script>
import { mapState } from 'vuex'
import ScrollActive from 'src/commons/components/libraries/ScrollActive'

export default {
  name: 'DwPageSections',
  components: { ScrollActive },
  data () {
    return {
      sections: [],
      activeSection: null
    }
  },
  props: [
    'pageSections', 'offset', 'defaultActive', 'position'
  ],
  computed: {
    ...mapState('ui', ['qDefaults'])
  },
  methods: {
    onItemChanged (event, currentItem, lastActiveItem) {
      // console.log('ev: ', event)
      // console.log('citem: ', currentItem)
      // console.log('last aitem: ', lastActiveItem)
      if (currentItem) {
        this.activeSection = currentItem.getAttribute('link')
      }
    }
  },
  created () {
    this.sections = this.pageSections
    this.activeSection = `#${this.defaultActive}`
  },
  mounted () {
  }
}
</script>