const { fetchTopics } = require("../models/topics");

function getTopics(req, res, next) {
  return fetchTopics().then((topics) => {
    res.status(200).send(topics);
  });
}

function getEndpoints(req, res, next) {
    const endpoints = require('../endpoints.json')
    console.log(typeof endpoints)
    res.status(200).send({endpoints})
}

module.exports = {
  getTopics,
  getEndpoints,
};
