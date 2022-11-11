const express = require('express');
const app = express();

app.use(express.static("public"));

const { User, Chirp } = require('../persist/posts')

app.use(express.json());
const post = require('../persist/posts');

app.get('/chirps/:id', async (req, res) => {
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

app.get('/chirps', async (req, res) => {
    let chirp;
    try {
        chirp = await Chirp.find();
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    };
    res.status(200).json(chirp);
});

app.post('/chirps', async (req, res) => {
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

app.put('/chirps/:id', async (req, res) => {
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

app.delete('/chirps/:id', async (req, res) => {
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

app.post('/users', async (req, res) => {
    try {
        let user = await User.create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    }
});

module.exports = {
    app
}
