const mongoose = require('mongoose');

const vorsorgeTypSchema = new mongoose.Schema({
    name: String,
    zyklus: String,
    datumEintrag: String,           // Format: JJJJ-MM-TT
    datumNaechsterTermin: String,   // Format: JJJJ-MM-TT
    notiz: String,
}); 

module.exports = mongoose.model('VorsorgeTyp', vorsorgeTypSchema); // In mongoose +"s", engl. Plural
