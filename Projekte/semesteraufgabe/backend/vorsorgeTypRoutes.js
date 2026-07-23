// Funktionen zur Verwaltung und Beantwortung der requests
const express = require('express');
const router = express.Router();
const VorsorgeTyp = require('./models/eigenerVorsorgetyp');

// C - POST einen neuen eigenen Vorsorgetyp anlegen
router.post('/vorsorgetypen', async (req, res) => {
    try {
        const neuerTyp = new VorsorgeTyp({
            name: req.body.name,
            zyklus: req.body.zyklus,
            datumEintrag: req.body.datumEintrag,
            datumNaechsterTermin: req.body.datumNaechsterTermin,
            notiz: req.body.notiz
        });
        await neuerTyp.save();
        res.status(201);
        res.send(neuerTyp);
    } catch (fehler) {
        res.status(400);
        res.send({ error: 'Vorsorgetermin konnte nicht angelegt werden.' });
    }
});

// R - GET alle eigenen Vorsorgearten
router.get('/vorsorgetypen', async (req, res) => {
    try {
        const alleTypen = await VorsorgeTyp.find();
        res.send(alleTypen);
    } catch (fehler) {
        res.status(500);
        res.send({ error: 'Selbst eingestellte Vorsorgetypen konnten nicht geladen werden.' });
    }
});

// R - GET eine eigene Vorsorgeart
router.get('/vorsorgetypen/:id', async (req, res) => {
    try {
        const typ = await VorsorgeTyp.findOne({ _id: req.params.id });
        if (typ) {
            res.send(typ);
        } else {
            res.status(404);    // 404 = Not found
            res.send({ error: 'Vorsorgetyp nicht gefunden.' });
        }
    } catch {
        res.status(404);
        res.send({ error: 'Vorsorgetyp nicht gefunden.' });
    }
});

// U - PATCH eigene Vorsorgeart aktualisieren
router.patch('/vorsorgetypen/:id', async (req, res) => {
    try {
        const typ = await VorsorgeTyp.findOne({ _id: req.params.id });

        if (!typ) {
            res.status(404);    // 404 = Not found
            res.send({ error: 'Vorsorgetyp nicht gefunden.' });
            return;
        }

        if (req.body.name) typ.name = req.body.name;
        if (req.body.monate) typ.monate = req.body.monate;
        if (req.body.icon) typ.icon = req.body.icon;

        await typ.save();
        res.send(typ);
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'Vorsorgetyp nicht gefunden.' });
    }
});

// D - DELETE eigene Vorsorgeart
router.delete('/vorsorgetypen/:id', async (req, res) => {
    try {
        await VorsorgeTyp.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch {
        res.status(404);    // 404 = Not found
        res.send({ error: 'Vorsorgetyp nicht gefunden.' });
    }
});

module.exports = router;    // wird nach außen zur Verfügung gestellt