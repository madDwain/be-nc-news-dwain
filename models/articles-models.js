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

async function fetchAllArticles() {
  return await db.query("SELECT * FROM articles ORDER BY created_at DESC;").then(({ rows }) => {
    const articlesArray = rows.map((article) => {
      const article_id = article.article_id;
      return db
        .query(`SELECT SUM(${article_id}) AS comment_count FROM comments`)
        .then((data) => {
          const sum = data.rows[0].comment_count;
          article.comment_count = sum;
          return article;
        });
    });

    return Promise.all(articlesArray).then((resolvedArray) => {
      return resolvedArray;
    });
  });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
};
