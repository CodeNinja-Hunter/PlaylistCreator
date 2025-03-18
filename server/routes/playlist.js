const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const createSpotifyClient = require('../utils/spotifyClient');

router.post('/create', authMiddleware, async (req, res) => {
    const { name, description, uris } = req.body;
    const spotifyClient = createSpotifyClient(req.spotifyAuth.access_token);

    try {
        const userProfile = await spotifyClient.getUserProfile();
        const playlist = await spotifyClient.createPlaylist(userProfile.id, name, description);
        await spotifyClient.addTracksToPlaylist(playlist.id, uris);
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

module.exports = router;
