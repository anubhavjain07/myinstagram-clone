const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SENDGRID_API, EMAIL } = require('../config/keys');
const requireLogin = require('../middleware/requiredLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

//'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'

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}));


router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.statusCode = 422;
        return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email" });
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic: pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "anubhavjain21799@gmail.com",
                                subject: 'Signup Success',
                                html: "<h1>Welcome to Instagram</h1>"
                            })
                            res.json({ message: "saved succesfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })

        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.status(200).json({ message: "successfully signed in" });
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token: token, user: { _id, name, email, followers, following, pic } });
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
});


router.post('/reset', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: 'User dont exists with that email' })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then(result => {
                        transporter.sendMail({
                            to: user.email,
                            from: 'anubhavjain21799@gmail.com',
                            subject: 'reset password',
                            html: `
                                    <p>You are requested for password reset</p>
                                    <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password
                                `
                        });
                        res.json({ message: 'Check Your Email' });
                    })
            })
    })
});


router.post('/newpassword', (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: 'Try again session expired' });
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedpassword => {
                    user.password = hashedpassword;
                    user.resetToken = undefined;
                    user.expireToken = undefined;
                    user.save()
                        .then((savedUser) => {
                            res.json({ message: 'Password updated successfully' })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
})

module.exports = router;