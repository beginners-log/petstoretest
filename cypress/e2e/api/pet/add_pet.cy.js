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

import { deletePetAndVerifyIsDeleted } from './utils/helpers'

describe('Pet is created with valid required request/response', () => {
  let pet
  let responseHeaders

  before(() => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: bodies.requiredBody
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(1000)

      pet = response.body
      responseHeaders = response.headers
    })
  })

  it('should have the correct response keys', () => {
    expect(Object.keys(pet).sort()).to.deep.equal(expectedKeys.required.sort())
  })

  it('should have a valid id', () => {
    expect(pet.id).to.be.a('number')
    expect(Number.isInteger(pet.id)).to.be.true
    expect(pet.id).to.be.within(CONSTANTS.minId, Number.MAX_SAFE_INTEGER)
  })

  it('should have the correct name', () => {
    expect(pet).to.have.property('name', bodies.requiredBody.name)
    expect(pet.name).to.be.a('string')
  })

  it('should have valid photoUrls', () => {
    expect(pet.photoUrls).to.be.an('array').with.lengthOf(1)
    expect(pet.photoUrls).to.deep.equal(bodies.requiredBody.photoUrls)

    pet.photoUrls.forEach((url) => {
      expect(url).to.be.a('string')
      expect(url.startsWith(CONSTANTS.validUrlStart)).to.be.true
    })
  })

  it('should include only expected headers with correct values', () => {
    Object.entries(expectedHeaders).forEach(([key, expectedValue]) => {
      expect(responseHeaders).to.have.property(key)
      expect(responseHeaders[key]).to.include(expectedValue)
    })
  })

  it('should find pet by created id', () => {
    cy.findPetById(petPath, pet.id).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.id).to.have.property('id', pet.id)
      expect(response.body.name).to.have.property(
        'name',
        bodies.requiredBody.name
      )
      expect(pet.photoUrls).to.deep.equal(bodies.requiredBody.photoUrls)

      expect(Object.keys(pet).sort()).to.deep.equal(
        expectedKeys.required.sort()
      )
    })
  })

  after(() => {
    deletePetAndVerifyIsDeleted(petPath, pet.id)
  })
})

describe('Pet is created with valid full request/response', () => {
  let pet

  before(() => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: bodies.fullBody
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.duration).to.be.lessThan(1000)

      pet = response.body
    })
  })

  it('should have the correct response keys', () => {
    expect(Object.keys(pet).sort()).to.deep.equal(expectedKeys.full.sort())
  })

  it('should have a valid Category param', () => {
    expect(pet).to.have.property('category')
    expect(pet.category).to.be.an('object')

    expect(pet.category).to.deep.equal(bodies.fullBody.category)
    expect(pet.category.id).to.be.a('number')

    expect(Number.isInteger(pet.category.id)).to.be.true
    expect(pet.category.id).to.be.within(
      CONSTANTS.minId,
      Number.MAX_SAFE_INTEGER
    )

    expect(pet.category.name).to.be.a('string')
  })

  it('should have a valid Tags param', () => {
    expect(pet).to.have.property('tags')
    expect(pet.tags).to.be.an('array').with.lengthOf(1)

    expect(pet.tags).to.deep.equal(bodies.fullBody.tags)
    expect(pet.tags[0].id).to.be.a('number')

    expect(Number.isInteger(pet.tags[0].id)).to.be.true
    expect(pet.tags[0].id).to.be.within(
      CONSTANTS.minId,
      Number.MAX_SAFE_INTEGER
    )

    expect(pet.tags[0].name).to.be.a('string')
  })

  it('should have a valid Status param', () => {
    expect(pet).to.have.property('status')
    expect(pet.status).to.be.a('string')
    expect(validStatuses).to.include(pet.status)
  })

  after(() => {
    deletePetAndVerifyIsDeleted(petPath, pet.id)
  })
})

describe('Negative Scenarios', () => {
  const cleanUpIds = []

  it('should not be able to update existing Pet with POST by passing existing Pet id', () => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers,
      body: bodies.requiredBody
    }).then((response) => {
      expect(response.status).to.equal(200)

      if (response && response.body && response.body.id) {
        cleanUpIds.push(response.body.id)
      }

      const petId = response.body.id
      const updatedPetName = 'UPDATED DOGGIE'

      const bodyForUpdate = {
        ...bodies.requiredBody,
        id: petId,
        name: updatedPetName
      }

      cy.addPet({
        path: petPath,
        method: 'POST',
        headers,
        body: bodyForUpdate
      }).then((response) => {
        expect(response.status).to.equal(405)

        expect(response.body.name).to.not.be(updatedPetName)
      })
    })
  })

  it('should not allow to create Pet with invalid body', () => {
    invalidBodyObjects.forEach((body) => {
      cy.addPet({
        path: petPath,
        method: 'POST',
        headers,
        body
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }

        expect(response.status).to.equal(400)
      })
    })
  })

  it('should not allow to create Pet with method other than POST', () => {
    irrelevantMethods.forEach((method) => {
      cy.addPet({
        path: petPath,
        method: method,
        headers,
        body: { ...bodies.requiredBody }
      }).then((response) => {
        if (response && response.body && response.body.id) {
          cleanUpIds.push(response.body.id)
        }

        expect(response.status).to.equal(405)
      })
    })
  })

  it('should not allow to create Pet with empty headers - no api_key/no content-type', () => {
    cy.addPet({
      path: petPath,
      method: 'POST',
      headers: {},
      body: bodies.requiredBody
    }).then((response) => {
      if (response && response.body && response.body.id) {
        cleanUpIds.push(response.body.id)
      }
      expect(response.status).to.equal(405)
    })
  })

  it('should not allow to create Pet with invalid Status', () => {
    invalidStatuses.forEach((invalidStatus) => {
      const body = { ...bodies.requiredBody, status: invalidStatus }

      cy.addPet({
        path: petPath,
        method: 'POST',
        headers,
        body
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
      const body = { ...bodies.requiredBody, tags: invalidTag }

      cy.addPet({
        path: petPath,
        method: 'POST',
        headers,
        body
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
      const body = { ...bodies.requiredBody, tags: invalidCategory }

      cy.addPet({
        path: petPath,
        method: 'POST',
        headers,
        body
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
