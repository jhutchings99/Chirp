const app = require(`./server/server`);
const { connect, onConnect } = require(`./persist/mongo`);
const config = require(`./server/config`);

<<<<<<< HEAD
config.dotenv.config();

onConnect(() => {
    app.app.listen(config.http_port, () => {
        console.log(`listening on port ${config.http_port}`);
=======
onConnect(() => {
    app.app.listen(config.http_port, () => {
        console.log(`listening on port ${config.http_port}`);
        console.log(`http://localhost:${config.http_port}`);
>>>>>>> master

    });
});

try {
    connect(
        process.env.USERNAME,
        process.env.PASSWORD
    );
} catch (err) {
    console.log(`could not connect`, err);
}