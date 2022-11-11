<<<<<<< HEAD
const dotenv = require(`dotenv`);
=======
const dotenv = require(`dotenv`).config();
>>>>>>> master
const flags = require(`flags`);
flags.defineNumber(`port`, 3000);
flags.parse();

const port = flags.get(`port`) || process.env.PORT || 3000;
<<<<<<< HEAD

module.exports = {
    dotenv: dotenv,
    http_port: port
=======
const secret = process.env.SECRET

module.exports = {
    http_port: port,
    secret: secret,
>>>>>>> master
};