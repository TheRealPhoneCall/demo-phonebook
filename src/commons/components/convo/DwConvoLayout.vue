<template>
  <div class="column fit no-wrap">
    <div class="row fit no-wrap">
      <!-- Desktop Layout -->
      <div class="col-md-5 col-lg-4 q-mr-sm gt-sm">
        <dw-convo-list
          :convos="convos"
          @startConvo="$emit('startConvo')"
          @setActiveConvo="$emit('setActiveConvo', $event)"
        />
      </div>
      <div class="col-md-7 col-lg-8 q-pr-sm gt-sm">
        <dw-active-convo :active-convo="activeConvo" />
      </div>
      <!-- Mobile Layout -->
      <div class="col-xs-12 lt-md" v-if="showList" >
        <transition
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideOutRight"
        >
          <dw-convo-list
            :convos="convos"
            @startConvo="$emit('startConvo'); showList = false;"
            @setActiveConvo="$emit('setActiveConvo', $event); showList = false;"
          />
        </transition>
      </div>
      <div class="col-xs-12 q-pa-none lt-md" v-if="!showList">
        <transition
          enter-active-class="animated slideInRight"
          leave-active-class="animated slideOutLeft"
        >
          <dw-active-convo
            :active-convo="activeConvo"
            has-list-btn
            @listBtnClick="showList = !showList"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import DwConvoList from './DwConvoList'
import DwActiveConvo from './DwActiveConvo'

export default {
  name: 'DwConvoLayout',
  props: {
    activeConvo: Object,
    convos: Array,
    hasCloseBtn: Boolean
  },
  data: () => ({
    showList: true
  }),
  components: { DwConvoList, DwActiveConvo }
}
</script>