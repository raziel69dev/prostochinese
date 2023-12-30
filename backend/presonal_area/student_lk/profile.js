app.get('/student/information', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/know_level', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/know_tariff', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/know_calendar', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/teacher', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/paid', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/course', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/learn', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/homework', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/add-work', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/settings', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/chat', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})

app.get('/student/logout', cors(), async function (req, res) {
    connection.query("SELECT * FROM `users` WHERE `flag` = `student`'", function (err, rows, fields) {

        res.send(rows)
    })
})