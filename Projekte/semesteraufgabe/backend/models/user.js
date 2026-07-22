const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,      // Für Login relevant
    password: String,    // Für Login relevant
});

module.exports = mongoose.model('User', memberSchema);    //Wird von Mongoose in Plural verwendet