const mongoose = require('mongoose');

const vorsorgeTypSchema = new mongoose.Schema({
    name: { type: String, required: true },
    monate: { type: Number, required: true },
    icon: { type: String, default: 'bi-calendar3' }
}, { timestamps: true });

module.exports = mongoose.model('VorsorgeTyp', vorsorgeTypSchema);
