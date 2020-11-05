<template>
  <q-dialog
    v-model="modalModel"
    persistent
    v-if="modalModel"
  >
    <q-card style="width: 80vw; max-width: 80vw">
      <q-form class="col">
        <q-card-section class="row">
          <div
            class="text-h6"
            v-if="!paraplannersActions"
          >
            Notify Adviser
          </div>
          <div
            class="text-h6"
            v-else
          >
            Paraplanner Reasons
          </div>
          <q-space></q-space>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator inset></q-separator>
        <template v-if="!paraplannersActions ? true : paraplannersActions.isHandedOver">
          <q-card-section class="row q-pb-none">
            <div class="text-h6 text-bold">Handover the SoA <span v-if="paraplannersActions">Reason</span></div>
          </q-card-section>
          <q-card-section
            class="row q-my-none q-py-none"
            v-if="!paraplannersActions"
          >
            <div class="text-body2">If you need to hand the SoA back to QPP prior to its completion, please enter the reason for your handover then click the button below.</div>
          </q-card-section>
          <q-card-section
            class="row q-my-none q-py-none"
            v-else-if="paraplannersActions.isHandedOver"
          >
            <div class="text-body2 text-subtitle">Handed Over by <span class="text-bold text-italic">{{ paraplannersActions.handoverBy }}</span>.</div>
          </q-card-section>
          <q-card-section class="row">
            <q-input
              v-model="handOverSoaText"
              class="col"
              filled
              :readonly="!!paraplannersActions"
              outlined
              type="textarea"
            />
          </q-card-section>
          <q-card-section
            class="row q-pt-none"
            v-if="!paraplannersActions"
          >
            <q-space></q-space>
            <q-btn
              :loading="btnLoading"
              color="secondary"
              label="Handover Soa"
              size="md"
              class="q-ml-sm"
              @click="handOverConfirmation = true"
            />
          </q-card-section>
          <q-separator inset></q-separator>
        </template>

        <template v-if="!paraplannersActions ? true : paraplannersActions.isAdvicedForDelay">
          <q-card-section class="row q-pb-none">
            <div class="text-h6 text-bold">Advice for Possible Delay <span v-if="paraplannersActions">Reason</span></div>
          </q-card-section>
          <q-card-section
            class="row q-py-none"
            v-if="!paraplannersActions"
          >
            <div class="text-body2">Please enter the reason for the delay.</div>
          </q-card-section>
          <q-card-section
            class="row q-py-none"
            v-else-if="paraplannersActions.isAdvicedForDelay"
          >
            <div class="text-body2">Submitted by <span class="text-bold text-italic">{{paraplannersActions.delayBy}}</span>.</div>
          </q-card-section>
          <q-card-section class="row">
            <q-input
              v-model="adviceForDelayText"
              class="col q-my-sm"
              filled
              :readonly="!!paraplannersActions"
              outlined
              type="textarea"
            />
          </q-card-section>
          <q-card-section
            class="row q-pt-none"
            v-if="!paraplannersActions"
          >
            <q-space></q-space>
            <q-btn
              :loading="btnLoading"
              color="secondary"
              label="Advice Delay"
              size="md"
              class="q-ml-sm"
              @click="adviceForDelayConfirmation = true"
            />
          </q-card-section>
        </template>
        <q-separator inset></q-separator>
        <q-card-section class="row">
          <div class="q-gutter-md">
            <q-btn
              label="Cancel"
              @click="modalModel = false"
              color="negative"
            />
          </div>
        </q-card-section>
        <dw-yes-no-modal
          :btnColor="'primary'"
          :btnLabel="'Confirm'"
          :message="'Are you sure to submit the reason for the delay?'"
          :messageIcon="'check_circle'"
          :iconColor="'green'"
          :onSubmit="adviceForDelay"
          :yesNoModal="adviceForDelayConfirmation"
          @closeYesNoModal="adviceForDelayConfirmation = false"
        ></dw-yes-no-modal>
        <dw-yes-no-modal
          :btnColor="'primary'"
          :btnLabel="'Confirm'"
          :message="'Are you sure to hand over this SoA?'"
          :messageIcon="'error'"
          :iconColor="'red'"
          :onSubmit="handOverSoA"
          :yesNoModal="handOverConfirmation"
          @closeYesNoModal="handOverConfirmation = false"
        ></dw-yes-no-modal>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import DwYesNoModal from "src/components/DwYesNoModal"
export default {
  name: "DwNotifyModal",
  components: {
    DwYesNoModal
  },
  data () {
    return {
      handOverSoaText: '',
      adviceForDelayText: '',
      handOverConfirmation: false,
      adviceForDelayConfirmation: false
    }
  },
  props: ['modal', 'btnLoading', 'paraplannersActions'],
  computed: {
    modalModel: {
      get () {
        return this.modal
      },
      set () {
        this.$emit('closeModal')
      }
    }
  },
  methods: {
    async adviceForDelay () {
      await this.$emit('adviceForDelay', { handOverSoaText: this.handOverSoaText, adviceForDelayText: this.adviceForDelayText })
      // console.log("CLOSING MODAL")
      // this.$emit('closeModal')
    },
    async handOverSoA () {
      this.$emit('handOverSoA', { handOverSoaText: this.handOverSoaText, adviceForDelayText: this.adviceForDelayText })
    }
  },
  created () {
    if (this.paraplannersActions) {
      this.handOverSoaText = this.paraplannersActions.handoverReason || ''
      this.adviceForDelayText = this.paraplannersActions.delayReason || ''
    }
  }
}
</script>
