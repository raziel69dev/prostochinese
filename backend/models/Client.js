const mongoose = require('../mongo/mongoose.js');
const Service = require('./Service');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientName: {type: String, required: true},
    companyName: {type: String, required: true},
    phone: {type: String},
    email: {type: String},
    // service: {type: Schema.ObjectId, ref: Service}
});

const Client = mongoose.model('client', clientSchema);
module.exports = Client;