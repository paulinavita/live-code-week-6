const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = {
    authentication : function (req, res, next) {
        if (req.headers.token) {
            try {
                const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                req.authenticatedUser = decoded
                next()
            } catch (e) {
                res.status(401).json({
                    message : ' Invalid token'
                })
            }
        } else {
            console.log('401 not logged in')
            res.status(401).json({
                message : ' You are not logged in'
            })
        }
    }
}
