const db = require("../db/connection");

function fetchArticleById(article_id) {
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
    "SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles";
  if (topic) {
    sqlString += ` WHERE articles.topic = '${topic}'`;
  }
  sqlString += " ORDER BY created_at DESC;";
  return await db.query(sqlString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "topic not found" });
    }
    const articlesArray = rows.map((article) => {
      const article_id = article.article_id;
      return db
        .query(`SELECT SUM(${article_id}) AS comment_count FROM comments`)
        .then((data) => {
          const sum = data.rows[0].comment_count;
          article.comment_count = sum;
          return article;
        });
    })

    return Promise.all(articlesArray).then((resolvedArray) => {
      return resolvedArray;
    });
  })
  .catch((err) => {
    return Promise.reject(err)
})
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
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  incVotesOnArticle,
};
