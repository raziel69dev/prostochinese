app.get('/teacher/information', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/know_level', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/know_tariff', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/know_calendar', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/teacher', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/paid', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/course', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/learn', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/homework', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/add-work', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/settings', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/chat', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/teacher/logout', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `teacher`'", function (err, rows, fields) {

        res.send(rows)
    })
})