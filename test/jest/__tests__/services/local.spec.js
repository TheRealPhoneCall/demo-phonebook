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

  // test cases
  it('test adding and getting contacts collection', async () => {
    const contact1 = dummyContacts[0]
    await db.collection('contacts').add(contact1)
    await db.collection('contacts').get()
      .then(docs => {
        expect(typeof docs[0]).toBe('object')
        expect(docs[0].firstName).toBe(contact1.firstName)
        expect(docs[0].lastName).toBe(contact1.lastName)
        expect(docs[0].phoneNumber).toBe(contact1.phoneNumber)
        expect(docs[0].isFavorite).toBe(contact1.isFavorite)
      })
  })
})
