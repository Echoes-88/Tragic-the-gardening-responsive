const Store = require('../Store');

const PlayGame = require('./PlayGame');

// Middleware request
const MiddlewareDeck = require('../Middleware/Deck');

// Render
const DomRenderCard = require('../DomRender/Card');

var InitGame = {

    init: function() {
         if(event) {
             event.preventDefault();
         }
       // event.preventDefault();

        console.log(Store)

        const mainContainer = document.querySelector('.container');
        mainContainer.classList.add('flex');

        // Check if user has decks. Yes => show all decks. No => create one
        if(Store.user.decks.length > 0) {

                mainContainer.innerHTML = DomRenderCard.showDeck(Store.user.decks);

                const playDeck = document.getElementsByClassName('play-deck');

                for(const deck of playDeck) {
                    deck.addEventListener('click', function(){
                        event.preventDefault();
                        mainContainer.classList.remove('flex');
                        mainContainer.classList.add('board-game');
                       
                        // Start game;
                        PlayGame.init(deck.id)
                    });
                }


        } else {

            mainContainer.innerHTML = DomRenderCard.createDeck();

            const form = document.getElementById('create-deck');
            form.addEventListener('submit', async(data) => { 

                // Create deck in database
                const response = await MiddlewareDeck.createOne(data);
                console.log(response)
                if(response) {
                    InitGame.init();
                }


                
            });
        }
            
    }
}

module.exports = InitGame;
