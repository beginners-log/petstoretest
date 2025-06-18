import {
  CONSTANTS,
  petPath,
  headers,
  bodies,
  expectedHeaders,
  invalidBodyObjects,
  invalidValues,
  invalidStatuses,
  irrelevantMethods,
  expectedKeys,
  validStatuses
} from './utils/data.js'

import { deletePetAndVerifyIsDeleted, getRandomId } from './utils/helpers.js'

describe('Pet is updated with valid required request/response', () => {
  let pet
  let responseHeaders

  let updateBody
  let updatedPet

  before(() => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: { ...bodies.requiredBody, id: getRandomId() }
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(1000)

      pet = response.body

      updateBody = {
        id: pet.id,
        name: 'doggie update',
        photoUrls: [
          'https://example.com/dog.jpg',
          'https://example.com/dog_2.jpg'
        ]
      }

      cy.updatePet({
        path: petPath,
        method: 'PUT',
        headers,
        body: updateBody
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.duration).to.be.lessThan(1000)

        updatedPet = response.body
        responseHeaders = response.headers
      })
    })
  })

  it('should have the expected params in response body', () => {
    expect(Object.keys(pet).sort()).to.deep.equal(expectedKeys.required.sort())
  })

  it('should have a valid id', () => {
    expect(updatedPet.id).to.be.eq(updateBody.id)
  })

  it('should have the updated name', () => {
    expect(updatedPet).to.have.property('name', updateBody.name)
    expect(updatedPet.name).to.be.a('string')
  })

  it('should have updated photoUrls', () => {
    expect(updatedPet.photoUrls).to.be.an('array').with.lengthOf(2)
    expect(updatedPet.photoUrls).to.deep.equal(updateBody.photoUrls)

    updatedPet.photoUrls.forEach((url) => {
      expect(url).to.be.a('string')
      expect(url.startsWith(CONSTANTS.validUrlStart)).to.be.true
    })
  })

  it('should include only expected headers with correct values', () => {
    Object.entries(expectedHeaders).forEach(([header, value]) => {
      expect(responseHeaders[header]).to.eq(value)
    })
  })

  it('should find updated pet by id', () => {
    cy.findPetById(petPath, pet.id).then((response) => {
      expect(response.body).to.have.property('id', updateBody.id)
      expect(response.body).to.have.property('name', updateBody.name)
      expect(pet.photoUrls).to.deep.equal(updateBody.photoUrls)

      expect(Object.keys(pet).sort()).to.deep.equal(
        expectedKeys.required.sort()
      )
    })
  })

  after(() => {
    deletePetAndVerifyIsDeleted(petPath, pet.id)
  })
})

