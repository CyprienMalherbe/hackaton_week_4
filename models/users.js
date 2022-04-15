var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    userJourneys: [{type: mongoose.Schema.Types.ObjectId, ref: 'journeys'}]
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;