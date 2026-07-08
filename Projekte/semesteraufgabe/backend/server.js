const express = require('express'); //Express einbinden
const routes = require('./routes'); // Routes einbinden
const mongoose = require('mongoose');   
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json()); //Alle JS-Onjekte werden in JSON umgewandelt
app.use('/', routes);   // Alle Anfragen werden an "routes" weitergeleitet
// app.use('/user', userRoutes)
// app.use('/admin', adminRoutes)

// connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DATABASE });  //Connection-Strings zur Datenbank und Verbindung
const db = mongoose.connection;
db.on('error', err => {
  console.log(err);
});
db.once('open', () => {
    console.log('connected to DB');
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ... `);
    }
});