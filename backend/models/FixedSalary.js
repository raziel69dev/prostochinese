const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const fixedSalarySchema = new Schema({
    amount: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
});

const FixedSalary = mongoose.model('fixedSalary', fixedSalarySchema);
module.exports = FixedSalary;