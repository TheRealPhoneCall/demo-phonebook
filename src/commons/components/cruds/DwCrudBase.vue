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
    submitSuccessUrl () {
      return `/${this.userType}/db/${this.colName}`
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
          await this.updateDoc(payload)
          break
        case 'delete':
          await this.deleteDoc(this.id)
          break
      }

      this.$router.push(this.submitSuccessUrl)
    },
    async initFormData (payload) {
      console.log(this.$route.path, this.operation, this.id)
      console.log(this.$route.params)

      switch (this.operation) {
        case 'create':
          console.log('create mode')
          this.setDoc(payload)
          this.labelStatus = 'Choose the Current Status'
          break
        case 'edit':
        case 'delete':
          console.log('edit/delete mode')
          await this.retrieveDocFromPrototype({
            id: this.id,
            prototype: payload
          })
          break
      }
    }
  }
}
</script>
