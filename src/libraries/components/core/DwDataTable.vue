<template>
  <div class="row">

    <div class="text-h5">
      <slot name="header"></slot>
    </div>
    <q-space></q-space>
    <div class="q-mr-md">
      <q-input
        dense
        v-model="filter"
        @input="searchFilter"
        debounce="300"
        placeholder="Search Name"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <slot name="header-button"></slot>
    <q-table
      :data="data"
      :columns="column"
      flat
      :dense="$q.screen.lt.lg"
      :row-key="rowKey"
      class="col-12 q-mt-sm"
      :loading="tableLoading"
    >
      <template v-slot:body-cell-id="props">
        <q-td
          class="q-gutter-xs"
          :props="props"
        >
          <slot
            name="data-button"
            v-bind:props="props"
          ></slot>
        </q-td>
      </template>
      <template v-slot:body-cell-advSoaRating="props">
        <q-td :props="props">
          <q-rating
            size="1em"
            readonly
            :value="props.row.advSoaRating || 0"
            icon="star_border"
            icon-selected="star"
            color="primary"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-qmSoaRating="props">
        <q-td :props="props">
          <q-rating
            size="1em"
            readonly
            :value="props.row.qmSoaRating || 0"
            icon="star_border"
            icon-selected="star"
            color="primary"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'DwDataTable',
  props: {
    "data": Array,
    "column": Array,
    "loading": Boolean,
    "rowKey": String
  },
  data () {
    return {
      filter: '',
      tableLoading: false
    }
  },
  methods: {
    async searchFilter () {
      this.tableLoading = true
      await setTimeout(() => {
        this.$emit('searchText', this.filter)
        this.tableLoading = false
      }, 500)
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
