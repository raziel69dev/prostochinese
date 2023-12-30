const mongoose = require('../mongo/mongoose.js');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login : {type: String, required: true, unique: true},
    password : {type: String, required: true}
});

const User = mongoose.model('user', userSchema);
module.exports = User;