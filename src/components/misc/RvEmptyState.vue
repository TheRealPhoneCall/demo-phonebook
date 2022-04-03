<template>
  <div class="row text-center">
    <div class="col text-center q-pa-lg">
      <q-icon
        name="contacts"
        color="primary"
        size="4rem"
      />
      <p v-if="title" class="text-faded text-bold text-h6">{{ title }}</p>
      <p v-if="message" class="text-faded">{{ message }}</p>
      <q-btn
        v-if="hasBtn"
        :label="btnLabel"
        :icon="btnStyle.icon"
        :color="btnStyle.color"
        :outline="btnStyle.outline"
        :rounded="btnStyle.rounded"
        no-caps
        @click="$emit('addRecord')"
      />
    </div>

  </div>
</template>

<script>

export default {
  name: 'DwEmptyState',
  props: {
    title: String,
    message: String,
    moreMessage: String,
    hasBtn: Boolean,
    btnLabel: String,
    btnStyle: {
      type: Object,
      default: () => ({
        icon: 'add',
        color: 'primary',
        outline: true,
        rounded: true
      })
    }
  }
}
</script>
