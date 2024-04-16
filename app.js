const express = require("express");
const {
  getCommentsByArticleID,
  getTopics,
  getEndpoints,
  getArticle,
  getAllArticles,
} = require("./controllers/get-controllers");
const { postComment } = require("./controllers/post-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send(err);
});
module.exports = app;
