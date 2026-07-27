const express = require('express'); //Express einbinden
const userRoutes = require('./userRoutes');
const termineRoutes = require('./termineRoutes');
const vorsorgeTypRoutes = require('./vorsorgeTypRoutes');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');   //CORS ermöglich Anfragen zu definieren, die im Sinne der Same-Origin-Policy (SOP) erlaubt sein sollen. 

const app = express();
const PORT = 3000;

app.use(express.json()); //Alle JS-Onjekte werden in JSON umgewandelt
app.use(cors());        // Erlaubt Cross-Origin-Anfragen, siehe oben CORS-SOP
app.use('/', userRoutes);
app.use('/', termineRoutes);
app.use('/', vorsorgeTypRoutes);


// Verbindung zu MongoDB
mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DATABASE });  //Connection-Strings zur Datenbank und Verbindung
const db = mongoose.connection;
db.on('error', err => {
    console.log(err);
});
db.once('open', () => {
    console.log('connected to DB');
});

// Start des Servers
app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ... `);
    }
});