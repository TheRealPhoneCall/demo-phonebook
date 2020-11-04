<template>
  <div>
    <q-card-section class="col justify-center">
      <q-table
        :title="title"
        :data="data"
        :columns="columns"
        row-key="fileURL"
      >
        <template v-slot:body="props">
          <q-tr
            v-if="!props.row.header"
            :props="props"
          >
            <q-td
              key="fileName"
              :props="props"
            >
              {{ props.row.fileName }}
            </q-td>
            <q-td
              key="fileCreated"
              :props="props"
            >
              {{ props.row.fileCreated }}
            </q-td>
            <q-td
              key="fileUpdate"
              :props="props"
            >
              {{ props.row.fileUpdate }}
            </q-td>
            <q-td
              key="fileSize"
              :props="props"
            >
              {{ props.row.fileSize }}
            </q-td>
            <q-td>
              <div class="row no-wrap justify-center">
                <q-btn
                  icon="visibility"
                  size="sm"
                  flat
                  dense
                  @click="view(props.row)"
                />
                <q-btn
                  icon="close"
                  size="sm"
                  flat
                  dense
                  @click="remove(props.row)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <dw-fb-uploader
        label="Upload"
        :metadata="metadata"
        :autoremove="true"
        @upload="addImage"
        multiple
        style="width: 100%"
      />
    </q-card-section>
  </div>

</template>

<script>
import DwFbUploader from '../core/DwFbUploader'
import { removeFbFile } from '../../store/helpers/removeFbFiles'

export default {
  name: 'DwFileFieldMulti',
  components: { DwFbUploader },
  props: ['title', 'value'],
  data: () => ({
    metadata: {},
    columns: [
      { name: 'fileName', align: 'center', label: 'Name', field: 'fileName', sortable: false },
      { name: 'fileCreated', align: 'center', label: 'Created', field: 'fileCreated', sortable: false },
      { name: 'fileUpdate', align: 'center', label: 'Update', field: 'fileUpdate', sortable: false },
      { name: 'fileSize', align: 'center', label: 'Size', field: 'fileSize', sortable: false }
    ],
    data: []
  }),
  methods: {
    removeFbFile,

    // source: https://stackoverflow.com/a/18650828
    formatBytes (bytes, decimals) {
      if (bytes === 0) return '0 Bytes'
      var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    convNumDate (nd) {
      var dt = new Date(nd)
      return dt.toDateString()
    },

    addImage (item) {
      console.log('uploaded: ', item)
      let newItem = {
        fileURL: item.url,
        fileId: item.id,
        fileName: item.name,
        fileCreated: item.uploadedDate.toDateString(),
        fileUpdate: this.convNumDate(item.lastModified),
        fileSize: this.formatBytes(item.size)
      }
      this.data = [...this.data, newItem]
      this.$emit('input', this.data)
    },
    view (rowItem) {
      console.log('view: ', rowItem)
    },
    remove (rowItem) {
      this.data = this.data.filter(t => t.fileId !== rowItem.fileId)
      this.removeFbFile(rowItem.fileId)
      this.$emit('input', this.data)
    }
  },
  created () {
    console.log('value: ', this.value)
    if (this.value && this.value.length) {
      this.data = this.value
    }
  }
}
</script>

<style>
</style>
