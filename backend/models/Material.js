const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
    name: {type: String, required: true},
    alias: {type: String}
});

const Material = mongoose.model('material', materialSchema);
module.exports = Material;