const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const seedTestData = require('../db/data/test-data')
const fs = require('fs/promises')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(seedTestData);
  });

afterAll(() => {
    db.end();
});

describe('invalid url', () => {
    test('GET request with an invalid endpoint, should return 404 and a message', () => {
        return request(app).get('/api/notgonnawork').expect(404).then(({error}) => {
            expect(`${error}`).toBe('Error: cannot GET /api/notgonnawork (404)')
        })
    })
})

describe('/api/topics', () => {
    test('GET request should respond 200 and respond with an array of all the topic objects', () => {
        return request(app).get('/api/topics').expect(200).then(({body}) => {
            expect(Array.isArray(body)).toBe(true)
        })
    })
    test('GET request should respond with array containing objects with slug and description properties', () => {
        return request(app).get('/api/topics').expect(200).then(({body}) => {
            body.forEach((object) => {
                expect(object).toHaveProperty('slug')
                expect(object).toHaveProperty('description')
            })
        })
    })
})

describe('/api', () => {
    test('GET request should respond with 200 and an object containing all endpoints with a description', () => {
        return request(app).get('/api').then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
            })
        })
    })
