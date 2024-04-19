const {
  getCommentsByArticleID,
  getArticle,
  getAllArticles,
} = require("../controllers/get-controllers");
const { postComment } = require("../controllers/post-controllers");
const { patchArticle } = require("../controllers/patch-controllers");
const express = require("express");
const router = express.Router();

router.get("/:article_id", getArticle);
router.get("", getAllArticles);
router.get("/:article_id/comments", getCommentsByArticleID);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", patchArticle);

module.exports = router;
