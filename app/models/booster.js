const Sequelize = require('sequelize');
const sequelize = require('../database');

class Booster extends Sequelize.Model {};

Booster.init({

        title: Sequelize.STRING,
        text: Sequelize.STRING,
        special_effect_value: Sequelize.INTEGER,
        special_effect_text: Sequelize.STRING,
        special_effect_value_2: Sequelize.INTEGER,
        special_effect_text_2: Sequelize.STRING,
        position: Sequelize.INTEGER,
    }, {
        sequelize,
        tableName: "booster"
    });

module.exports = Booster;


