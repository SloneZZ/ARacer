const jwt = require("jsonwebtoken")
const signature = '*!AR4c3r_?*'

const withAuth = function(req, res, next) {
    const token = req.body.token

    if (!token) {
        res.status(401).send('Unauthorized: no token provided')
    }
    else {
        jwt.verify(token, signature, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: token is invalid')
            }
            else {
                req.email = decoded.email
                //req.firstname = decoded.firstname
                //req.lastname = decoded.lastname
                next()
            }
        })
    }
}

module.exports = withAuth;
