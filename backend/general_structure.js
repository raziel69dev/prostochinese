// sign in
app.get('/signin', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users`", function (err, rows, fields) {

        res.send(rows)
    })
})

//sign up
app.get('/signup', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users`", function (err, rows, fields) {

        res.send(rows)
    })
})

//forget password
app.get('/forget', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users`", function (err, rows, fields) {

        res.send(rows)
    })
})