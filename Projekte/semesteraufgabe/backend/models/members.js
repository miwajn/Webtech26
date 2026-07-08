const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,      // Für Login relevant
    ipaddress: String
});

module.exports = mongoose.model('Member', memberSchema);    //Wird von Mongoose in Plural verwendet