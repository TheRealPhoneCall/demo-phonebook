<template>
  <div>
    <q-select
      v-if="type === 'chips'"
      :label="label"
      :filled="filled"
      v-model="checked"
      :options="options"
      use-input
      use-chips
      option-value="id"
      option-label="label"
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      style="width: 100%"
    >
      <template v-if="options" v-slot:option="slot">
        <q-item
          tag="label"
          :active="slot.selected"
          @click="optionClick(slot)"
          active-class="bg-teal-1 text-grey-8"
          clickable
          v-ripple
        >
          <q-item-section v-if="slot.opt.icon" avatar>
            <q-avatar>
              <img :src="slot.opt.icon" size="20px">
            </q-avatar>
          </q-item-section>
          <q-item-section>
          {{ slot.opt.label }}
          </q-item-section>
        </q-item>
      </template>
      <template v-if="checked" v-slot:selected-item="slot">
        <q-chip
          removable
          dense
          :tabindex="slot.tabindex"
          @remove="slot.removeAtIndex(slot.index); optionClick(slot)"
          color="white"
          v-if="optionItem(slot)"
          text-color="secondary"
          class="q-ma-none"
        >
          <q-avatar
            color="secondary"
            v-if="optionItem(slot).icon"
            text-color="white"
          >
            <img :src="optionItem(slot).icon">
          </q-avatar>
          {{ optionItem(slot).label }}
        </q-chip>
        <br />
      </template>
    </q-select>
    <q-field
      v-else
      :filled="filled"
      :label="label"
      stack-label
      bottom-slots
    >
      <q-list link>
        <q-item
          v-for="item in options"
          :key="item.id"
          tag="label"
          v-ripple
          dense
        >
          <q-item-section avatar>
            <q-checkbox
              v-model="checked"
              :val="item.id"
              @input="t => $emit('checked', t)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption>{{ item.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-field>
    <br />
  </div>
</template>

<script>
export default {
  name: 'DwRelatedFieldMulti',
  props: {
    'label': String,
    'options': Array,
    'value': Array,
    'type': String,
    'id-only': Boolean,
    'filled': Boolean,
    'rules': Array
  },
  data () {
    return {
      checked: []
    }
  },
  methods: {
    optionClick (slot) {
      if (!slot.selected) {
        if (this.idOnly) {
          this.checked = [...this.checked, slot.opt.id]
        } else {
          this.checked = [...this.checked, slot.opt]
        }
      }
      else {
        if (this.idOnly) {
          this.checked = this.checked.filter(t => t !== slot.opt.id)
        } else {
          this.checked = this.checked.filter(t => t.id !== slot.opt.id)
        }
      }

      console.log('checked updated', this.checked)
      this.$emit('input', this.checked)
    },
    optionItem (slot) {
      const item = this.options.find(item => item.id === (this.idOnly ? slot.opt : slot.opt.id))
      return item || null
    }
  },
  created () {
    this.checked = this.value ? this.value : []
    console.log('label', this.label)
    console.log('checked', this.checked)
    console.log('options', this.options)
  }
}
</script>
