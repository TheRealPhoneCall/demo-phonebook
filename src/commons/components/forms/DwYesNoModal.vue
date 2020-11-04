<template>
  <div>
    <q-dialog
      v-model="modal"
      persistent
    >
      <q-card style="width: 450px; height: 350px; max-width: 80vw;">
        <q-card-section class="row">
          <q-space></q-space>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section class="row q-ma-none q-pa-none">
          <div class="col text-center">
            <q-icon
              :name="messageIcon"
              :color="iconColor"
              class="text-red col"
              style="font-size: 7.5rem;"
            />
          </div>
        </q-card-section>

        <q-card-section class="row">
          <div class="col text-center">
            <span class="q-ml-md text-subtitle1">{{message}}</span>
          </div>
        </q-card-section>

        <q-card-actions class="bg-white row q-mb-lg q-mt-md text-teal">
          <div class="col text-center">
            <q-btn
              :color="btnColor"
              :label="btnLabel"
              @click="onSubmit()"
            />
            <q-btn
              class="q-ml-sm"
              color="grey"
              label="Cancel"
              v-close-popup
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { formatMoney } from 'src/store/helpers/routines'
export default {
  // name: 'ComponentName',
  props: ['btnColor', 'btnLabel', 'message', 'messageIcon', 'iconColor', "onSubmit", "yesNoModal"],
  data () {
    return {
      // userType: 'asdas'
      credits: 0
    }
  },
  computed: {
    modal: {
      get () {
        return this.yesNoModal
      },
      set () {
        this.$emit('closeYesNoModal')
      }
    }
  },
  methods: {
    formatMoney
  }
}
</script>
