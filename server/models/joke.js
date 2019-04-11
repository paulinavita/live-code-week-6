const mongoose = require('mongoose')

const jokeSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    joke : {
        type : String
    },
    jokeId : {
        type: String
    }
})

const Joke = mongoose.model('Joke', jokeSchema)
module.exports = Joke