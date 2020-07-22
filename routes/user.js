const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requiredLogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate('postedBy', 'id name')
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(404).json({ error: 'User not found' })
        })
});


router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId,
        {
            $push: { followers: req.user._id }
        },
        {
            useFindAndModify: false,
            new: true,

        },
        (err, result) => {
            if (err) {
                res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(req.user._id,
                {
                    $push: { following: req.body.followId }
                },
                {
                    useFindAndModify: false,
                    new: true,
                })
                .select('-password')
                .then(result => {
                    res.json(result)
                })
                .catch(err => {
                    res.status(422).json({ error: err });
                })
        });
});


router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId,
        {
            $pull: { followers: req.user._id }
        },
        {
            useFindAndModify: false,
            new: true,

        },
        (err, result) => {
            if (err) {
                res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(req.user._id,
                {
                    $pull: { following: req.body.unfollowId }
                },
                {
                    useFindAndModify: false,
                    new: true,
                })
                .select('-password')
                .then(result => {
                    res.json(result)
                })
                .catch(err => {
                    res.status(422).json({ error: err });
                })
        });
});


router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id,
        { $set: { pic: req.body.pic } },
        { new: true, useFindAndModify: false },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: 'pic cannot posted' });
            }
            res.json(result);
        })
});


router.post('/searchusers', (req, res) => {
    let UserPattern = new RegExp('^' + req.body.query);
    User.find({ email: { $regex: UserPattern } })
        .select('_id email')
        .then(user => {
            res.json({ user });
        })
        .catch(err => {
            console.log(err);
        });
});



module.exports = router;