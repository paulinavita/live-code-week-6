const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const {authentication} = require('../middleware/authentication')
const Joke = require('../models/joke')
const {authorization} = require('../middleware/authorization')

//CEK
router.get('/', (req, res) => {
    res.status(200).json({message : `connected`})
})

//REGISTER
router.post(`/register`,(req, res) => {
    User.create(req.body)
    .then(data => {
        console.log(data, 'created user')
        res.status(201).json(data)
    })
    .catch(err => {
        console.log(err, 'di register')
        res.status(400).json(err)
    })
})


// LOGIN
router.post('/login', (req, res) => {
    User.findOne({email : req.body.email})
    .then(found => {
        if (found) {
            if (!bcrypt.compareSync(req.body.password, found.password)) {
                res.status(400).json({
                    msg: 'Password invalid'
                })
            } else {
                let {email, _id} = found
                let token = jwt.sign({
                    id : _id,
                    email,
                }, process.env.JWT_SECRET)
                console.log('dapat token', token)
                req.headers.token = token
                res.status(200).json({token, email, _id})
            }
        }
        else {
            console.log('sini')
            res.status(400).json({msg : 'No such email'})
        }
    })
    .catch(err =>{
        console.log(err, 'bagian login')
        res.status(400).json(err)
    })
})


// GET JOKES
router.get('/joke', authentication, (req, res) => {
    axios.get(`https://icanhazdadjoke.com/`, 
    {headers : {Accept : 'application/json'}})
    .then(({data}) => {
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(400).json(err)
        console.log(err, 'di get jokes');
    })
})


//ADD TO FAVORITE
router.post('/favorites', authentication,  (req, res) => {
    Joke.create({...req.body, userId : req.authenticatedUser.id })
    .then((created) => {
        res.status(200).json(created)
    })
    .catch((err) => {
        console.log(err, 'di add fave')
        res.status(400).json(err)
    })
})

//GET FAVORITES
router.get('/mine', authentication, (req, res) => {
    Joke.find({})
    .populate('userId')
    .then((data) => {
        let result = data.filter(obj => {return obj.userId._id == req.authenticatedUser.id})
        res.status(400).json(result)
        // console.log(result, 'ada?')
    })
    .catch(err => {
        // console.log(err, 'kenapa error??')
        res.status(400).json(err)
    })
})

//DELETE
router.delete('/favorites/:id'), authentication, authorization, (req,res) => {
    Joke.findOneAndDelete({_id : req.params.id})

    .then(data => {
        res.status.json(data)
    })
    .catch(err => {
        res.status(400).json(err)
    })
}
module.exports = router