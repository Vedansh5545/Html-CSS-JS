// Player object
let player = {
    name: "Vasu",
    credit: 300
};



// Declare variables
let firstCard = 0;
let secondCard = 0;
let sum = firstCard + secondCard;
let hasBlackJack = false;
let isAlive = true;
let messsage = "";
let messsageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardEl = document.querySelector("#card-el");
let playerel = document.getElementById("player-el");
let cards = [];
let text = "Card: " + cards[0] + ", " + cards[1];
let random = 0;
let randomNumber = 0;
let New_Card = 1;

// Function to start the game
function startGame() {
    firstCard = newCard();
    secondCard = newCard();
    sum = firstCard + secondCard;
}

// Function to render the game state
function renderGame() {
    if (sum <= 20) {
        messsage = "Do you want a new card 🤓";
    } else if (sum == 21) {
        hasBlackJack = true;
        messsage = "Woooo blackjack 🥳🥳🥳🥳";
    } else {
        isAlive = false;
        messsage = "You Lose 🥲";
    }
    messsageEl.textContent = messsage;
    sumEl.textContent = "Sum: " + sum;
    cardEl.textContent = text;
}

// Function to get a new card
function newCard() {
    if (hasBlackJack === false && isAlive === true) {
        New_Card = getRandom();
        cards.push(New_Card);
        sum = 0;
        text = "Cards: ";
        for (let i = 0; i < cards.length; i++) {
            if (cards[i] === "A") {
                sum = sum + 1;
            } else if (cards[i] == "J" || cards[i] == "K" || cards[i] == "Q") {
                sum = sum + 10;
            } else {
                sum = sum + cards[i];
            }
            text = text + cards[i] + " ";
        }
        if (sum == 21) {
            hasBlackJack = true;
        }
        if (sum >= 21) {
            isAlive = false;
        }
        sum = sum;
        renderGame();
        cardEl.textContent = text;
    }
}

// Function to get a random card
function getRandom() {
    let random = Math.floor(Math.random() * 12) + 1;
    let randomNumber = random;
    if (randomNumber == 1) {
        random = "A";
    } else if (randomNumber >= 10 && randomNumber <= 12) {
        random = ["J", "Q", "K"][randomNumber - 10];
    }
    return random;
}
// Display player information
playerel.textContent = player.name + ": $" + player.credit;


// Console logs
console.log(playerel);
console.log(player.name);
