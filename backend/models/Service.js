const mongoose = require('../mongo/mongoose.js');
const Client = require('./Client');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    date: {type: Date, required: true},
    serviceType: {type: String, required: true},
    material: {type: String, required: true},
    description: {type: String},
    paymentType: {type: String, required: true},
    amount: {type: Number, required: true},
    rate: {type: Number, required: true},
    total: {type: Number, required: true},
    client: {type: Schema.ObjectId, ref: 'Client'}
});

const Service = mongoose.model('service', serviceSchema);
module.exports = Service;