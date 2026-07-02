const express = require('express');
const router = express.Router();
const Member = require('./models/members')

// C - POST one member
router.post('/members', async(req, res) => {
    const newMember = new Member({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        ipaddress: req.body.ipaddress
    })
    await newMember.save();
    res.send(newMember);
});

// R - GET all members
router.get('/members', async(req, res) => {
    const allMembers = await Member.find(); //find ist ein Promise - async ausgeführt
    console.log(allMembers);
    res.send(allMembers);
});

// R - GET one member
router.get('/members/:id', async(req, res) => {
    const member = await Member.findOne({ _id: req.params.id });
    console.log(req.params);
    if(member) {
        res.send(member);
    } else {
        res.status(404);
        res.send({
            error: "Member does not exist!"
        });
    }
})

// U - PATCH update member
router.patch('/members/:id', async(req, res) => {
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
router.delete('/members/:id', async(req, res) => {
    try {
        await Member.deleteOne({ _id: req.params.id })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Member does not exist!" })
    }
});

module.exports = router;    // wird nach außen zur Verfügung gestellt