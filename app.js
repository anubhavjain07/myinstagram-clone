const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys')
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://anubhav:b4fZu5qBT0qxgo8R@cluster0.yyugk.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongoose');
});

mongoose.connection.on('error', (err) => {
    console.log('error connection ', err);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log('Server is running', PORT);
});