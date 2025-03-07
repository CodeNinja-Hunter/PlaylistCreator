const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlist');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
