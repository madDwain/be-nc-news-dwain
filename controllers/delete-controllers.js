const { removeComment } = require('../models/comments-models')

function deleteComment(req, res, next) {
    const {comment_id} = req.params
    return removeComment(comment_id).then((err) => {
        if (err) {
            return Promise.reject(err)
        }
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}


module.exports = {
    deleteComment
}