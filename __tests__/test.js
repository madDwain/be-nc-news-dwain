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
  describe("GET request", () => {
    test("should respond with 200 and an object", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(typeof article).toBe("object");
        });
    });
    test(`should respond with an object containing the folowing properties:author, title, article_id, body, topic, created_at, votes, article_img_url`, () => {
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
    test("should respond with 404 and a msg of invalid article_id if invalid article_id is passed", () => {
      return request(app)
        .get("/api/articles/10000086")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid article ID");
        });
    });
  });
  describe("PATCH request", () => {
    test("should accept an object in the form { inc_votes: newVote }, returning 200 and the updated article", () => {
      const expectedArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 110,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          const article = body;
          expect(article).toEqual(expectedArticle);
        });
    });
    test("should accept an object in the form { inc_votes: newVote }, returning 200 and the updated article if inc_votes is negative", () => {
      const expectedArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 90,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          const article = body;
          expect(article).toEqual(expectedArticle);
        });
    });
    test("should return 400 and a message of no new vote object if not passed a newVote object", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("no new vote object");
        });
    });
    test("should return 404 and a message of article id not found if article id not found", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article id not found");
        });
    });
    test("should return 400 if article id is not a number", () => {
      return request(app)
      .patch("/api/articles/notanumber")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid id type')
      })
    })
    test("should return 400 if inc_votes value is not a number", () => {
      return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 'notanumber' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid id type')
      })
    })
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
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test('GET request with topic=mitch query should respond with an array of objects where the topic is mitch', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .then(({ body }) => {
        const { articles } = body
        articles.forEach((article) => {
            expect(article.topic).toBe('mitch')
        })
    })
  })
  test('GET request with topic=notatopic query should respond with 404 and a msg of topic not found', () => {
    return request(app)
    .get('/api/articles?topic=notatopic')
    .then(({ body }) => {
        expect(body.msg).toBe('topic not found')
    })
  })
});

describe("api/articles/:article_id/comments", () => {
  describe("GET request", () => {
    test("responds with 200 and responds with an array of objects with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .then(({ body }) => {
          const { comments } = body;
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id");
          });
        });
    });
    test("returned array should be ordered with most recent comments first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("should respond with 404 and a msg of invalid article_id if article_id is not found", () => {
      return request(app)
        .get("/api/articles/10000086/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid article ID");
        });
    });
    test("should respond with 400 and a msg of invalid article_id if passed bad request", () => {
      return request(app)
        .get("/api/articles/78787HELLO/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id type");
        });
    });
  });
  describe("POST request", () => {
    test("should respond with 201, accepting an object with username and body properties and respond with the comment object with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      const newComment = {
        username: "icellusedkars",
        body: "W article",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body;
          expect(comment.author).toBe("icellusedkars");
          expect(comment.comment_id).toBe(19);
          expect(comment.votes).toBe(0);
          expect(comment).toHaveProperty("created_at");
          expect(comment.body).toBe("W article");
          expect(comment.article_id).toBe(2);
        });
    });
    test("should respond with 404 and a msg of invalid article_id if article_id is not found", () => {
      const newComment = {
        username: "icellusedkars",
        body: "W article",
      };
      return request(app)
        .post("/api/articles/10000086/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article id not found");
        });
    });
    test("should return with 400 and a msg of article ID is not a number", () => {
      const newComment = {
        username: "icellusedkars",
        body: "W article",
      };
      return request(app)
        .post("/api/articles/100dwain00086/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id type");
        });
    });
    test("should return with 400 and a msg of invalid comment object if the object does not have a username property", () => {
      const newComment = {
        username: "icellusedkars",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid comment object");
        });
    });
    test("should return with 400 and a msg of invalid comment object if the object does not have a body property", () => {
      const newComment = {
        body: "W article",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid comment object");
        });
    });
    test("should return 400 and a msg of invalid comment passed if either body or username is not a string", () => {
      const newComment = {
        body: 12345,
        username: 67890,
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid comment passed");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("GET request", () => {
    test("responds with 200 and an object with the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/comments/2")
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
    });
    test("should respond with 404 and a msg of comment_id not found if comment_id is not found", () => {
      return request(app)
        .get("/api/comments/10000086")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment id not found");
        });
    });
  });
  describe("DELETE request", () => {
    test("responds with status 204", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });
    test("responds with status 404 when comment not found", () => {
      return request(app).delete("/api/comments/1000").expect(404);
    });
    test("responds with status 400 when comment is invalid", () => {
      return request(app)
        .delete("/api/comments/notanumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid id type");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET request", () => {
    test("should respond with 200 and return an array of objects with the following properties: username, name. avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
