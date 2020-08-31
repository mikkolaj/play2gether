const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');
const { handleEvents } = require('./controllers/socketController');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB connection established!')
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const io = socket(server, {});
handleEvents(io);
