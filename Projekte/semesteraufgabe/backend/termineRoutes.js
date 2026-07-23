// Funktionen zur Verwaltung und Beantwortung der requests
const express = require('express');
const router = express.Router();
const Termin = require('./models/Termin');
const VorsorgeTyp = require('./models/eigenerVorsorgetyp');

// C - POST einen neuen termin anlegen
router.post('/termine', async (req, res) => {
    try {
        const neuertermin = new Termin({
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
    try {
        const alletermine = await Termin.find(); // find ist ein Promise - async ausgeführt
        res.send(alletermine);
    } catch (fehler) {
        res.status(500);
        res.send({ error: 'termine konnten nicht geladen werden.' });
    }
});

// R - GET einen termin
router.get('/termine/:id', async (req, res) => {
    try {
        const termin = await Termin.findOne({ _id: req.params.id });
        if (termin) {
            res.send(termin);
        } else {
            res.status(404); // 404 = Not found
            res.send({ error: 'termin nicht gefunden.' });
        }
    } catch {
        res.status(404);
        res.send({ error: 'termin nicht gefunden.' });
    }
});

// U - PATCH termin aktualisieren
router.patch('/termine/:id', async (req, res) => {
    try {
        const termin = await Termin.findOne({ _id: req.params.id }); // Zunächst Prüfung ob bereits vorhanden

        if (!termin) {
            res.status(404);    // 404 = Not found
            res.send({ error: 'termin nicht gefunden.' });
            return;
        }

        if (req.body.typId) termin.typId = req.body.typId;
        if (req.body.datum) termin.datum = req.body.datum;
        if (req.body.notiz !== undefined) termin.notiz = req.body.notiz;

        await termin.save();
        res.send(termin);
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'termin nicht gefunden.' });
    }
});

// D - DELETE termin
router.delete('/termine/:id', async (req, res) => {
    try {
        await Termin.deleteOne({ _id: req.params.id });
        res.status(204).send(); // 204 = no content
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'termin nicht gefunden.' });
    }
});

module.exports = router;    // wird nach außen zur Verfügung gestellt