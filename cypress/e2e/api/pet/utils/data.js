import * as dev from '../../../../../config/dev.json'
import * as routes from '../../../../../config/routes.json'

export const CONSTANTS = {
  minId: 1,
  validUrlStart: 'https://'
}

export const expectedKeys = {
  required: ['id', 'name', 'photoUrls'],
  full: ['id', 'name', 'photoUrls', 'category', 'tags', 'status']
}

export const validStatuses = ['available', 'pending', 'sold']
export const petPath = `${dev.baseUrl}${routes.v2.pet}`

export const headers = {
  'Content-Type': 'application/json',
  accept: 'application/json',
  api_key: dev.env.api_key
}

export const bodies = {
  requiredBody: {
    name: 'doggie',
    photoUrls: ['https://example.com/dog.jpg']
  },
  fullBody: {
    category: {
      id: 2,
      name: 'cat'
    },
    name: 'Tom',
    photoUrls: [],
    tags: [
      {
        id: 2,
        name: 'normal breed'
      }
    ],
    status: 'available'
  }
}

export const expectedHeaders = {
  'access-control-allow-headers': 'Content-Type, api_key, Authorization',
  'access-control-allow-methods': 'GET, POST, DELETE, PUT',
  'access-control-allow-origin': '*',
  'content-type': 'application/json'
}

export const invalidBodyObjects = [
  {},
  { hello: 123 },
  { name: [] },
  { name: 'doggie' },
  {
    name: 'superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname_superlongname__superlongname_superlongname_superlongname_superlongname'
  },
  { name: 'doggie', photoUrls: [123] },
  { name: 'doggie', photoUrls: [{}] },
  { name: 'doggie', photoUrls: [] },
  {
    name: '                ',
    photoUrls: ['              ']
  },
  null,
  '',
  false
]

export const invalidValues = [
  'nice',
  '',
  undefined,
  null,
  [],
  [{}],
  {},
  [{ hello: false }],
  123,
  false
]

export const invalidStatuses = ['nice', '', undefined, null, [], {}, 123, false]

export const irrelevantMethods = ['GET', 'PATCH']
