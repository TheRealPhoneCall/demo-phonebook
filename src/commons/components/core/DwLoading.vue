<template>
  <div>
    <q-dialog
      v-model="showHide"
      persistent
      :maximized="true"
      transition-show="fade"
      transition-hide="fade"
    >
      <div
        class="absolute-full bg-black"
        :class="{'bg-red-10 ': error}"
        style="opacity: 0.6; z-index: -1"
      ></div>
      <div class="column justify-center items-center text-white">
        <div class="flex flex-center">
          <q-spinner
            size="12rem"
            :thickness="1"
          />
          <div
            class="text-weight-bold"
            style="font-size: 1.25rem; position: absolute"
          >{{ `${value.percent} %` }}</div>
        </div>
        <div
          v-for="(msg, id) in (value.message instanceof Array ? value.message : [value.message])"
          :key="`msg-${id}`"
          class="text-weight-light flex flex-center q-px-sm text-center"
          style="font-size: 1rem;"
        >
          <span v-if="msg.length <= 100" v-html="msg" />
          <q-scroll-area v-else style="height: 7rem; width: 90vw">
            <div class="text-center" v-html="msg" />
          </q-scroll-area>
        </div>
        <q-btn
          v-if="error"
          class="text-grey-10 q-mt-md q-px-sm"
          label="Take me to Dashboard"
          color="white"
          :to="`/${userType}`"
          @click="clearAll()"
          no-caps
          rounded
          dense
        />
      </div>
    </q-dialog>

    <dw-ajax-bar-wrapper
      v-if="false"
      v-show="value.loading"
      v-model="value"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DwAjaxBarWrapper from './DwAjaxBarWrapper'

export default {
  name: 'DwLoading',
  props: ['value', 'error'],
  components: { DwAjaxBarWrapper },
  computed: {
    ...mapGetters('userAuth', ['userType']),
    showHide () {
      return this.value.loading || this.error
    }
  },
  methods: {
    ...mapActions('loading', ['clearAll'])
  }
}
</script>
