const express = require("express");
const { getTopics, getEndpoints, getArticle } = require("./controllers/get-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticle)


module.exports = app;
