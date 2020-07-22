//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

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/anubhavjain07/image/upload/v1594842098/noimage_xxdzcj.png'
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ]
});

mongoose.model("User", userSchema);