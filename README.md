# Playlist Creator 

Playlist Creator is a web application that allows users to create and manage playlists using the Spotify API. Users can log in with their Spotify account, create new playlists, and add tracks to their playlists.

## Features

- User authentication with Spotify
- Create new playlists
- Add tracks to playlists
- View user profile information

## Technologies Used

- React
- Express
- Node.js
- Spotify API
- Axios

## Prerequisites

- Node.js and npm installed
- Spotify Developer account

## Getting Started

### Clone the Repository

```sh 
git clone git@github.com:CodeNinja-Hunter/PlaylistCreator.git
cd PlaylistCreator 

```

### Set Up Environment Variables

Create a `.env` file in the `server` directory with the following content:

```properties
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/callback
```

### Install Dependencies

Navigate to the `server` directory and install the dependencies:

```sh
cd server
npm install
```

Navigate to the `client` directory and install the dependencies:

```sh
cd ../client
npm install
```

### Running the Application

Start the server:

```sh
cd ../server
npm start
```

Start the client:

```sh
cd ../client
npm run dev
```

### Accessing the Application

Open your web browser and navigate to `http://localhost:3000` to access the React application. The server should be running on `http://localhost:3001`.

## API Endpoints

### Create Playlist

- **URL:** `/playlist/create`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "name": "My Playlist",
    "description": "A new playlist",
    "uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
  }
  ```

## License

This project is licensed under the MIT License.
```

