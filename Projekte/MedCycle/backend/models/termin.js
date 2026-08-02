const mongoose = require('mongoose');

const terminSchema = new mongoose.Schema({
    userId: String, // Link zum User
    typId: String,  // Link zu StandardVorsorgeTypen
    datum: String, // Format: JJJJ-MM-TT - muss für Ansicht angepasst werden
    notiz: String,
}); 

module.exports = mongoose.model('Termin', terminSchema); // In mongoose +"s", engl. Plural
