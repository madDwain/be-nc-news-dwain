const db = require("../db/connection");

function checkIfTopicExists(topic) {
  return db
    .query("SELECT * FROM topics WHERE slug = $1;", [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
}

function fetchArticleById(article_id, query) {
  if (query === 'comment_count') {
    return db
    .query("SELECT COUNT(comment_id) AS comment_count FROM comments WHERE article_id = $1", [article_id])
    .then(({rows}) => {
      return rows[0]
    })
  }
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid article ID" });
      }
      return rows[0];
    });
}

async function fetchAllArticles(topic) {
  let sqlString =
    "SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id;";
  if (topic) {
    await checkIfTopicExists(topic).then(() => {});
  }

  return db
    .query(sqlString)
    .then(() => {
      return db.query(
        "SELECT title FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id"
      );
    })
    .then(() => {
      let sqlString =
        "SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id";

      if (topic) {
        sqlString += ` WHERE topic='${topic}'`;
      }

      sqlString +=
        " GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

      return db.query(sqlString);
    })
    .then(({ rows }) => {
      return rows;
    });
}

function incVotesOnArticle(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article id not found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  incVotesOnArticle,
};
