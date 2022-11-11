const express = require('express');
const app = express();

// const bycript = require('bycript');

app.use(express.json());

// const mongoDB = require('./persist/mongo');

const posts = require('../persist/posts');

// const dontenv = require('dotenv');

app.get('/Chirp/:id', async (req, res) => {
    const id = req.params.id;
    try {
        chirp = await post.findById(id);
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
            return;
        }
    } catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    };
    res.status(200).json(chirp);
});

app.get('/Chirp', async (req, res) => {
    try {
        chirp = await post.find({});
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
            return;
        }
    } catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    };
    res.status(200).json(chirp);
});

app.post('/Chirp', async (req, res) => {
    let chirp;
    try {
        chirp = await post.create({
            // chirpSchema
            user_id: req.user.id,
            message: req.body.message,
            embeddedSong: req.body.embeddedSong,
            timeStamp: Date,
            likes: [],
            comments: [],
        });
        res.status(201).json(chirp);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, something is wrong" });
    };
});

app.put('/Chirp/:id', async (req, res) => {
    let chirp;
    let id = req.params.id;
    try {
        chirp = await post.findByIdAndUpdate(id, {
            // chirpSchema
            user_id: req.user.id,
            message: req.body.message,
            embeddedSong: req.body.embeddedSong,
            timeStamp: Date,
            likes: [],
            comments: [],
        },
            { returnDocument: 'after' }
        );
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
            return;
        }
        res.status(201).json(chirp);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, something is wrong" });
    };
});

app.delete('/Chirp/:id', async (req, res) => {
    const id = req.params.id;
    let chirp;
    try {
        chirp = await posts.findByIdAndDelete(id);
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
        }
        res.status(201).json(chirp);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    };
});

module.exports = {
    app
}
