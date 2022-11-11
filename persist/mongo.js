const mongoose = require('mongoose');
const db = mongoose.connection;

async function connect(password) {
    let connectionString = `mongodb+srv://chirp:${password}@chirp-cluster.wnxdvap.mongodb.net/?retryWrites=true&w=majority`
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log("Error connecting to mongoose", err)
    }
}

function onConnect(callback) {
    db.once("open", () => {
        console.log("MongoDB Connected");
        callback();
    });
}

module.exports = {
    connect,
    onConnect
}
