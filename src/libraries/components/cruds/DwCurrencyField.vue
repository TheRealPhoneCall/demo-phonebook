<template>
  <q-input
    filled
    v-model="price"
    :debounce="debounce"
    :label="label"
    lazy-rules
    :rules="rules"
    mask="#"
    reverse-fill-mask
    maxlength="9"
  >
    <template v-slot:prepend>
      <q-icon name="money" />
    </template>
    <template v-slot:append>
      <q-btn-dropdown
        auto-close
        flat
        :label="priceCurrency"
        split
      >
        <!-- dropdown content goes here -->
        <q-list
          padding
          style="width: 250px"
        >
          <q-item
            clickable
            v-for="opt in currencyOptions"
            :key="`opt-${opt}`"
            @click="priceCurrency = opt"
          >
            <q-item-label>{{ opt }}</q-item-label>
          </q-item>

        </q-list>
      </q-btn-dropdown>
    </template>
  </q-input>
</template>

<script>

export default {
  name: 'DwCardCarousel',
  props: {
    value: Number,
    currencyOptions: Array,
    rules: Array,
    label: String,
    debounce: Number
  },
  data () {
    return {
      price: 0,
      priceCurrency: 'PHP'
    }
  },
  watch: {
    price (val) {
      this.$emit('input', Number.parseFloat(val))
    }
  },
  created () {
    this.price = this.value
  }
}
</script>
