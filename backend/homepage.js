app.post('/admin-login-check', cors(), async function (req, res) {
    const thisDate = Math.round(Date.now() / 1000);
    jwt.verify(req.body.token, secret, (err, decoded) => {
        if (err) {
            res.send({"isAdmin": false})
        } else {
            connection.query("SELECT * FROM users WHERE username = '" + decoded.username + "' AND password = '" + decoded.password + "';", function (err, rows, fields) {
                if (err) res.send({"isAdmin": false})
                else {
                    if (rows[0].exp < thisDate) res.send({"isAdmin": false})
                    else {
                        const newDate = Math.round(Date.now() / 1000 + (60 * 60 * 24))
                        connection.query("UPDATE `users` SET `exp` = '" + newDate + "' WHERE 1;")
                        res.send({"isAdmin": true})
                    }
                }
            })
        }
    })
})

app.post('/admin-login', cors(), async function (req, res) {
    const nextExpire = Math.round(Date.now() / 1000 + (60 * 60 * 24))

    connection.query("SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "';", function (err, rows, fields) {
        if (err) {
            console.log(err)
            res.send({"error": true})
        } else if (rows.length <= 0) {
            res.send({"error": true})
        } else {
            connection.query("UPDATE `users` SET `exp` = '" + nextExpire + "' WHERE 1;")
            const user = jwt.sign(
                {
                    username: req.body.username,
                    password: req.body.password,
                }, secret)
            res.send({"token": user})
        }
    })

})