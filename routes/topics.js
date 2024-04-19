const { getTopics } = require("../controllers/get-controllers");
const express = require("express")
const router = express.Router()

router.get("", getTopics);

module.exports = router
