<script>
// source(s):
//   https://quasar.dev/vue-components/uploader#Supporting-other-services
//   https://gist.github.com/razbakov/378caedba3f24e3d8336442182528719
//   https://forum.quasar-framework.org/topic/3956/a-working-qfirebaseuploader-component

import { QUploaderBase } from 'quasar'
import firebase from 'firebase/app'
import 'firebase/storage'
import uuidv4 from 'uuid/v4'
export default {
  name: 'DwFbUploader',
  mixins: [QUploaderBase],
  props: ['metadata', 'autoremove'],
  data () {
    return {
      progressUpload: 0,
      file: File,
      uploadTasks: [],
      uploading: false
    }
  },
  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading () {
      return this.uploading
    }

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    // isBusy () {
    //   return this.uploading
    // }
  },
  methods: {
    // [REQUIRED]
    // abort and clean up any process
    // that is in progress
    abort () {
      this.uploadTasks.forEach(uploadTask => {
        uploadTask.cancel()
      })
      this.uploading = false
    },
    // [REQUIRED]
    upload () {
      console.log('this: ', this)
      if (this.canUpload === false) {
        return
      }

      this.uploadedSize = 0
      this.uploading = true

      this.files.forEach(file => {
        const { name } = file
        let ext = name.split('.')
        ext = ext[ext.length - 1]

        let uploadedSize = 0
        const ref = `media/${uuidv4()}.${ext}`
        const uploadTask = firebase
          .storage()
          .ref()
          .child(ref)
          .put(file, this.metadata)
        this.uploadTasks.push(uploadTask)
        uploadTask.on(
          'state_changed',
          sp => {
            this.uploadedSize += sp.bytesTransferred - uploadedSize
            uploadedSize = sp.bytesTransferred
            this.__updateFile(file, 'uploading', sp.bytesTransferred)
          },
          error => {
            this.__updateFile(file, 'failed')
            this.uploading = false
            console.log(error)
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.__updateFile(file, 'uploaded')
              this.$emit('upload', {
                url: downloadURL,
                id: ref,
                name: file.name,
                size: file.size,
                uploadedDate: new Date(),
                lastModified: file.lastModified,
                description: ''
              })

              this.uploading = false
              if (this.autoremove) this.removeFile(file)
            })
          }
        )
      })
      console.log('ut: ', this.uploadTasks)
    }
  },
  created () {
    this.uploading = false
  }
}
</script>
