app.get('/admin/information', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/know_level', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/know_tariff', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/know_calendar', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/teacher', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/paid', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/course', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/learn', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/homework', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/add-work', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/settings', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/chat', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/admin/logout', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `admin`'", function (err, rows, fields) {

        res.send(rows)
    })
})