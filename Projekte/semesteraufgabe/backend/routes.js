// Funktionen zur Verwaltung und Beantwortung der requests

const express = require('express');
const router = express.Router();
const User = require('./models/User')
const Termin = require('./models/Termin');
const VorsorgeTyp = require('./models/VorsorgeTyp');

//____Model User____

// C - POST one user
router.post('/user', async (req, res) => {
    const email = req.body.email;

    let user = await User.findOne({ email: email });
    console.log('user nach username : ', user);
    if (user) {
        res.status(400);    // 400 = Bad request
        res.send({ message: "Die Email verfügt bereits über ein Nutzerkonto" });
    }
    else {
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: email,   // oben bereits gesetzt
            password: req.body.password,
        })
        await newUser.save(); // save() von MongoDB zur Verfügung gestellt. Durch Speichern in Collection wird um Eigenschaft _id ergänzt 
        res.status(201)     // 201 = created
        res.send(newUser);  //Wird zurückgesendet inkl. Eigenschaft ID
    }
});

// POST - LOGIN user
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
        return res.status(401).send({ error: 'E-Mail oder Passwort falsch.' });
    }
    res.send({ message: 'Login erfolgreich', user });
});

// R - GET all user
router.get('/user', async (req, res) => {
    const allUsers = await User.find(); //find ist ein Promise - async ausgeführt
    console.log(allUsers);
    res.send(allUsers);
});

// R - GET one user via id
router.get('/user/:id', async (req, res) => {    // ":" übergabe Parameter hier wird id gewählt
    try {
        const user = await User.findOne({ _id: req.params.id });    // re.params.id - da oben Parameter id genannt
        console.log('parameter: ', req.params);
        res.status(200);    // 200 = ok
        res.send(user);
    } catch {
        res.status(404);    // 404 = Not found
        res.send({
            error: "User does not exist!"
        });
    }
})

// U - PATCH update user
router.patch('/user/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }) //Zunächst Prüfung ob bereits vorhanden

        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;

        await User.updateOne({ _id: req.params.id }, user); // updateOne() MongoDB
        res.status(200);    //Statuscode = ok
        res.send(user);
    } catch {
        res.status(404);
        res.send({ error: "User does not exist!" })
    }
});

// D - DELETE user
router.delete('/user/:id', async (req, res) => {

    const result = await User.deleteOne({ _id: req.params.id })
    if (result.deletedCount == 1) {
        res.status(204);
        res.send();
    }
    else {
        res.status(404)
        res.send({ error: "User does not exist!" })
    }
});


//____Model termine____

// C - POST einen neuen termin anlegen
router.post('/termine', async (req, res) => {
    try {
        const neuertermin = new termin({
            typId: req.body.typId,
            datum: req.body.datum,
            notiz: req.body.notiz
        });
        await neuertermin.save(); // Speichern in Collection ergänzt Eigenschaft _id
        res.status(201); // 201 = created
        res.send(neuertermin); // Wird zurückgesendet inkl. Eigenschaft _id
    } catch (fehler) {
        res.status(400);
        res.send({ error: 'termin konnte nicht angelegt werden.' });
    }
});

// R - GET alle termine
router.get('/termine', async (req, res) => {
    const alletermine = await termin.find(); // find ist ein Promise - async ausgeführt
    res.send(alletermine);
});

// R - GET einen termin
router.get('/termine/:id', async (req, res) => {
    const termin = await termin.findOne({ _id: req.params.id });
    if (termin) {
        res.send(termin);
    } else {
        res.status(404); // 404 = Not found
        res.send({ error: 'termin nicht gefunden.' });
    }
});

// U - PATCH termin aktualisieren
router.patch('/termine/:id', async (req, res) => {
    try {
        const termin = await termin.findOne({ _id: req.params.id }); // Zunächst Prüfung ob bereits vorhanden

        if (!termin) {
            res.status(404);    // 404 = Not found
            res.send({ error: 'termin nicht gefunden.' });
            return;
        }

        if (req.body.typId) termin.typId = req.body.typId;
        if (req.body.datum) termin.datum = req.body.datum;
        if (req.body.notiz !== undefined) termin.notiz = req.body.notiz;

        await termin.updateOne({ _id: req.params.id }, termin);
        res.send(termin);
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'termin nicht gefunden.' });
    }
});

// D - DELETE termin
router.delete('/termine/:id', async (req, res) => {
    try {
        await termin.deleteOne({ _id: req.params.id });
        res.status(204).send(); // 204 = no content
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'termin nicht gefunden.' });
    }
});

//____Model vorsorgetyp____

// C - POST eine neue eigene Vorsorgeart anlegen
router.post('/vorsorgetypen', async (req, res) => {
    try {
        const neuerTyp = new vorsorgeTyp({
            name: req.body.name,
            monate: req.body.monate,
            icon: req.body.icon || 'bi-calendar3'
        });
        await neuerTyp.save();
        res.status(201);
        res.send(neuerTyp);
    } catch (fehler) {
        res.status(400);
        res.send({ error: 'Vorsorgeart konnte nicht angelegt werden.' });
    }
});

// R - GET alle eigenen Vorsorgearten
router.get('/vorsorgetypen', async (req, res) => {
    const alleTypen = await vorsorgeTyp.find();
    res.send(alleTypen);
});

// R - GET eine eigene Vorsorgeart
router.get('/vorsorgetypen/:id', async (req, res) => {
    const typ = await vorsorgeTyp.findOne({ _id: req.params.id });
    if (typ) {
        res.send(typ);
    } else {
        res.status(404);    // 404 = Not found
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

// U - PATCH eigene Vorsorgeart aktualisieren
router.patch('/vorsorgetypen/:id', async (req, res) => {
    try {
        const typ = await vorsorgeTyp.findOne({ _id: req.params.id });

        if (!typ) {
            res.status(404);    // 404 = Not found
            res.send({ error: 'Vorsorgeart nicht gefunden.' });
            return;
        }

        if (req.body.name) typ.name = req.body.name;
        if (req.body.monate) typ.monate = req.body.monate;
        if (req.body.icon) typ.icon = req.body.icon;

        await vorsorgeTyp.updateOne({ _id: req.params.id }, typ);
        res.send(typ);
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

// D - DELETE eigene Vorsorgeart
router.delete('/vorsorgetypen/:id', async (req, res) => {
    try {
        await vorsorgeTyp.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

module.exports = router;    // wird nach außen zur Verfügung gestellt