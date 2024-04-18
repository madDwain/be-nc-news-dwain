const db = require("../db/connection");

function fetchCommentsByArticleID(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article ID" });
      }
      return rows;
    })
    .catch((err) => {
        return Promise.reject(err)
    });
}

function insertComment(username, body, article_id) {
  return db
    .query(
      `INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err)
    });
}

function fetchCommentById(comment_id) {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment id not found" });
      }
      return rows[0];
    });
}

function removeComment(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment id not found" });
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        return Promise.reject({ status: 400, msg: "invalid comment id" });
      }
      return Promise.reject(err);
    });
}

module.exports = {
  fetchCommentsByArticleID,
  insertComment,
  removeComment,
  fetchCommentById,
};
