const dotenv = require(`dotenv`).config();
const flags = require(`flags`);
flags.defineNumber(`port`, 3000);
flags.parse();

const port = flags.get(`port`) || process.env.PORT || 3000;
const secret = process.env.SECRET

module.exports = {
    http_port: port,
    secret: secret,
};
