const Sequelize = require('sequelize');
const sequelize = require('../database');

const Booster = require('./booster');
const Monster = require('./monster');
const Deck = require('./deck');
const User = require('./user');

// Un deck est possédé par un utilisateur
Deck.belongsTo(User, {
    foreignKey: "user_id",
    as: "deckParent"
})

// Un utilisateur possede plusieurs deck
User.hasMany(Deck, {
    foreignKey: "user_id",
    as: "decks"
})


MonsterQuantity = sequelize.define('recurrence', {
    quantity: Sequelize.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'deck_has_monster',
  });

Deck.belongsToMany(Monster, {
    as: "monsters",
    through: MonsterQuantity,
    foreignKey: 'deck_id',
    otherKey: 'monster_id'
});

BoosterQuantity = sequelize.define('recurrence', {
    quantity: Sequelize.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'deck_has_booster',
  });

Deck.belongsToMany(Booster, {
    as: "boosters",
    through: BoosterQuantity,
    foreignKey: 'deck_id',
    otherKey: 'booster_id',
});

module.exports = { Booster, Monster, Deck, User };