const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const users = require("../routes/users")
const scores = require("../routes/scores")

const databaseName = 'aracer-db'
const databaseUser = 'Raphael:aracer123'
const connectionURL = `mongodb+srv://${databaseUser}@aracer.w4nfr.mongodb.net/${databaseName}?retryWrites=true&w=majority` || `mongodb://127.0.0.1:27017/${databaseName}`

const app = express()
const withAuth = require('/middlewares/isAuthorized')

app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json())

app.use("/users", users)
app.use("/scores", scores)

mongoose
    .connect(
        connectionURL,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true},
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log('unable to connect to Db, Error: ' + err)
    )

app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
})

app.listen(port = (process.env.PORT || 3000), function () {
    console.log(`App listening on port ${port}, Database: ${databaseName}`);
});