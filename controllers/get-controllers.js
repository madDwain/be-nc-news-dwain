const { fetchTopics } = require("../models/topics-models");
const { fetchArticleById,
fetchAllArticles } = require("../models/articles-models");
const { fetchCommentsByArticleID } = require("../models/comments-models")

function getTopics(req, res, next) {
  return fetchTopics().then((topics) => {
    res.status(200).send(topics);
  });
}

function getEndpoints(req, res, next) {
  const endpoints = require("../endpoints.json");
  res.status(200).send({ endpoints });
}

function getArticle(req, res, next) {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  return fetchAllArticles()
  .then((articles) => {
    res.status(200).send( {articles} )
  })
}

function getCommentsByArticleID(req, res, next) {
  const { article_id } = req.params
  const regex = /[^0-9]/
  if (regex.test(article_id)) {
    next({status: 400, msg: 'article_id is not a number'})
  }
  return fetchCommentsByArticleID(article_id).then((comments) => {
    res.status(200).send( {comments} )
  })
  .catch((err) => {
    next(err)
  })
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticle,
  getAllArticles,
  getCommentsByArticleID
};
