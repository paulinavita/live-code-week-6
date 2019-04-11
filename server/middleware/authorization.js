
const Joke = require('../models/joke')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const decoded = verify(req.headers.token)
    Joke
        .findOne({ _id: req.params.id })
        .populate('userId')
        .then((found) => {
            if (found.userId._id === decoded.id) next()
            else res.status(401).json({ message: 'You do not have access to this page!' })
        })
}