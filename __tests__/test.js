const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const seedTestData = require('../db/data/test-data')

beforeEach(() => {
    return seed(seedTestData);
  });

afterAll(() => {
    db.end();
});

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