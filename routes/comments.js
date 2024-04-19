const {
    getCommentById,
  } = require("../controllers/get-controllers");
  const { deleteComment } = require("../controllers/delete-controllers");
const express = require("express")
const router = express.Router()

router.get("/:comment_id", getCommentById);
router.delete("/:comment_id", deleteComment);

module.exports = router