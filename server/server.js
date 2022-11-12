const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

const { User, Chirp, Comment } = require('../persist/posts')

const setUpAuth = require('./auth');
const setUpSession = require('./session');

setUpSession(app);
setUpAuth(app);

const post = require('../persist/posts');

app.get('/chirps/:id', async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const id = req.params.id;
    try {
        chirp = await Chirp.findById(id);
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
    // if (!req.user) {
    //     res.status(401).json({ message: "Unauthorized" });
    //     return;
    // }
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

app.post('/users/:_id/chirps', async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        let user = await User.findById(req.params._id);
        let username = user.username;
        let chirp = await Chirp.create({
            user_id: req.params._id,
            poster: username,
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
    let id = req.params.id;
    try {
        let chirp = await Chirp.findByIdAndUpdate(id, {
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
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const id = req.params.id;
    try {
        let chirp = await Chirp.findByIdAndDelete(id);
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
      lastName: req.body.lastName,
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Check your server code, somthing is wrong' });
  }
});

app.get('/users/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const id = req.params._id;
    try {
        let user = await User.findById(id);
        if (user == null) {
            res.status(404).json({ message: "No User found" });
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    };
});

app.post('/users/:_id/chirps/:chirps_id/comments', async (req, res) => {
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    let chirp;
    let user = await User.findById(req.params._id);
    let username = user.username;
    console.log(username)

    try {
        comment = await Comment.create({
            user_id: req.params._id,
            poster: username,
            chirp_id: req.params.chirps_id,
            message: req.body.message,
            timeStamp: Date,
        });
        chirp = await Chirp.findByIdAndUpdate(req.params.chirps_id, {
            $push: { comments: comment }
        }, { returnDocument: 'after' });
        if (!chirp) {
            res.status(500).json({
                message: `get request failed to get chirp`,
                error: err,
            });
            return;
        }
    res.status(200).json(chirp);
    } catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    }
});

app.delete('/users/:_id/chirps/:chirps_id/comments/:_id', async (req, res) => {
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    let chirp;

    try {
        chirp = await Chirp.findByIdAndUpdate(req.params.chirps_id, {
            $pull: { comments: { _id: req.params._id } }
        }, { returnDocument: 'after' });
        if (!chirp) {
            res.status(500).json({
                message: `get request failed to get chirp`,
                error: err,
            });
            return;
        }
    res.status(200).json(chirp);
    } catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    }
});

app.post('/users/:_id/chirps/:chirps_id/likes', async (req, res) => {
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    try {
        let user = await User.findById(req.params._id);
        let chirp = await Chirp.findById(req.params.chirps_id);
        likes = chirp.likes;
        for (let i = 0; i < likes.length; i++) {
            if (likes[i]._id.equals(user._id)) {
                console.log("user has chirp", err);
                res.status(500).json({ message: "User already liked this chirp" });
                return;
            }
        }

        chirp = await Chirp.findByIdAndUpdate(req.params.chirps_id, {
            $push: { likes: user }
        }, { returnDocument: 'after' });
        if (!user) {
            res.status(500).json({
                message: `get request failed to get a user`,
                error: err,
            });
            console.log("user has chirp1", err);
            return;
        }
        if (!chirp) {
            res.status(500).json({
                message: `get request failed to get a chirp`,
                error: err,
            });
            console.log("user has chirp12", err);
            return;
        }
    res.status(200).json(chirp);
    } catch (err) {
        console.log("user has chirp3", err);
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
    }
});

app.delete('/users/:_id/chirps/:chirps_id/likes', async (req, res) => {
    if (!req.user) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    try {
        let user = await User.findById(req.params._id);
        let chirp = await Chirp.findById(req.params.chirps_id);
        likes = chirp.likes;
        for (let i = 0; i < likes.length; i++) {
            if (likes[i]._id.equals(user._id)) {
                chirp = await Chirp.findByIdAndUpdate(req.params.chirps_id, {
                    $pull: { likes: user }
                }, { returnDocument: 'after' });
                if (!user) {
                    res.status(500).json({
                        message: `get request failed to get a user`,
                        error: err,
                    });
                        console.log('get request failed user', err);
                    return;
                }
                if (!chirp) {
                    res.status(500).json({
                        message: `get request failed to get a chirp`,
                        error: err,
                    });
                    console.log('get request failed chirp', err);
                    return;
                }
                res.status(200).json(chirp);
                return;
            }
        }
        res.status(500).json({ message: "User has not liked this chirp" });
        console.log('user has not lked chirp');
    } catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
        console.log('server is broken', err);
    }
});

module.exports = {
  app,
};
