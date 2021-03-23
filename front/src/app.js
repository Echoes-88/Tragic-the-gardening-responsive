const Menu = require('./Components/Menu');
const reloadCss = require('./Utils/ReloadCss');



var app = {

init: function () {

    Menu.unLogged();
    // Reload css resolved responsiv problems
    // reloadCss.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);