import uuidv4 from 'uuid/v4'
import { db } from 'src/services/local'

describe('local js module', () => {
  const dummyContacts = [
    {
      firstName: 'Test',
      lastName: 'Contact 1',
      phoneNumber: '+639171501005',
      isFavorite: false,
      created: new Date()
    },
    {
      firstName: 'Test',
      lastName: 'Contact 2',
      phoneNumber: '+639171501006',
      isFavorite: false,
      created: new Date()
    },
    {
      firstName: 'Test',
      lastName: 'Contact 3',
      phoneNumber: '+639171501007',
      isFavorite: false,
      created: new Date()
    }
  ]
  const [ contact1, contact2, contact3 ] = dummyContacts
  let id3 = uuidv4()

  // -- test cases

  test('adding the first contact', async () => {
    await db.collection('contacts').add(contact1)
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs[0] to be contact1
        expect(typeof docs[0]).toBe('object')
        expect(docs[0].firstName).toBe(contact1.firstName)
        expect(docs[0].lastName).toBe(contact1.lastName)
        expect(docs[0].phoneNumber).toBe(contact1.phoneNumber)
        expect(docs[0].isFavorite).toBe(contact1.isFavorite)
      })
  })

  test('adding the second contact', async () => {
    await db.collection('contacts').add(contact2)
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs[1] to be contact2
        expect(typeof docs[1]).toBe('object')
        expect(docs[1].firstName).toBe(contact2.firstName)
        expect(docs[1].lastName).toBe(contact2.lastName)
        expect(docs[1].phoneNumber).toBe(contact2.phoneNumber)
        expect(docs[1].isFavorite).toBe(contact2.isFavorite)
      })
  })

  test('adding the third contact with id', async () => {
    await db.collection('contacts').add({ ...contact3, id: id3 })
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs[1] to be contact3
        expect(typeof docs[2]).toBe('object')
        expect(docs[2].id).toBe(id3)
        expect(docs[2].firstName).toBe(contact3.firstName)
        expect(docs[2].lastName).toBe(contact3.lastName)
        expect(docs[2].phoneNumber).toBe(contact3.phoneNumber)
        expect(docs[2].isFavorite).toBe(contact3.isFavorite)
      })
  })

  test('fetching all docs', async () => {
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs to be all the dummy contacts
        expect(Array.isArray(docs)).toBe(true)
        expect(docs.length).toBe(3)

        const fields = ['firstName', 'lastName', 'phoneNumber', 'isFavorite']
        fields.forEach((field) => {
          expect(docs[0][field]).toBe(contact1[field])
        })
        fields.forEach((field) => {
          expect(docs[1][field]).toBe(contact2[field])
        })
        fields.forEach((field) => {
          expect(docs[2][field]).toBe(contact3[field])
        })
      })
  })

  console.log('id3', id3)
  test('updating contact3 isFavorite using doc set', async () => {
    await db.collection('contacts').doc(id3).set({ isFavorite: true })
      .then(doc => {
        // expect doc[2].isFavorite to be true, and other fields retained
        expect(doc.id).toBe(id3)
        expect(doc.firstName).toBe(contact3.firstName)
        expect(doc.lastName).toBe(contact3.lastName)
        expect(doc.phoneNumber).toBe(contact3.phoneNumber)
        expect(doc.isFavorite).toBe(true) // updated value
      })
  })

  test('fetching docs by filtering isFavorite == true', async () => {
    await db.collection('contacts').where(['isFavorite', '==', true]).get()
      .then(docs => {
        // expect docs to be array containing only contact3
        expect(Array.isArray(docs)).toBe(true)
        expect(docs.length).toBe(1)
        expect(docs[0].id).toBe(id3)
        expect(docs[0].firstName).toBe(contact3.firstName)
        expect(docs[0].lastName).toBe(contact3.lastName)
        expect(docs[0].phoneNumber).toBe(contact3.phoneNumber)
        expect(docs[0].isFavorite).toBe(true) // updated value
      })
  })

  test('fetching docs by filtering isFavorite != true', async () => {
    await db.collection('contacts').where(['isFavorite', '!=', true]).get()
      .then(docs => {
        // expect docs to be array containing [contact1, contact2]
        expect(Array.isArray(docs)).toBe(true)
        expect(docs.length).toBe(2)

        const fields = ['firstName', 'lastName', 'phoneNumber', 'isFavorite']
        fields.forEach((field) => {
          expect(docs[0][field]).toBe(contact1[field])
        })
        fields.forEach((field) => {
          expect(docs[1][field]).toBe(contact2[field])
        })
      })
  })
})
