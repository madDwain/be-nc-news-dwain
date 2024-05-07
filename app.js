const express = require("express");
const { getEndpoints } = require("./controllers/get-controllers");
const cors = require('cors')

const articleRoute = require("./routes/articles");
const commentRoute = require("./routes/comments");
const userRoute = require("./routes/users");
const topicRoute = require("./routes/topics");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoute);
app.use("/api/comments", commentRoute);
app.use("/api/users", userRoute);
app.use("/api/topics", topicRoute);

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "no new vote object" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id type" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "article id not found" });
  }
});
module.exports = app;
