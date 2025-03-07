const querystring = require('querystring');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
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
            'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    try {
        const response = await axios.post(authOptions.url, querystring.stringify(authOptions.form), { headers: authOptions.headers });
        req.spotifyAuth = response.data;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Failed to authenticate with Spotify' });
    }
};

module.exports = authMiddleware;
