const BoardGame = {
    render: () => {
        
        return `
            <div class="sideArea">
                <button class ="endOfRound inactive">END OF ROUND</button>
                <div class="infosFieldContainer"><p class="infosField"></p></div>
                <div class="infosField-bubble"></div>
                <div class="vault-boy"></div>
            </div>
            <div class="boardArea">
                <div class="cpterCards"></div>
                <div class="drop-area"></div>
            </div>
            <div class="playerCards"></div>
        `
    }
}

module.exports = BoardGame;