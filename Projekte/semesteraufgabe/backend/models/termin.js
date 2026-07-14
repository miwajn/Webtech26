const mongoose = require('mongoose');

const terminSchema = new mongoose.Schema({
    typId: { type: String, required: true },
    datum: { type: String, required: true }, // Format: JJJJ-MM-TT
    notiz: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Termin', terminSchema);
