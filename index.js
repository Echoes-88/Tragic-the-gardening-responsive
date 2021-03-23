// variables d'environnement
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;

// Express
const express = require('express');
const app = express();

// static
app.use(express.static('public'));

// POST handler
app.use(express.urlencoded({extended: true}));

// formData handler
const multer = require('multer');
app.use( multer().none() );

// gestion des sessions
const session = require('express-session');
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.APP_SECRET
}));

// middleware user
const userMiddleware = require('./app/middlewares/userMiddleware');
app.use(userMiddleware);

// router
const router = require('./app/router');
app.use(router);

// lancement du serveur
app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});