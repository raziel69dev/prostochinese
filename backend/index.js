const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mysql = require("mysql2");

const connection = mysql.createPool({
    connectionLimit: 5,
    host: "raziel666.beget.tech",
    user: "prostochinese",
    database: "prostochinese",
    password: "Raziel123",
    waitForConnections: true,
    connectTimeout: 15000,
    rowsAsArray: false,
    enableKeepAlive: true,
    multipleStatements: true
});
app.use(bodyParser.json());
app.use(cookieParser('secret key'))
app.use(cors())
app.options('*', cors()) // include before other routes
const secret = '58107da8-49e5-44da-bff6-698658300185'


//auth
app.post('/admin-login', cors(), async function (req, res) {
    const nextExpire = Math.round(Date.now() / 1000 + (60 * 60 * 24))

    connection.query("SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "';", function (err, rows, fields) {
        if (err) {
            console.log(err)
            fs.appendFileSync('auth.log', `ERROR | ${new Date(Date.now()).toString()}: username: ${req.body.username}, password: ${req.body.password}, ${secret} \n`);
            res.send({"error": true})
        }
        else if (rows.length <= 0) {
            fs.appendFileSync('auth.log', `ERROR | ${new Date(Date.now()).toString()}: username: ${req.body.username}, password: ${req.body.password}, ${secret} \n`);
            res.send({"error": true})
        }
        else {
            connection.query("UPDATE `users` SET `exp` = '"+ nextExpire +"' WHERE 1;")
            const user = jwt.sign(
                {
                    username: req.body.username,
                    password: req.body.password,
                }, secret)
            fs.appendFileSync('auth.log', `SUCCESS | ${new Date(Date.now()).toString()}: username: ${req.body.username}, password: ${req.body.password}, ${secret}, token: ${user} \n`);
            res.send({"token": user})
        }
    })

})

app.listen(3000, () => console.log("Server listening on 3000"));