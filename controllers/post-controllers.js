const { 
    insertComment
 } = require('../models/comments-models')

function postComment(req, res, next) {
    const {username} = req.body
    const {body} = req.body
    if (!username || !body) {
        next({status: 400, msg: 'invalid comment object'})
    }
    if (typeof username !== 'string' || typeof body !== 'string') {
        next({status: 400, msg: 'invalid comment passed'})
    }
    const {article_id} = req.params
    return insertComment(username, body, article_id)
    .then((newComment) => {
        res.status(201).send(newComment)
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {
    postComment
}