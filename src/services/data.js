import uuidv4 from 'uuid/v4'
import MetaDataBase from 'src/libraries/data/metadata'

export const userMeta = new MetaDataBase({
  defaults: () => ({
    id: uuidv4(),
    firstName: '',
    lastName: ''
  })
})

export const contactMeta = new MetaDataBase({
  defaults: () => ({
    id: uuidv4(),
    firstName: '',
    lastName: '',
    phoneNumber: '',
    isFavorite: false,
    created: Date.now()
  })
})
