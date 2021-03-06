const express = require('express');

// Middleware to avoid try/catch in controllers
const capture = require('./middlewares/capture')

// Controllers & router
const router = express.Router();
const genericController = require('./controllers/genericController')
const userController = require('./controllers/userController');

// USER
router.post('/login', capture(userController.loginSubmit));
router.post('/signup', capture(userController.signupSubmit));
// router.get('/profil', userController.profil);

// GENERIC CRUD : DECK, MONSTER, BOOSTER, USER
router.get('/crud/:entity', capture(genericController.getAll));
router.get('/crud/:entity/:id', capture(genericController.getOne));
router.post('/crud/:entity', capture(genericController.createOne));
router.patch('/crud/:entity/:id', capture(genericController.updateOne));
router.delete('/crud/:entity/:id', capture(genericController.deleteOne));

// ASSOCIATIONS
router.get('/user-decks/:id', capture(userController.userHasDecks));

module.exports = router;