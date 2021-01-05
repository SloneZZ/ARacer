const express = require('express')
const router = express.Router()

const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const saltRounds = 13; // for bcrypt; TODO: check what this does


router.post("/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find a user via email
    userModel.findOne({ email })
        .then(user => {
            // Check if the user exists
            if (!user) {
                return res.status(404).json({emailnotfound: "Email not found" })
            }
            // Check if the password is correct
            bcrypt.compare(password, user.password).then(passwordCorrect => {
                if (passwordCorrect) {
                    // Password is correct
                    let verifyOptions = {
                        issuer: 'ARacer',
                        subject: user.email,
                        audience: 'https://aracer-db.herokuapp.com/', // ARacer URL
                        expiresIn: "12h",
                        algorithm: "RS256" // Does this matter?
                    }
                    // Payload: user; secretOrPrivateKey: ?; options: verifyOptions, callback: error + token
                    // TODO: get a valid private key
                    jwt.sign({user}, '', verifyOptions, (err, token) => {
                        if (err) throw err
                        res.json({
                            token
                        })
                    })
                }
                else {
                    return res.status(404).json({ passwordincorrect: "Password incorrect, please make sure you haven't made any typos" }) // Notify that the password was incorrect
                }
            })
        })
})

router.post("/login2", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find a user via email
    try {
        const user = await userModel.findOne({ email })
        // Check if the user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found" })
        }
        // Check if the password is correct
        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (passwordCorrect) {
            // Password is correct
            let verifyOptions = {
                issuer: 'ARacer',
                subject: user.email,
                audience: 'https://aracer-db.herokuapp.com/', // ARacer URL
                expiresIn: "12h",
                algorithm: "RS256" // Does this matter?
            }
            // Payload: user; secretOrPrivateKey: ?; options: verifyOptions, callback: error + token
            // TODO: get a valid private key
            jwt.sign({user}, '', verifyOptions, (err, token) => {
                if (err) throw err
                res.json({
                    token
                })
            })
        }
        else {
            return res.status(404).json({ passwordincorrect: "Password incorrect, please make sure you haven't made any typos" }) // Notify that the password was incorrect
        }
    } catch (e) {
        console.log("Error Message: " + e)
        return res.status(404).json({})
    }
    // TODO: .catch
})

router.post("/register", (req, res, next) => {
    const email = req.body.email

    userModel.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(404).json({ email: "Email already exists "})
            }
            else {
                const password = req.body.password

                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) throw err
                    new userModel({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                    })
                        .save()
                        .then(user => res.send(user)) // Send the user back as a confirmation that it worked
                        .catch(err => {
                            console.log(err)
                            res.status(404).send(err) // Send errorcode 404 if something didn't work
                        })
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

router.get("/allUsers", (req, res, next) => { //R
    userModel.find({})
        .then(users => res.send(users))
        .catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
})

router.post("/updateUser", (req, res, next) => {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password // hash?
    let updateFirstname = req.body.updateFirstname
    let updateLastname = req.body.updateLastname
    let updateEmail = req.body.updateEmail
    let updatePassword = req.body.updatePassword

    bcrypt.hash(updatePassword, saltRounds,  (error, hash) => {
        if (err) throw err
        userModel.findOneAndUpdate(
            {firstname, lastname, email, password /* hash? */},
            {firstname: updateFirstname, lastname: updateLastname, email: updateEmail, password: hash}
        )
            .save()
            .then(user => res.send(user))
            .catch(err => {
                console.log(err)
                res.status(404).send(err)
            })
    })
})

router.delete("/deleteUser", (req, res, next) => { //D
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password // hash?

    res.send(userModel.findOneAndDelete({ firstname, lastname, email, password }))
        .then(user => {
            console.log("User successfully deleted")
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(404).send(err);
        })
})

module.exports = router;