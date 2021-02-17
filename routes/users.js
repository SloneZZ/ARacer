const express = require('express')
const router = express.Router()

const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const saltRounds = 13; // for bcrypt; TODO: check what this does
const signature = '*!AR4c3r_?*'

router.post("/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find a user via email
    const user = userModel.findOne({ email })
        .then(user => {
            // Check if the user exists
            if (!user) {
                return res.status(404).send("User not found")
            }
            // Check if the password is correct
            bcrypt.compare(password, user.password).then(passwordCorrect => {
                if (passwordCorrect) {
                    // Password is correct -> create a JWT
                    let verifyOptions = {
                        expiresIn: "12h",
                    }
                    // Payload: user; secretOrPrivateKey: *!AR4c3r_?*'; options: verifyOptions, callback: error + token
                    jwt.sign({ user,}, signature, verifyOptions, (err, token) => {
                        res.send({
                            token: token,
                            message: `Successfully logged in, hello ${user.firstname}`
                        })
                    })
                }
                else {
                    return res.status(404).send("Username or Password incorrect") // Notify that the password was incorrect
                }
            })
        })
})

router.post("/register", (req, res, next) => {
    const email = req.body.email

    userModel.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(404).send("Email already exists")
            }
            else {
                const password = req.body.password

                bcrypt.hash(password, saltRounds, (err, hash) => {
                    new userModel ({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                    })
                    .save()
                    .then(() => res.send("User successfully created")) // Send back a confirmation that registering worked
                    .catch(err => {
                        console.log(err)
                        res.status(404).send(err) // Send error code 404 and the error message if something didn't work
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
            res.status(404).send(err) // Send error code 404 and the error message if something didn't work
        })
})

router.post("/updateUser", (req, res, next) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email

    const updateFirstname = req.body.updateFirstname
    const updateLastname = req.body.updateLastname
    const updateEmail = req.body.updateEmail
    const updatePassword = req.body.updatePassword

    bcrypt.hash(updatePassword, saltRounds,  (err, hash) => {
        if (err) throw err
        userModel.findOneAndUpdate(
            {firstname, lastname, email},
            {firstname: updateFirstname, lastname: updateLastname, email: updateEmail, password: hash},
            {new: true} // returns the updates fields instead of the old ones
        )
            .then(user => res.send(user))
            .catch(err => {
                console.log(err)
                res.status(404).send(err)
            });
    })
})

router.delete("/deleteUser", (req, res, next) => { //D
    // const firstname = req.body.firstname
    // const lastname = req.body.lastname
    const email = req.body.email

    userModel.findOneAndDelete({ email: email })
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