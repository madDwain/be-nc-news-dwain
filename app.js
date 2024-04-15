const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get('/api', getEndpoints)

app.use((err, req, res, next) => {
    console.log('in app')
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: 'path not found :(' });
  } else next(err);
});

module.exports = app;
