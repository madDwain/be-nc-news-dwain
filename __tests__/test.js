const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const seedTestData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(seedTestData);
});

afterAll(() => {
  db.end();
});

describe("invalid url", () => {
  test("GET request with an invalid endpoint, should return 404 and a message", () => {
    return request(app)
      .get("/api/notgonnawork")
      .expect(404)
      .then(({ error }) => {
        expect(`${error}`).toBe("Error: cannot GET /api/notgonnawork (404)");
      });
  });
});

describe("/api/topics", () => {
  test("GET request should respond 200 and respond with an array of all the topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });
  test("GET request should respond with array containing objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((object) => {
          expect(object).toHaveProperty("slug");
          expect(object).toHaveProperty("description");
        });
      });
  });
});

describe("/api", () => {
  test("GET request should respond with 200 and an object containing all endpoints with a description", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET request should respond with 200 and an object", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article).toBe("object");
      });
  });
  test(`GET request should respond with an object containing the folowing properties:author, title, article_id, body, topic, created_at, votes, article_img_url`, () => {
    return request(app)
      .get("/api/articles/4")
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article.article_id).toBe(4);
      });
  });
  test("GET request should respond with 404 and a msg of invalid article_id if invalid article_id is passed", () => {
    return request(app)
      .get("/api/articles/10000086")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid article ID");
      });
  });
});

describe("/api/articles", () => {
  test("GET request should respond with 200 and an array of objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  test("GET request should return with array of objects which have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          const { articles } = body;
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("GET request should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('created_at', {descending : true});
      });
  });
});
