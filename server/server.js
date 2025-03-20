// Import required modules
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'; // Express web server framework
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch'; // For making API requests

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Assign environment variables to constants
const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

// Debugging logs to verify environment variables
console.log("SPOTIFY_CLIENT_ID:", client_id);
console.log("SPOTIFY_CLIENT_SECRET:", client_secret);
console.log("SPOTIFY_REDIRECT_URI:", redirect_uri);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Helper function to generate a random string
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Example route to verify the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Spotify login route
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state);

  const scope = 'user-read-private user-read-email';
  const authQueryParams = querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${authQueryParams}`);
});

// Spotify callback route
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies['spotify_auth_state'] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie('spotify_auth_state');

    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      body: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
    };

    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        res.json({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
        });
      } else {
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Refresh token route
app.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  };

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const tokenData = await tokenResponse.json();

    if (tokenResponse.ok) {
      res.json({
        access_token: tokenData.access_token,
      });
    } else {
      res.status(tokenResponse.status).json({ error: tokenData });
    }
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Search for songs route
app.get('/search', async (req, res) => {
  const access_token = req.query.access_token;
  const query = req.query.query;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      return res.status(searchResponse.status).json({ error: errorData });
    }

    const searchResults = await searchResponse.json();
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching Spotify:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

app.post('/create_playlist', async (req, res) => {
  const access_token = req.body.access_token;
  const user_id = req.body.user_id;
  const playlist_name = req.body.name;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  if (!user_id || !playlist_name) {
    return res.status(400).json({ error: 'User ID and playlist name are required' });
  }

  try {
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlist_name,
        public: false, // Set to true if you want the playlist to be public
      }),
    });

    if (!createPlaylistResponse.ok) {
      const errorData = await createPlaylistResponse.json();
      return res.status(createPlaylistResponse.status).json({ error: errorData });
    }

    const playlist = await createPlaylistResponse.json();
    res.json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});