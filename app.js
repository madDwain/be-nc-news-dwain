const express = require("express");
const {
  getCommentsByArticleID,
  getTopics,
  getEndpoints,
  getArticle,
  getAllArticles,
  getCommentById,
  getAllUsers
} = require("./controllers/get-controllers");
const { postComment } = require("./controllers/post-controllers");
const { patchArticle } = require("./controllers/patch-controllers")
const { deleteComment } = require('./controllers/delete-controllers')

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.get("/api/comments/:comment_id", getCommentById)
app.get('/api/users', getAllUsers)

app.post("/api/articles/:article_id/comments", postComment);

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
    res.status(err.status).send(err)
  }
  if (err.code === '23502') {
    res.status(400).send({msg: 'no new vote object'})
  }
  if (err.code === '22P02') {
    res.status(400).send({msg: 'article_id is not a number'})
  }
  if (err.code === '23503') {
    res.status(404).send({msg: 'article id not found'})
  }
});
module.exports = app;
