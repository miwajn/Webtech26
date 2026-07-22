const express = require('express'); //Express einbinden
const routes = require('./routes'); // Routes einbinden (Member Termine und Vorsorge)
// const routesUser = require('./userRoutes);
// const routesTermin = require('./terminRoutes);
// const routesVorsorgeTyp = require('./vorsorgeTypRoutes);
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');   //CORS ermöglich Anfragen zu definieren, die im Sinne der Same-Origin-Policy (SOP) erlaubt sein sollen. 

const app = express();
const PORT = 3000;

app.use(express.json()); //Alle JS-Onjekte werden in JSON umgewandelt
app.use(cors());        // Erlaubt Cross-Origin-Anfragen, siehe oben CORS-SOP
app.use('/', routes);  // Alle Anfragen werden an "routes" weitergeleitet / besser separieren
// app.use('/user', routesUser);    // Anfragen User-Model
// app.use('/termin', routesTermin);    // Anfragen Termin-Model
// app.use('/vorsorgetyp', routesVorsorgeTyp)  // Anfragen Vorsorge-Model


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