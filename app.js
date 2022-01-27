require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  //Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => res.render("home-page"));

app.get("/artist-search", (req, res, next) =>{ 
    console.log(req.query.artist);
    let artist = req.query.artist;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    let newArtist = data.body.artists.items;

    res.render("artist-search-results", { newArtist });

    console.log(data.body.artists.items);
  })
  .catch(err => console.log('error ', err));
})

app.get("/albums/:id", (req, res) => {
    spotifyApi
      .getArtistAlbums(req.params.id)
      .then((albums) => {
        let artistAlbums = albums.body.items;
        console.log(albums.body.items)
        res.render("albums", { artistAlbums });
      })
      .catch((err) => {
        console.log("Some problem happened", err);
      });
  });

  app.get("/view-tracks/:id", (req, res) => {
    spotifyApi
      .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
      .then((tracks) => {
        let albumSongs = tracks.body.items;
        res.render("view-tracks", { albumSongs });
      })
      .catch((err) => {
        console.log("Error with tracks", err);
      });
  });
  
  
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

