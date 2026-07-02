const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,      // Für Login relevant
    ipaddress: String
    password: String    // Für Login relevant
});

module.exports = mongoose.model('Member', memberSchema);