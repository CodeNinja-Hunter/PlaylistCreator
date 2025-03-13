const express = require('express');
const router = express.Router();
const querystring = require('querystring'); 
const axios = require('axios');

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

router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
  
    if (!code) {
      return res.status(401).json({ error: 'No code provided' });
    }
  
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    }; 

    try {
        const response = await axios.post(authOptions.url, querystring.stringify(authOptions.form), { headers: authOptions.headers });
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
    
        // Store the tokens in the session or database as needed
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
    
        res.redirect('/'); // Redirect to your app's main page or another route
      } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate with Spotify' });
      }
    });

module.exports = router;
