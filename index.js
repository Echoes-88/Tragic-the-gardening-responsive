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
	secret: process.env.APP_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, // empêche l'accès au cookie depuis du javascript côté front
		secure: false, // HTTPS est nécessaire si l'on veut passer l'option à true
		maxAge: 1000 * 60 * 60 * 24, // durée de vie du cookie en milliseconds, ici ça donne 1 jour
	}
})),


app.use((req, res, next) => {
	// on autorise explicitement le domaine du front
	res.header("Access-Control-Allow-Origin", "*");
	// on autorise le partage du cookie
	res.header("Access-Control-Allow-Credentials", true);
	// on autorise le partage de ressources entre origines
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");

	next();
});



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
