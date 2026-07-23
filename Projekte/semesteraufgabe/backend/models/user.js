const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,      // Für Login relevant
    password: String,    // Für Login relevant
});

module.exports = mongoose.model('User', userSchema);  // In mongoose +"s", engl. Plural