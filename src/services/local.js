import uuidv4 from 'uuid/v4'

export const db = {
  // collection structure:
  // { isCollection, name, docs: [] }
  collection: (colName) => ({
    get: () => {
      return new Promise(async (resolve, reject) => {
        const collection = JSON.parse(localStorage.getItem(colName))
        console.log('collection: ', collection)
        if (collection && collection.isCollection) {
          resolve(collection.docs)
        } else {
          reject('Collection not found')
        }
      })
    },
    where: (...filters) => ({
      get: () => {
        return new Promise(async (resolve, reject) => {
          const collection = JSON.parse(localStorage.getItem(colName))
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              let filteredDocs = collection.docs
              console.log('where filters', filters)
              filters.forEach(arg => {
                const [key, logic, val] = arg
                filteredDocs = filteredDocs.filter(t => {
                  switch (logic) {
                    case '==': return t[key] === val
                    case '!=': return t[key] !== val
                    case '>=': return t[key] >= val
                    case '>': return t[key] > val
                    case '<': return t[key] < val
                    case '<=': return t[key] <= val
                    case 'in': return val.includes(t[key])
                  }
                })
              })
              console.log('filtered docs', filteredDocs)
              resolve(filteredDocs)
            } catch (e) { reject(e) }
          } else {
            reject('Collection not found')
          }
        })
      }
    }),
    doc: (id) => ({
      set: (data) => {
        return new Promise(async (resolve, reject) => {
          const collection = JSON.parse(localStorage.getItem(colName))
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              let docIdx = collection.docs.findIndex(t => t.id === id)
              if (docIdx > -1) {
                collection.docs[docIdx] = data
                const value = JSON.stringify(collection)
                localStorage.setItem(colName, value)
                resolve(data)
              } else { reject('Document not found') }
            } catch (e) {
              reject(e)
            }
          } else { reject('Collection does not exist') }
        })
      },
      get: () => {
        return new Promise(async (resolve, reject) => {
          const collection = JSON.parse(localStorage.getItem(colName))
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              let doc = collection.docs.find(t => t.id === id)
              if (doc) {
                resolve(doc)
              } else {
                reject('Document not found')
              }
            } catch (e) { reject(e) }
          } else { reject('Collection does not exist') }
        })
      },
      delete: () => {
        return new Promise(async (resolve, reject) => {
          const collection = JSON.parse(localStorage.getItem(colName))
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              const filteredDocs = collection.docs.filter(t => t.id !== id)
              const value = JSON.stringify({ ...collection, docs: filteredDocs })
              localStorage.setItem(colName, value)
            } catch (e) { resolve(e) }
          } else { reject('Collection does not exist') }
        })
      }
    }),
    add: (doc) => {
      return new Promise(async (resolve, reject) => {
        if (typeof doc === 'object' && !Array.isArray(doc) && doc !== null) {
          // must be a valid doc (object, not array and null)
          const collection = JSON.parse(localStorage.getItem(colName))
          console.log('collection: ', collection)
          if (collection && collection.isCollection) {
            try {
              if (typeof doc === 'object' && !Array.isArray(doc) && doc !== null) {
                // check if id is supplied
                if (doc.id) {
                  if (collection.docs.find(t => t.id === doc.id)) {
                    reject('ID already present in the collection')
                  }
                  const value = JSON.stringify({ ...collection, docs: [ ...collection.docs, doc ] })
                  localStorage.setItem(colName, value)
                  resolve(doc)
                } else {
                  console.log('Setting new id for the document')
                  const newDoc = { id: uuidv4(), ...doc }
                  const value = JSON.stringify({ ...collection, docs: [ ...collection.docs, newDoc ] })
                  localStorage.setItem(colName, value)
                  resolve(newDoc)
                }
              } else {
                reject('Invalid document addition')
              }
            } catch (e) {
              reject(e)
            }
          } else {
            // collection doesnt exist, create it
            const newDoc = { id: uuidv4(), ...doc }
            const value = JSON.stringify({ isCollection: true, name: colName, docs: [ newDoc ] })
            localStorage.setItem(colName, value)
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
