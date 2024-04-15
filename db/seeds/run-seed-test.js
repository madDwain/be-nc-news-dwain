const data = require("../data/test-data")
process.env.NODE_ENV = "test"
const seed = require("./seed")
const db = require("../connection.js");

const runSeed = () => {
    return seed(data).then(() => db.end());
  };

runSeed()
