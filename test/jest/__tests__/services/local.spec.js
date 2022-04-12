import uuidv4 from 'uuid/v4'
import { db } from 'src/services/local'

describe('Mount Contact Page', () => {
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

  // -- test cases

  it('test adding the first contact', async () => {
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

  it('test adding the second contact', async () => {
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

  it('test adding the third contact with id', async () => {
    const id = uuidv4()
    await db.collection('contacts').add({ ...contact3, id })
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs[1] to be contact3
        expect(typeof docs[2]).toBe('object')
        expect(docs[2].id).toBe(id)
        expect(docs[2].firstName).toBe(contact3.firstName)
        expect(docs[2].lastName).toBe(contact3.lastName)
        expect(docs[2].phoneNumber).toBe(contact3.phoneNumber)
        expect(docs[2].isFavorite).toBe(contact3.isFavorite)
      })
  })

  it('test db filtering', async () => {
    const id = uuidv4()
    await db.collection('contacts').add({ ...contact3, id })
    await db.collection('contacts').get()
      .then(docs => {
        // expect docs[1] to be contact3
        expect(typeof docs[2]).toBe('object')
        expect(docs[2].id).toBe(id)
        expect(docs[2].firstName).toBe(contact3.firstName)
        expect(docs[2].lastName).toBe(contact3.lastName)
        expect(docs[2].phoneNumber).toBe(contact3.phoneNumber)
        expect(docs[2].isFavorite).toBe(contact3.isFavorite)
      })
  })
})
