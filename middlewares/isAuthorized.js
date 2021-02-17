const jwt = require("jsonwebtoken")
const signature = '*!AR4c3r_?*'

const withAuth = function(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        res.status(401).send('Unauthorized: no token provided')
    }
    else {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, signature, function(err, user) {
            if (err) {
                res.status(401).send('Unauthorized: token is invalid')
            }
            else {
                req.user = user
                next()
            }
        })
    }
}

module.exports = withAuth;

