<script>
export default {
  name: 'DwCrudBase',
  data () {
    return {
      acceptDelete: false
    }
  },
  computed: {
    isFormValidated () {
      return this.$refs[this.formName].validate()
    },
    collectionUrl () {
      return `/admin/pages/${this.id}/admin-database/${this.docName}`
    },
    submitSuccessUrl () {
      return this.collectionUrl
    },
    isNotDel () {
      return this.operation !== 'delete'
    },
    operationText () {
      switch (this.operation) {
        case 'create':
          return 'Create'
        case 'edit':
          return 'Edit'
        case 'delete':
          return 'Delete'
        default:
          return 'Create'
      }
    }
  },
  methods: {
    async submitPayload (payload) {
      switch (this.operation) {
        case 'create':
          await this.createDoc(payload)
          break
        case 'edit':
          await this.updateDocModified(payload)
          break
      }

      this.$router.push(this.submitSuccessUrl)
    },
    async onDelete (payload) {
      await this.deleteDoc(this.itemId)
      this.$router.push(this.submitSuccessUrl)
    },
    async initFormData (payload) {
      switch (this.operation) {
        case 'create':
          console.log('create mode')
          this.setDoc(payload)
          this.labelStatus = 'Choose the Current Status'
          break
        case 'edit':
          console.log('edit mode')
          await this.retrieveDoc(this.itemId)
          this.backupDoc()
          break
        case 'delete':
          console.log('delete mode')
          await this.retrieveDoc(this.itemId)
          break
      }
    }
  }
}
</script>
