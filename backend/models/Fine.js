const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const fineSchema = new Schema({
    date: {type: Date, required: true},
    description: {type: String},
    amount: {type: Number, required: true}
});

const Fine = mongoose.model('fine', fineSchema);
module.exports = Fine;