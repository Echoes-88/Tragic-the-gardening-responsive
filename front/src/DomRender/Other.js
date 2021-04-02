const Other = {
    card: () => {
            return `
            <div class="black-filter"></div>
            <div class="exemple-container">
            <button class="close-button">Close</button>
                <div class="exemple-card">
                <img src="assets/img/exempleCard.png">
                <img src="assets/img/exempleCard-booster.png">
                </div>
            </div>
        `
    },
    endGame: (result) => {
        return `
        <div class="black-filter"></div>
        <div class="results">
            <img src="assets/img/${result}.png" class="logo">
            <p class="score">YOU ${result}</p>
            <button class="back">Back to main menu</button>
        </div>
    `
    }
}

module.exports = Other;