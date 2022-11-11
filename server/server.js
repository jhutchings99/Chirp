const express = require('express');
const app = express();

const bycript = require('bycript');

app.use(express.json());

const mongoDB = require('./persists/mongo');

const posts = require('./persist/posts');

const dontenv = require('dontenv');

const flags = require('flags');
flags.defineNumber("port", 3000, "Ports of http server");
flags.parse();

const port = flags.get('port') || process.env.PORT || 3000;

mongoDB.setUpConnectionHandlers(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

mongoDB.connect();

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

app.post('/Chirp', (req, res) => {
    create.(req.body)
        then {
        if (chirp == null) {
            res.status(404).json({ message: "No Chirp found" });
            return;
        }
        res.json(chrip);
    }
        catch (err) {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
        return;
    });
});

app.put('/Chirp/:id', (req, res) => {
    const id = req.params.id;
    posts.findByIdAndUpdate(id, req.body, { returnDocument: 'after' })
        .then((chirp) => {
            if (chirp == null) {
                res.status(404).json({ message: "No Chirp found" });
                return;
            }
            res.json(chrip);
        })
        .catch(err) => {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
        return;
    });
});

app.delete('/Chirp/:id', (req, res) => {
    const id = req.params.id;
    posts.findByIdAndDelete(id)
        .then((chirp) => {
            if (chirp == null) {
                res.status(404).json({ message: "No Chirp found" });
                return;
            }
            res.json(chrip);
        })
        .catch(err) => {
        res.status(500).json({ message: "Check your server code, somthing is wrong" });
        return;
    });
});
