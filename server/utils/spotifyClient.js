const axios = require('axios');

const createSpotifyClient = (accessToken) => {
    const instance = axios.create({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    return {
        getUserProfile: async () => {
            const response = await instance.get('/me');
            return response.data;
        },
        createPlaylist: async (userId, name, description) => {
            const response = await instance.post(`/users/${userId}/playlists`, {
                name,
                description,
                public: false
            });
            return response.data;
        },
        addTracksToPlaylist: async (playlistId, uris) => {
            const response = await instance.post(`/playlists/${playlistId}/tracks`, {
                uris
            });
            return response.data;
        }
    };
};

module.exports = createSpotifyClient;
