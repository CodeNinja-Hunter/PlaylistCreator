import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'request'; // Add this missing import
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import authRoutes from './routes/auth-routes.js';
import { seedAll } from './seeds/index.js'; // Corrected import

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT consistently
const forceDatabaseRefresh = false;

// Serve static files from client/dist (adjust path for Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://my-app-client.onrender.com' })); // Adjust frontend URL
app.use(cookieParser());
app.use('/auth', authRoutes); // Mount auth routes
app.use(routes); // General routes

// Spotify config
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// Spotify login route
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    }));
});

// Spotify callback route
app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true,
        };

        request.get(options, (error, response, body) => {
          console.log('Spotify user info:', body);
        });

        res.redirect('/#' + querystring.stringify({
          access_token,
          refresh_token,
        }));
      } else {
        res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    });
  }
});

// Spotify refresh token route
app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64') },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ 'access_token': access_token });
    } else {
      res.status(500).send({ error: 'Failed to refresh token' });
    }
  });
});

// Start server with seeding
function startServer(app, port) {
  sequelize.sync({ force: forceDatabaseRefresh }).then(async () => {
    console.log('Database synced.');
    if (forceDatabaseRefresh) { // Only seed if forcing a refresh
      console.log('Seeding database...');
      await seedAll();
    }
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
}

startServer(app, PORT);

// Remove duplicate console.log and app.listen
// console.log(`Listening on ${PORT}`);


//app.listen(5000);


// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express'; // Express web server framework
// import cors from  'cors';
// import querystring from 'querystring';
// import cookieParser from 'cookie-parser'; 
// import path from 'path';
// import {fileURLToPath} from 'url'; 
// import sequelize from './config/connection.js';
// import routes from './routes/index.js';
// import authRoutes from './routes/auth-routes.js';
// import seedAll from './seeds/user-seeds.js';

// const app = express();
// const PORT = process.env.PORT || 3001;
// const forceDatabaseRefresh = false;
// // Serves static files in the entire client's dist folder
// app.use(express.static('../client/dist'));

// app.use(express.json());
// app.use(routes);

// sequelize.sync({force: forceDatabaseRefresh}).then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`);
//   });
// });

// const __filename = fileURLToPath(import.meta.url);

// // 👇️ "/home/john/Desktop/javascript"
// const __dirname = path.dirname(__filename);

// var client_id = `${process.env.CLIENT_ID}`; // Your client id
// var client_secret = `${process.env.CLIENT_SECRET}`; // Your secret
// var redirect_uri = `${process.env.REDIRECT_URI}`; // Your redirect uri

// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function(length) {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// var stateKey = 'spotify_auth_state';

// app.use(express.static(__dirname + '/public'))
//    .use(cors())
//    .use(cookieParser());

// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   res.cookie(stateKey, state);

//   // your application requests authorization
//   var scope = 'user-read-private user-read-email';
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });

// app.get('/callback', function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter

//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;

//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });

// app.get('/refresh_token', function(req, res) {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// }); 

// // Sync Sequelize models and then start the server
// sequelize.sync({ force: false }).then(async () => {
//   console.log('Database synced.');

//   // Seed the database
//   console.log('Seeding database...');
//   await seedAll();

//   app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//   });
// }).catch((err) => {
//   console.error('Unable to connect to the database:', err);
// });

// console.log(`Listening on ${PORT}`);
// //app.listen(5000);
