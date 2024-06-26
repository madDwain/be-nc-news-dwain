const { fetchTopics } = require("../models/topics-models");
;
const {
  fetchCommentsByArticleID,
  fetchCommentById,
} = require("../models/comments-models");
const { fetchUsers } = require("../models/users-models");
const { fetchArticleById,
  fetchAllArticles } = require('../models/articles-models')


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
  const { topic } = req.query;
  const { sort_by } = req.query
  const { order } = req.query
  return fetchAllArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentsByArticleID(req, res, next) {
  const { article_id } = req.params;
  return fetchCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function getCommentById(req, res, next) {
  const { comment_id } = req.params;
  return fetchCommentById(comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllUsers(req, res, next) {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticle,
  getAllArticles,
  getCommentsByArticleID,
  getCommentById,
  getAllUsers,
};
