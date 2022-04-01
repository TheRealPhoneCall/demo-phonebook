<script>
export default {
  name: 'CrudBase',
  data () {
    return {
      acceptDelete: false
    }
  },
  computed: {
    isFormValidated () {
      return this.$refs[this.formName].validate()
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
          this.mixinNotify('Success!', 'positive', `Created ${this.docName}`)
          break
        case 'edit':
          // await this.updateDocModified(payload)
          await this.updateDoc(payload)
          this.mixinNotify('Success!', 'positive', `Updated ${this.docName}`)
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
          // this.backupDoc()
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