describe('Pet is updated with valid full request/response', () => {
  let pet
  let updatedPet
  let updateBody

  before(() => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: { ...bodies.requiredBody, id: getRandomId() }
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(1000)

      pet = response.body

      updateBody = {
        ...bodies.requiredBody,
        id: pet.id,
        category: {
          id: 2,
          name: 'cat'
        },
        tags: [
          {
            id: 2,
            name: 'normal breed'
          }
        ],
        status: 'available'
      }

      cy.updatePet({
        path: petPath,
        method: 'PUT',
        headers,
        body: updateBody
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.duration).to.be.lessThan(1000)

        updatedPet = response.body
      })
    })
  })

  it('should have the correct response keys', () => {
    expect(Object.keys(updatedPet).sort()).to.deep.equal(
      expectedKeys.full.sort()
    )
  })

  it('should keep the not updated params intact', () => {
    expect(updatedPet.id).to.be.eq(pet.id)
    expect(updatedPet.name).to.be.eq(pet.name)
    expect(updatedPet.photoUrls).to.deep.eq(pet.photoUrls)
  })

  it('should have a valid Category param', () => {
    expect(updatedPet).to.have.property('category')
    expect(updatedPet.category).to.be.an('object')

    expect(updatedPet.category).to.deep.equal(updateBody.category)
    expect(updatedPet.category.id).to.be.a('number')

    expect(Number.isInteger(updatedPet.category.id)).to.be.true
    expect(updatedPet.category.id).to.be.within(
      CONSTANTS.minId,
      Number.MAX_SAFE_INTEGER
    )

    expect(updatedPet.category.name).to.be.a('string')
  })

  it('should have a valid Tags param', () => {
    expect(updatedPet).to.have.property('tags')
    expect(updatedPet.tags).to.be.an('array').with.lengthOf(1)

    expect(updatedPet.tags).to.deep.equal(updateBody.tags)
    expect(updatedPet.tags[0].id).to.be.a('number')

    expect(Number.isInteger(updatedPet.tags[0].id)).to.be.true
    expect(updatedPet.tags[0].id).to.be.within(
      CONSTANTS.minId,
      Number.MAX_SAFE_INTEGER
    )

    expect(updatedPet.tags[0].name).to.be.a('string')
  })

  it('should have a valid Status param', () => {
    expect(updatedPet).to.have.property('status')
    expect(updatedPet.status).to.be.a('string')
    expect(validStatuses).to.include(updatedPet.status)
  })

  after(() => {
    deletePetAndVerifyIsDeleted(petPath, pet.id)
  })
})

describe('Negative Scenarios', () => {
  let pet
  const cleanUpIds = []

  before(() => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: { ...bodies.requiredBody, id: getRandomId() }
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(1000)

      pet = response.body
    })
  })

  it('should not allow to update Pet with invalid body', () => {
    invalidBodyObjects.forEach((body) => {
      cy.updatePet({
        failOnStatusCode: false,
        path: petPath,
        method: 'POST',
        headers,
        body: { ...body, id: pet.id }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }
        expect(response.status).to.equal(400)
      })
    })
  })

  it('should not allow to update Pet with method other than PUT', () => {
    irrelevantMethods.forEach((method) => {
      cy.updatePet({
        failOnStatusCode: false,
        path: petPath,
        method: method,
        headers,
        body: { ...bodies.requiredBody, id: pet.id }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }
        expect(response.status).to.equal(405)
      })
    })
  })

  it('should not allow to update Pet with empty headers - no apikey/no content-type', () => {
    cy.updatePet({
      failOnStatusCode: false,
      path: petPath,
      method: 'PUT',
      headers: {},
      body: { ...bodies.requiredBody, id: pet.id }
    }).then((response) => {
      if (response && response.body && response.body.id) {
        cleanUpIds.push(response.body.id)
      }
      expect(response.status).to.equal(405)
    })
  })

  it('should not allow to update Pet with invalid Status', () => {
    invalidStatuses.forEach((invalidStatus) => {
      cy.updatePet({
        failOnStatusCode: false,
        path: petPath,
        method: 'POST',
        headers,
        body: { ...bodies.requiredBody, id: pet.id, status: invalidStatus }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }
        expect(response.status).to.equal(400)
      })
    })
  })

  it('should not allow to create Pet with invalid Tags', () => {
    invalidValues.forEach((invalidTag) => {
      cy.updatePet({
        failOnStatusCode: false,
        path: petPath,
        method: 'POST',
        headers,
        body: { ...bodies.requiredBody, id: pet.id, tags: invalidTag }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }
        expect(response.status).to.equal(400)
      })
    })
  })

  it('should not allow to create Pet with invalid Categories', () => {
    invalidValues.forEach((invalidCategory) => {
      cy.addPet({
        failOnStatusCode: false,
        path: petPath,
        method: 'POST',
        headers,
        body: { ...bodies.requiredBody, id: pet.id, tags: invalidCategory }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }
        expect(response.status).to.equal(400)
      })
    })
  })

  after(() => {
    cleanUpIds.forEach((id) => {
      deletePetAndVerifyIsDeleted(petPath, id)
    })
  })
})
