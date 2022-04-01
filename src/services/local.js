import uuidv4 from 'uuid/v4'

export const db = {
  // collection structure:
  // { isCollection, docs: [] }
  collection: (colName) => ({
    get: () => {
      return new Promise(async (resolve, reject) => {
        const collection = localStorage.getItem(colName)
        console.log('collection: ', collection)
        if (collection && collection.isCollection) {
          resolve(collection)
        } else {
          reject('Collection not found')
        }
      })
    },
    where: (...filters) => ({
      get: () => {
        return new Promise(async (resolve, reject) => {

        })
      }
    }),
    doc: (id) => ({
      set: (data) => {
        return new Promise(async (resolve, reject) => {

        })
      }
    }),
    add: (doc) => {
      return new Promise(async (resolve, reject) => {
        if (typeof doc === 'object' && !Array.isArray(doc) && doc !== null) {
          // must be a valid doc (object, not array and null)
          const collection = localStorage.getItem(colName)
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              if (typeof doc === 'object' && !Array.isArray(doc) && doc !== null) {
                // check if id is supplied
                if (doc.id !== null) {
                  if (collection.docs.find(t => t.id === doc.id)) {
                    reject('ID already present in the collection')
                  }
                  localStorage.setItem(colName, { ...collection, docs: [ ...collection.docs, doc ] })
                  resolve(doc)
                } else {
                  console.log('id already present in the collection')
                  const docs = [ ...collection.docs, { id: uuidv4(), ...doc } ]
                  localStorage.setItem(colName, { ...collection, docs })
                  resolve(doc)
                }
              } else {
                reject('Invalid document addition')
              }
            } catch (e) {
              reject(e)
            }
          } else {
            // collection doesnt exist, create it
            localStorage.setItem(colName, { isCollection: true, docs: [ doc ] })
            resolve(doc)
          }
        }
        else {
          // reject for invalid document
          reject('Invalid document addition')
        }
      })
    }
  })
}
