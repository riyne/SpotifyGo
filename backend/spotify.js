const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const parseUrl = require("parse-url");

require("dotenv").config();

const app = express();
app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cookieParser());
const port = 5000;

const scopes = [
  "playlist-modify-public",
  "playlists-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
];
const redirectUri = "http://localhost:5000/callback";
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const state = "test";

const spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
  clientSecret: clientSecret,
});

// ENDPOINTS:
app.get("/login", function (req, res) {
  // your application requests authorization
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  /* Read query parameters */
  var code = req.query.code; // Read the authorization code from the query parameters
  var state = req.query.state; // (Optional) Read the state from the query parameter
  // var storedState = req.cookies ? req.cookies[stateKey] : null;

  /* Get the access token! */
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      /* Ok. We've got the access token!
         Save the access token for this user somewhere so that you can use it again.
         Cookie? Local storage?
      */
      spotifyApi.setAccessToken(data.body["access_token"]);

      /* Redirecting back to the main page! :-) */
      res.redirect("http://localhost:3000/destination");
    },
    function (err) {
      res.status(err.code);
      res.send(err.message);
    }
  );
});

app.get("/playlists", async function (req, res) {
  const playlists = await (await spotifyApi.getUserPlaylists()).body.items;

  var result = {};
  let count = 0;
  for (let playlist of playlists) {
    result[count++] = [
      ["title", playlist.name],
      ["image", playlist.images[0].url],
      ["link", playlist.external_urls.spotify],
      ["tracks", playlist.tracks.href],
    ];
  }
  res.send(result);
});

app.post("/generate", async function (req, res) {
  const process = req.body;
  const links = [];
  const tracks = [];
  for (let i = 0; i < process.length; i++) {
    const id = parseUrl(process[i].link).pathname.split("/")[2];
    links.push(id);
  }

  var offset = 0;
  const pagesize = 100;

  for (let i = 0; i < links.length; i++) {
    var response = await spotifyApi.getPlaylistTracks(links[i], {
      offset: offset,
    });
    tracks.push(response.body.items);
    let nextLink = response.body.next;
    while (nextLink != null) {
      offset = offset + 100;
      response = await spotifyApi.getPlaylistTracks(links[i], {
        offset: offset,
      });
      tracks.push(response.body.items);
      nextLink = response.body.next;
    }
  }

  // TODO: create an algo to process the songs >> assume that the time to meet is a variable
  // const totTime = tracks
});

const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

console.log(`Listening on ${port}`);
app.listen(port);

//LIL CODERS CODE [BELOW]!

const axios = require('axios');

// Get user input for origin and destination
const origin = prompt('Enter the origin location:'); // ORIGIN HERE
const destination = prompt('Enter the destination location:'); // DESINTAIOTN HERE

// Set API key
const API_KEY = 'AIzaSyDyOukcRQcB-UUFagu2LGt_nm137umn2k8';

// Make API call to get distance and duration information
axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${API_KEY}`)
  .then(response => {
    // Extract distance and duration information from API response
    const distance = response.data.rows[0].elements[0].distance.text;
    const duration = response.data.rows[0].elements[0].duration.text;

    // Print distance and duration information to console
    console.log(`Distance: ${distance}`);
    console.log(`Duration: ${duration}`);
  })
  .catch(error => {
    console.log(error);
  });