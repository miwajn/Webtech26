const express = require('express');
const router = express.Router();
const Member = require('./models/members')
const Termin = require('./models/Termin');
const VorsorgeTyp = require('./models/VorsorgeTyp');

//____Model Member____

// C - POST one member
router.post('/members', async (req, res) => {
    const newMember = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        ipaddress: req.body.ipaddress
    })
    await newMember.save(); //Durch Speichern in Collection wird um Eigenschaft ID ergänzt 
    res.status(201) // 201 = created
    res.send(newMember);    //Wird zurückgesendet inkl. Eigenschaft ID
});

// R - GET all members
router.get('/members', async (req, res) => {
    const allMembers = await Member.find(); //find ist ein Promise - async ausgeführt
    console.log(allMembers);
    res.send(allMembers);
});

// R - GET one member
router.get('/members/:id', async (req, res) => {    // ":" übergabe Parameter
    const member = await Member.findOne({ _id: req.params.id });
    console.log(req.params);    //Ausgabe aller Parameter - in Anfrage aber nur einer definiert 
    if (member) {
        res.send(member);
    } else {
        res.status(404);    // 404 = Fehler
        res.send({
            error: "Member does not exist!"
        });
    }
})

// U - PATCH update member
router.patch('/members/:id', async (req, res) => {
    try {
        const member = await Member.findOne({ _id: req.params.id }) //Zunächst Prüfung ob bereits vorhanden

        if (req.body.firstname) {
            member.firstname = req.body.firstname
        }

        if (req.body.lastname) {
            member.lastname = req.body.lastname
        }

        if (req.body.email) {
            member.email = req.body.email
        }

        if (req.body.ipaddress) {
            member.ipaddress = req.body.ipaddress
        }

        await Member.updateOne({ _id: req.params.id }, member);
        res.send(member)
    } catch {
        res.status(404)
        res.send({ error: "Member does not exist!" })
    }
});

// D - DELETE member
router.delete('/members/:id', async (req, res) => {
    try {
        await Member.deleteOne({ _id: req.params.id })
        res.status(204).send()     // 204 = no content
    } catch {
        res.status(404)
        res.send({ error: "Member does not exist!" })
    }
});

// POST - LOGIN member
router.post('/login', async (req, res) => {
    const member = await Member.findOne({ email: req.body.email });
    if (!member || member.password !== req.body.password) {
        return res.status(401).send({ error: 'E-Mail oder Passwort falsch.' });
    }
    res.send({ message: 'Login erfolgreich', member });
});

module.exports = router;    // wird nach außen zur Verfügung gestellt

//____Model Termine____

// C - POST einen neuen Termin anlegen
router.post('/termine', async (req, res) => {
    try {
        const neuerTermin = new Termin({
            typId: req.body.typId,
            datum: req.body.datum,
            notiz: req.body.notiz
        });
        await neuerTermin.save(); // Speichern in Collection ergänzt Eigenschaft _id
        res.status(201); // 201 = created
        res.send(neuerTermin); // Wird zurückgesendet inkl. Eigenschaft _id
    } catch (fehler) {
        res.status(400);
        res.send({ error: 'Termin konnte nicht angelegt werden.' });
    }
});

// R - GET alle Termine
router.get('/termine', async (req, res) => {
    const alleTermine = await Termin.find(); // find ist ein Promise - async ausgeführt
    res.send(alleTermine);
});

// R - GET einen Termin
router.get('/termine/:id', async (req, res) => {
    const termin = await Termin.findOne({ _id: req.params.id });
    if (termin) {
        res.send(termin);
    } else {
        res.status(404); // 404 = Fehler
        res.send({ error: 'Termin nicht gefunden.' });
    }
});

// U - PATCH Termin aktualisieren
router.patch('/termine/:id', async (req, res) => {
    try {
        const termin = await Termin.findOne({ _id: req.params.id }); // Zunächst Prüfung ob bereits vorhanden

        if (!termin) {
            res.status(404);
            res.send({ error: 'Termin nicht gefunden.' });
            return;
        }

        if (req.body.typId) {
            termin.typId = req.body.typId;
        }
        if (req.body.datum) {
            termin.datum = req.body.datum;
        }
        if (req.body.notiz !== undefined) {
            termin.notiz = req.body.notiz;
        }

        await Termin.updateOne({ _id: req.params.id }, termin);
        res.send(termin);
    } catch {
        res.status(404);
        res.send({ error: 'Termin nicht gefunden.' });
    }
});

// D - DELETE Termin
router.delete('/termine/:id', async (req, res) => {
    try {
        await Termin.deleteOne({ _id: req.params.id });
        res.status(204).send(); // 204 = no content
    } catch {
        res.status(404);
        res.send({ error: 'Termin nicht gefunden.' });
    }
});

//____Model Vorsorgetyp____

// C - POST eine neue eigene Vorsorgeart anlegen
router.post('/vorsorgetypen', async (req, res) => {
    try {
        const neuerTyp = new VorsorgeTyp({
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
    const alleTypen = await VorsorgeTyp.find();
    res.send(alleTypen);
});

// R - GET eine eigene Vorsorgeart
router.get('/vorsorgetypen/:id', async (req, res) => {
    const typ = await VorsorgeTyp.findOne({ _id: req.params.id });
    if (typ) {
        res.send(typ);
    } else {
        res.status(404);
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

// U - PATCH eigene Vorsorgeart aktualisieren
router.patch('/vorsorgetypen/:id', async (req, res) => {
    try {
        const typ = await VorsorgeTyp.findOne({ _id: req.params.id });

        if (!typ) {
            res.status(404);
            res.send({ error: 'Vorsorgeart nicht gefunden.' });
            return;
        }

        if (req.body.name) {
            typ.name = req.body.name;
        }
        if (req.body.monate) {
            typ.monate = req.body.monate;
        }
        if (req.body.icon) {
            typ.icon = req.body.icon;
        }

        await VorsorgeTyp.updateOne({ _id: req.params.id }, typ);
        res.send(typ);
    } catch {
        res.status(404);
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

// D - DELETE eigene Vorsorgeart
router.delete('/vorsorgetypen/:id', async (req, res) => {
    try {
        await VorsorgeTyp.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({ error: 'Vorsorgeart nicht gefunden.' });
    }
});

module.exports = router;    // wird nach außen zur Verfügung gestellt