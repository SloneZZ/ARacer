const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const users = require("../routes/users")

const databaseName = 'aracer-db'
const databaseUser = 'Raphael:aracer123'
const connectionURL = `mongodb+srv://${databaseUser}@aracer.w4nfr.mongodb.net/${databaseName}?retryWrites=true&w=majority` || `mongodb://127.0.0.1:27017/${databaseName}`

const app = express()

app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(bodyParser.json())

mongoose
    .connect(
        connectionURL,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true},
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log('unable to connect to Db, Error: ' + err)
    )

app.use("/users", users)

app.listen(port = (process.env.port || 3000), function () {
    console.log(`App listening on port ${port}, Database: ${databaseName}`);
});