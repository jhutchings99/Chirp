const express = require('express');
const app = express();

app.use(express.json());

const mongoDB =  require('./persists/mongo');

const posts = require('./persist/posts');

const dontenv = require('dontenv');

const flags = require('flags');
flags.defineNumber("port", 8080, "Ports of http server");
flags.parse();

const port = flags.get('port') || process.env.PORT || 8080;

mongoDB.setUpConnectionHandlers(() =>{
    app.listen(port,  () =>{
        console.log(`Server is running on port ${port}`);
    });
});

mongoDB.connect();

app.get('/Chirp/:id', (req,res) =>{
    const id = req.params.id;
    posts.findById(id)
    .then((chirp) => {
        if( chirp == null){
            res.status(404).json({message: "No Chirp found"});
            return;
        }
        res.json(chrip);
    })
    .catch(err) =>{
        res.status(500).json({message: "Check your server code, somthing is wrong"});
        return;
    });
});

app.get('/Chirp', (req,res) =>{
    posts.find()
    .then((chirp) => {
        if( chirp == null){
            res.status(404).json({message: "No Chirp found"});
            return;
        }
        res.json(chrip);
    })
    .catch(err) =>{
        res.status(500).json({message: "Check your server code, somthing is wrong"});
        return;
    });
});

app.post('/Chirp', (req,res) =>{
    create.(req.body)
    .then((chirp) => {
        if( chirp == null){
            res.status(404).json({message: "No Chirp found"});
            return;
        }
        res.json(chrip);
    })
    .catch(err) =>{
        res.status(500).json({message: "Check your server code, somthing is wrong"});
        return;
    });
});

app.put('/Chirp/:id', (req,res) =>{
    const id = req.params.id;
    posts.findByIdAndUpdate(id, req.body , {returnDocument: 'after'})
    .then((chirp) => {
        if( chirp == null){
            res.status(404).json({message: "No Chirp found"});
            return;
        }
        res.json(chrip);
    })
    .catch(err) =>{
        res.status(500).json({message: "Check your server code, somthing is wrong"});
        return;
    });
});

app.delete('/Chirp/:id', (req,res) =>{
    const id = req.params.id;
    posts.findByIdAndDelete(id)
    .then((chirp) => {
        if( chirp == null){
            res.status(404).json({message: "No Chirp found"});
            return;
        }
        res.json(chrip);
    })
    .catch(err) =>{
        res.status(500).json({message: "Check your server code, somthing is wrong"});
        return;
    });
});
