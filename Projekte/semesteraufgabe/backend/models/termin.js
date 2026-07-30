const mongoose = require('mongoose');

const terminSchema = new mongoose.Schema({
    typId: String,
    datum: String, // Format: JJJJ-MM-TT
    notiz: String,
}); 

module.exports = mongoose.model('Termin', terminSchema); // In mongoose +"s", engl. Plural
