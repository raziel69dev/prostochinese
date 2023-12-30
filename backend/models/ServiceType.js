const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    name: {type: String, required: true},
    rate: {type: Number, required: true},
    alias: {type: String}
});

const ServiceType = mongoose.model('serviceType', serviceTypeSchema);
module.exports = ServiceType;