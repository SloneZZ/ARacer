const express = require('express')
const router = express.Router()

const scoreModel = require('../models/score')
const userModel = require('../models/user')
const jwt = require('express-jwt')

const signature = '*!AR4c3r_?*'

router.get("/getScore", (req, res, next) => {

})

module.exports = router;