const Menu = require('./Components/Menu');
const reloadCss = require('./Utils/ReloadCss');
const Store = require('./Store');

var app = {

init: function () {

    // console.log(sessionStorage.getItem('userDatas'))
    if(sessionStorage.getItem('userDatas')) {
        Store.user = JSON.parse(sessionStorage.getItem('userDatas'));
        console.log(Store)
        Menu.logged();
    } else {
        Menu.unLogged();
    }

    // Reload css resolved responsiv problems
    // reloadCss.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);
module.exports = app;