
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        validate: [
            {
                validator: function (input) {
                    return mongoose.model('User', userSchema)
                        .findOne({ _id: { $ne: this._id }, email: input })
                        .then(data => { if (data) return false })
                },
                message: 'Email has been taken'
            }
        ]
    },
    password: String
})


userSchema.pre('save', function (next) {
    if (this.password) {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(this.password, salt)
        this.password = hash
        next()
    }
})

let User = mongoose.model('User', userSchema)
module.exports = User
