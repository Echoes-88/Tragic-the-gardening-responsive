const Store = require('../Store');

// Render
const DomRenderBoardGame= require('../DomRender/BoardGame');
const DomRenderOther = require('../DomRender/Other');
const DomRenderCard= require('../DomRender/Card');
const Menu = require('../DomRender/Menu');

// Middleware
const MiddlewareDeck = require('../Middleware/Deck');

// Utils
const dragAndDrop = require('../Utils/DragAndDrop');
const animation = require('../Utils/Animation');

const app = require('../app');


let round = 0;

let userDeck = {
    monsters: [],
    boosters: [],
    cardsOnBoard: []
};

let cpterDeck = {
    monsters: [],
    boosters: [],
    cardsOnBoard: []
};

const PlayGame = {

    init: async(deckId) => {

        // Create deck for computer
        MiddlewareDeck.cpterDeck();

        // Tutorial
        const mainContainer = document.querySelector('.container');
        mainContainer.classList.remove('container')
        mainContainer.classList.add('board-game')
        mainContainer.innerHTML = DomRenderOther.card();

        const close = document.querySelector(".close-button");
        close.addEventListener('click', function() {
            event.preventDefault();
            mainContainer.innerHTML = DomRenderBoardGame.render();

            const dropArea = document.querySelector('.drop-area');
            dropArea.classList.add('show-message');
            dropArea.innerHTML = `<p>DRAG AND DROP YOUR CARD HERE</p>`;

            // Render cards in DOM & add deck in store
            let deck = Store.user.decks.find(deck => deck.id == deckId);

            const playerArea = document.querySelector('.playerCards');

            let inc = 0;

            deck.monsters.map(card => {
                for(let i=0;i<card.recurrence.quantity;i++) {
                    userDeck.monsters.push(card);
                }
            })

            // Deep copy to avoid duplicate key
            userDeck.monsters = JSON.parse(JSON.stringify(userDeck.monsters));

            userDeck.monsters.map(card => {
                card.key = inc++; 
                card.type = 'monster'; 
                card.owner = 'user';
                playerArea.innerHTML += DomRenderCard.monster(card, "user");
            });

            deck.boosters.map(card => {
                for(let i=0;i<card.recurrence.quantity;i++) {
                    userDeck.boosters.push(card);
                }
            })

            // Deep copy to avoid duplicate key
            userDeck.boosters = JSON.parse(JSON.stringify(userDeck.boosters));

            userDeck.boosters.map(card => {
                card.key = inc++; 
                card.type = 'booster'; 
                card.owner = 'user';   
                playerArea.innerHTML += DomRenderCard.booster(card, "user")
            });

            // Add array to scan cards status
            userDeck.cardsOnBoard = [];

            // Save cpter Deck  
            cpterDeck = Store.cpter.deck

            // Deep copy to avoid duplicate key
            cpterDeck = JSON.parse(JSON.stringify(cpterDeck));

            cpterDeck.monsters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'monster'; card.owner = 'cpter'});
            cpterDeck.boosters.forEach(card => {card.key = inc++; card.onBoard = false; card.type = 'booster'; card.owner = 'cpter'});
            cpterDeck.cardsOnBoard = [];

            document.querySelector('.playerCards').addEventListener('mousewheel', function(e) {
                this.scrollTop += e.deltaY;
            });
         
            // launch game
            PlayGame.userRound();
        })
    },


    userRound: function() {

        round++;

        console.log('user deck', userDeck, 'cpter deck', cpterDeck)

        // If computer still has cards on hand but none onBoard and user can't play, switch on cpter round (To do : add +1def to user cards)
        if((cpterDeck.cardsOnBoard.length == 0) && (round > 1) && (userDeck.monsters.length === 0) && (userDeck.boosters.length === 0)) {
            PlayGame.cpterRound();
        }

        if((userDeck.monsters.length + userDeck.cardsOnBoard.length) < 3) {
            // Change picture vault boy
            let vaultBoy = document.querySelector('.vault-boy');
            vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy-loosing.png)';
        }

        // Display informations to user
        const infosField = document.querySelector('.infosField');

        if(round === 1) {
            infosField.innerHTML = `Welcome ! <br><br> Please drag and drop your first card on the board.`;
        } else {
            infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
        }

        // Handle cards
        const userCardsDom = document.querySelectorAll('.userCard');
    
        for (const userCardDom of userCardsDom) {

            // Initialisation of drag and drop
            dragAndDrop.init(userCardDom);

            // Listening drop
            userCardDom.addEventListener('dragend', function () {

                // Change picture vault boy
                if((userDeck.monsters.length + userDeck.cardsOnBoard.length) >= 3) {
                    let vaultBoy = document.querySelector('.vault-boy');
                    vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy.png)';
                }


                var x = event.clientX, y = event.clientY,
                eltFlewOver = document.elementFromPoint(x, y);

                


                // player put card on board
                if ((eltFlewOver.className === 'drop-area') || (eltFlewOver.className === 'drop-area show-message') || (eltFlewOver.closest(".drop-area") && (!userCardDom.classList.contains("booster")) )) {
                    
                    if(round == 1) {
                    eltFlewOver.className = 'drop-area';
                    eltFlewOver.innerHTML = '';
                    }

                    if(userCardDom.parentNode.className === 'drop-area') {
                        return
                    } else {

                    
                    eltFlewOver.closest(".drop-area").appendChild(userCardDom);

                    // Disable draggable
                    const playerCards = document.querySelectorAll('.userCard');
                    for(const card of playerCards) { card.draggable = false; }

                    // Display message
                    const infosField = document.querySelector('.infosField');
                    infosField.textContent = 'Click "end of round" or "cancel"';
                    endOfRoundButton = document.querySelector('.endOfRound');
                    endOfRoundButton.classList.remove('inactive');

                    // Cancel action
                    const cancel = document.createElement('button');
                    cancel.classList.add('cancel')
                    cancel.textContent = 'CANCEL'

                    document.querySelector('.sideArea').appendChild(cancel);

                    cancel.addEventListener("click", function() {
                        userCardDom.remove();
                        cancel.remove();
                        document.querySelector('.playerCards').appendChild(userCardDom);

                        // reset draggable
                        const cardsOnHand = document.querySelector('.playerCards').childNodes;
                        for(const card of cardsOnHand) { card.draggable = true; }

                        const infosField = document.querySelector('.infosField');
                        infosField.innerHTML = 'Add a card on the board or play a card from the board to attack computer';
                    })

                    // Handle end of round
                    const handleEndOfRound = () => {
                        endOfRoundButton.classList.add('inactive');
                        endOfRoundButton.removeEventListener("click", handleEndOfRound);
                        
                        // Find card in state
                        const cardKey = userCardDom.getAttribute('data-key');
                        const monster = userDeck.monsters.find(monster => monster.key == cardKey);
                        console.log("ici on essaie de pusher", monster)
                        userDeck.cardsOnBoard.push(monster);

                        // Delete card in main array
                        let index = userDeck.monsters.indexOf(monster);
                        userDeck.monsters.splice(index, 1);

                        document.querySelector('.cancel').remove();

                        PlayGame.cpterRound();
                    }

                        endOfRoundButton.addEventListener('click', handleEndOfRound);
                    }

                    
                } else if ((eltFlewOver.parentNode.className === 'cpterCards') || (eltFlewOver.className === 'card-picture cpter'))  {
                    
                    // Player attack a computer card
                    const cpterCardDom = eltFlewOver.closest('.cardComponent');

                    if(userCardDom.classList.contains("booster")) {
                        alert('You can\'t attack with a booster');
                    } else {

                        // Select user and player cards in state
                        let cardAttack = userDeck.cardsOnBoard.find(card => card.key == userCardDom.getAttribute('data-key'))
                        let cardDefense = cpterDeck.cardsOnBoard.find(card => card.key == cpterCardDom.getAttribute('data-key'))
                        PlayGame.fight(cardAttack, cardDefense);
                    }
                } else if((eltFlewOver.className === 'card-picture user')) {

                    //If user card is monster appendchild newcard
                    if(eltFlewOver.classList.contains("monster")) {
                        return;
                    } else if(userCardDom.classList.contains("booster")) {
                        console.log("coco")
                        if(eltFlewOver.classList.contains("user")) {

                            const dropArea = document.querySelector('.drop-area');
                            dropArea.appendChild(userCardDom);

                            // Detect monster card selected
                            const monsterCardDom = eltFlewOver.closest('.cardComponent');

                            PlayGame.userAddBooster(userCardDom, monsterCardDom);

                            
                        }
                    }
                }
                
            });
        }
        
    },

    cpterRound: function() {

        // Disable draggable
        const playerCards = document.querySelectorAll('.userCard');
        for(const card of playerCards) { card.draggable = false; }

        if(cpterDeck.monsters.length > 0 || cpterDeck.boosters.length > 0) {

            let randomNbr = Math.floor(Math.random()*10)+1;

            // IF RANDOM NUMBER > 7 OR ROUND 1, CPTER ADD A CARD ON BOARD
            if(randomNbr >= 7 || round == 1 || cpterDeck.cardsOnBoard.length <= 0 || userDeck.cardsOnBoard.length <= 0) {

                // Getting a new random number
                randomNbr = Math.floor(Math.random()*10)+1;

                    if(cpterDeck.monsters.length > 0) {

                        if((randomNbr > 6) && (cpterDeck.boosters.length > 0) && (cpterDeck.cardsOnBoard.length > 0)) {
                            PlayGame.cpterAddCard("booster");
                        } else {
                            PlayGame.cpterAddCard("monster");
                        }

                    } else if (cpterDeck.boosters.length > 0) {

                        if((randomNbr > 0 && randomNbr < 7) && (cpterDeck.monsters.length > 0)) {
                            PlayGame.cpterAddCard("monster");
                        } else if(cpterDeck.cardsOnBoard.length > 0) {
                            PlayGame.cpterAddCard("booster");
                        } else {
                            PlayGame.cpterAddCard("monster");
                        }
                    }
            } else if(randomNbr > 0 && randomNbr <= 6) {
                PlayGame.cpterAttack();
            } 

        } else {
            PlayGame.cpterAttack();
        }

    },

    userAddBooster: async function(boosterCard, monsterCard) {

        // Get monster informations
        const cardKeyMonster = monsterCard.getAttribute('data-key');
        const monster = await userDeck.cardsOnBoard.find(card => card.key == cardKeyMonster);

        // Get booster informations
        const cardKeyBooster = boosterCard.getAttribute('data-key');
        const booster = await userDeck.boosters.find(booster => booster.key == cardKeyBooster);

        animation.moveCards(boosterCard, monsterCard)



        setTimeout(function(){ 

            const typeBooster = booster.special_effect_text;

            const bonus = booster.special_effect_value + monster[typeBooster];

            // update monster card value in dom
            let textBonus = monsterCard.querySelector(`.${typeBooster}`);
            textBonus.textContent = bonus;

            // update monster card value
            monster[typeBooster] = bonus;

            // Delete card in dom
            boosterCard.remove();

            // Delete card in state
            let index = userDeck.boosters.indexOf(booster);
            userDeck.boosters.splice(index, 1);

            setTimeout(function(){ 
                PlayGame.cpterRound();
            }, 1000);
            }, 2000);
    },


    fight: function(cardAttack, cardDefense) {

        // Disable draggable
        const playerCards = document.querySelectorAll('.userCard');
        for(const card of playerCards) { card.draggable = false; }

        // Algorithm for damage
        const coefficient = cardAttack.attack - cardDefense.defense;

        let damageToDefenser = null;
        if(coefficient <= 0) {
            damageToDefenser = Math.floor(Math.random()*2)+1;
        } else {
            damageToDefenser = Math.floor(Math.random()*3)+coefficient;
        }

        let damageToAttacker = null;
        if(damageToDefenser == 1) {
            damageToAttacker = 0;
        } else {
            damageToAttacker = damageToDefenser - 1;
        }

        const initialAttackHp = cardAttack.hit_point;
        const initialDefenseHp = cardDefense.hit_point;

        cardAttack.hit_point = cardAttack.hit_point - damageToAttacker;
        cardDefense.hit_point = cardDefense.hit_point - damageToDefenser;

        // Getting cards in dom
        const cardAttackDom = document.querySelector(`div[data-key="${cardAttack.key}"]`);
        const cardDefenseDom = document.querySelector(`div[data-key="${cardDefense.key}"]`);

        // Animation
        if(cardAttack.owner === 'cpter') {
            animation.moveCards(cardAttackDom, cardDefenseDom)
        } else {
            animation.blink(cardAttackDom, cardDefenseDom)
        }

        setTimeout(function(){ 
            // Update values in dom
            if(cardAttack.hit_point != initialAttackHp) {
                let attackerHp = cardAttackDom.querySelector('.hit_point');
                attackerHp.textContent = cardAttack.hit_point;

                attackerHp.classList.add('blink_hit-point');
                setTimeout(function(){ 
                    attackerHp.classList.remove('blink_hit-point');
                }, 1000);
            }

            if(cardDefense.hit_point != initialDefenseHp) {
                let defenserHp = cardDefenseDom.querySelector('.hit_point');
                defenserHp.textContent = cardDefense.hit_point;

                defenserHp.classList.add('blink_hit-point');
                setTimeout(function(){ 
                    defenserHp.classList.remove('blink_hit-point');
                }, 1000);
            }

            // Handle fight result
            if(cardAttack.hit_point <= 0) {
                setTimeout(function(){ 
                // delete card on board
                cardAttackDom.remove();
                // delete card in state
                if(cardAttack.owner === 'cpter') {
                    let index = cpterDeck.cardsOnBoard.indexOf(cardAttack);
                    cpterDeck.cardsOnBoard.splice(index, 1);
                } else {
                    let indexCardsOnBoard = userDeck.cardsOnBoard.indexOf(cardAttack);
                    userDeck.cardsOnBoard.splice(indexCardsOnBoard, 1);
                }
                }, 1000);
            }

            if(cardDefense.hit_point <= 0) {
                setTimeout(function(){ 
                // delete card on board
                cardDefenseDom.remove();
                // delete card in state
                if(cardDefense.owner === 'cpter') {
                    let index = cpterDeck.cardsOnBoard.indexOf(cardDefense);
                    cpterDeck.cardsOnBoard.splice(index, 1);

                } else {
                    let indexCardsOnBoard = userDeck.cardsOnBoard.indexOf(cardDefense);
                    userDeck.cardsOnBoard.splice(indexCardsOnBoard, 1);

                    // Change picture vault boy
                    let vaultBoy = document.querySelector('.vault-boy');
                    vaultBoy.style.backgroundImage = 'url(assets/img/vault-boy/vault-boy-angry.png)';
                }

                }, 1000);
            }

            setTimeout(function(){ 
            if((cpterDeck.monsters.length === 0) && (cpterDeck.cardsOnBoard.length === 0)) {
                // User win
                const mainContainer = document.querySelector('.board-game');
                mainContainer.innerHTML = DomRenderOther.endGame("win");
                const backMainMenu = document.querySelector('.back');
                backMainMenu.addEventListener('click',  (e) => {
                    e.preventDefault();
                    document.location.reload();
                    // mainContainer.classList = "container";
                    // mainContainer.innerHTML = Menu.render("logged")
                });
            } else if((userDeck.monsters.length === 0) && (userDeck.cardsOnBoard.length === 0)) {
                // Computer win
                const mainContainer = document.querySelector('.board-game');
                mainContainer.innerHTML = DomRenderOther.endGame("Loose");
                const backMainMenu = document.querySelector('.back');
                backMainMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    mainContainer.classList.add("container");
                    mainContainer.classList.remove("board-game")
                    InitGame.init("pouet");
                })
            } else {
            // TOGGLE PLAYER ROUND
                if(cardAttack.owner === 'cpter') {
                    PlayGame.userRound() ;
                } else {
                    setTimeout(function(){ 
                        PlayGame.cpterRound();
                    }, 1000);
                }
            }
            }, 1000);

        }, 3000);

    },

    cpterAddCard: function(cardType) {

        const infosField = document.querySelector('.infosField');
        infosField.textContent = "...Computer is playing..."

        // Handle booster cards
        if(cardType === 'booster') {

            // Get random booster card
            const booster = cpterDeck.boosters[Math.floor(Math.random()*cpterDeck.boosters.length)];

            // Generating booster card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.booster(booster, 'cpter')

            // Get random monster card from board to apply boost
            const monster = cpterDeck.cardsOnBoard[Math.floor(Math.random()*cpterDeck.cardsOnBoard.length)];

            // Get monster card on board
            let monsterDom = document.querySelector(`div[data-key="${monster.key}"]`);
            let boosterDom = document.querySelector(`div[data-key="${booster.key}"]`);

            animation.moveCards(boosterDom, monsterDom);

            setTimeout(function(){ 

                const typeBooster = booster.special_effect_text;

                const bonus = booster.special_effect_value + monster[typeBooster];

                // update monster card value in dom
                let textBonus = monsterDom.querySelector(`.${typeBooster}`);
                textBonus.textContent = bonus;

                // update monster card value
                monster[typeBooster] = bonus;

                // Delete card in dom
                boosterDom.remove();

                // Delete card in state
                let index = cpterDeck.boosters.indexOf(booster);
                cpterDeck.boosters.splice(index, 1);

                PlayGame.userRound();
                }, 2000);

        } else {

            // Get random monster card
            const monster = cpterDeck.monsters[Math.floor(Math.random()*cpterDeck.monsters.length)];

            // Generating monster card on board
            const cardsContainer = document.querySelector('.cpterCards');
            cardsContainer.innerHTML += DomRenderCard.monster(monster, 'cpter')

            // Add card on array "cardsOnBoard"
            cpterDeck.cardsOnBoard.push(monster);

            // Delete card in main array
            let index = cpterDeck.monsters.indexOf(monster);
            cpterDeck.monsters.splice(index, 1);

            PlayGame.userRound();
        }
    },

    cpterAttack: function() {

        const infosField = document.querySelector('.infosField');
        infosField.textContent = "...Computer is playing..."

        // Getting computer cards on board and select one
        let cardAttack = cpterDeck.cardsOnBoard[Math.floor(Math.random()*cpterDeck.cardsOnBoard.length)];

        // Getting user cards on board and select one
        let cardDefense = userDeck.cardsOnBoard[Math.floor(Math.random()*userDeck.cardsOnBoard.length)];

        // Select each card in dom
        let cardAttackDom = document.querySelector(`div[data-key="${cardAttack.key}"]`);
        let cardDefenseDom = document.querySelector(`div[data-key="${cardDefense.key}"]`);

        setTimeout(function(){
            animation.moveCards(cardAttackDom, cardDefenseDom)
            PlayGame.fight(cardAttack, cardDefense)
        }, 1000);

    }
}

module.exports = PlayGame;