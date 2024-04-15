const {fetchTopics} = require('../models/topics')

function getTopics(req, res ,next) {
    return fetchTopics().then((topics) => {
        res.status(200).send(topics)
    } )
}

module.exports = {
    getTopics
}