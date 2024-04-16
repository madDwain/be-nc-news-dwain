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
    });
}

function insertComment(username, body, article_id) {
  return db
    .query(
      `INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3) RETURNING *;`, [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
        if (err.code === '22P02')
        return Promise.reject({status: 400, msg: 'invalid article ID'})
        if (err.code === '23503')
        return Promise.reject({status: 404, msg: 'article ID not found'})
    })
}

module.exports = {
  fetchCommentsByArticleID,
  insertComment,
};
