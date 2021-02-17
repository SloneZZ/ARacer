const express = require('express')
const router = express.Router()

const scoreModel = require('../models/score')
const userModel = require('../models/user')
const withAuth = require('../middlewares/isAuthorized')
const jwt = require('express-jwt')

const signature = '*!AR4c3r_?*'

router.get("/allScores", (req, res, next) => {
    scoreModel.find({})
        .then(scores => res.send(scores))
        .catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
})

router.get("/getScore", withAuth, (req, res, next) => {
    const user_email = req.user.user.email

    scoreModel.find({ user_email })
        .then(scores => res.send(scores))
        .catch(err => {
            console.log(err)
            res.status(404).send(err) // Send error code 404 and the error message if something didn't work
        })
})

router.post("/addScore",  withAuth, (req, res, next) => {
    const score = req.body.score
    const playtime = req.body.playtime
    const email = req.user.user.email

    //console.log("user_email: " + req.user.user.email)
    //console.log("User: " + JSON.stringify(req.user, null))

    new scoreModel({
        score: score,
        playtime: playtime,
        user_email: email,
    })
        .save()
        .then(() => res.send("Score successfully added")) // Send back a confirmation that adding the score worked
        .catch(err => {
            console.log(err)
            res.status(404).send(err) // Send error code 404 and the error message if something didn't work
        })
})

module.exports = router;