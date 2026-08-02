// Funktionen zur Verwaltung und Beantwortung der requests
const express = require('express');
const router = express.Router();
const User = require('./models/User')

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

module.exports = router;    // wird nach außen zur Verfügung gestellt