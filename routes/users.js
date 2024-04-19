const { getAllUsers } = require("../controllers/get-controllers");
const express = require("express")
const router = express.Router()

router.get("", getAllUsers);

module.exports = router
