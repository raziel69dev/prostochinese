const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const paymentTypeSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String}
});

const PaymentType = mongoose.model('paymentType', paymentTypeSchema);
module.exports = PaymentType;