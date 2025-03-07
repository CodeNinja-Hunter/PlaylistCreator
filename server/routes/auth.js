const express = require('express');
const router = express.Router();
const querystring = require('querystring');

const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;

router.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email playlist-modify-private';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: SPOTIFY_REDIRECT_URI
        });
    res.redirect(authUrl);
});

router.get('/callback', (req, res) => {
    res.send('Callback received');
});

module.exports = router;
