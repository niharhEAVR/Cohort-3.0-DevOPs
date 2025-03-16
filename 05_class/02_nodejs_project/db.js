const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const users = new Schema({
    author: ObjectId,
    username: String,
    password: String,
});

const userModel = mongoose.model('users',users)

module.exports = {
    userModel
}