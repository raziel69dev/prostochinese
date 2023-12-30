const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/paymentcount', {
    useMongoClient: true,
    keepAlive: 300,
    connectTimeoutMS: 30000,
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    })
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('not connected ', err));

module.exports = mongoose;