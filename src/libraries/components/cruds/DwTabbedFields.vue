<template>
  <div>
    <q-tabs
      v-model="tab"
      align="left"
      inline-label
      no-caps
      dense
      class="text-primary"
    >
      <q-tab
        v-for="tab in tabsMeta"
        :key="`tab-${tab.name}`"
        :name="tab.name"
        :label="tab.label"
      />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel
        v-for="tab in tabsMeta"
        :key="`panel-${tab.name}`"
        :name="tab.name"
        :label="tab.label"
      >
        <div class="text-bold">{{ tab.title }}</div>
        <br/>
        <q-field
          v-model="field()"
          :debounce="tab.debounce"
          lazy-rules
          :rules="tab.rules"
        >
          <q-editor
            dense
            :mid-height="tab.midHeight"
            v-model="desc"
            class="fit text-black"
          />
        </q-field>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
// TODO: Unfinished....or nevermind!
export default {
  name: 'DwTabbedFields',
  props: {
    tabDefault: String,
    tabsMeta: Array

  },
  data () {
    return {
      tab: null

    }
  },
  computed: {
    field (param) {
      get (param) {

      },
      set () {

      }
    }
  },
  methods: {

  },
  created () {
    this.tab = this.tabDefault
  }
}
</script>

<style>

</style>