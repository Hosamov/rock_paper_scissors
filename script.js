import devices from './gameLogic.js';
const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const aiPlayArea = document.querySelector('.ai-play-area');
const playerPlayArea = document.querySelector('.player-play-area');
const uiPlayer = document.querySelector('.ui-player');
const uiComputer = document.querySelector('.ui-computer');
const playerCard = document.querySelector('.player-card');

const newDeck = []; //init newDeck var to hold all card values before dispersing
const playerDecks =[[],[]];
const cardImageBack = './images/card_back.png';

let cardFlipped = false; // Globally track whether card is flipped
let [p1, p2] = playerDecks; //p1 = human; p2 = ai

/*
* Create a new deck with 32 cards (Game start):
*/
function createDeck() {
  const classes = ['Rock', 'Paper', 'Scissors'];
  for(let i = 0; i < 12; i++) {
    newDeck.push(...classes);
  }
  shuffleDeck(newDeck); // Shuffle new deck to randomize gameplay
}

/*
* Shuffle deck:
* https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
*/
const shuffleDeck = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  dealCards(newDeck); // Deal cards out to players
};

// Evenly distribute randomized decks to two players:
function dealCards(newDeck) {
  for(let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }
  runGameInstance(p1[0], p2[0]); // pass starting cards to p1 & p2
  uiHandler(p1, p2); //send array data to ui handler
}

// Display current cards per player:
function uiHandler() {
  uiPlayer.innerHTML += " Player: " + p1.length + " cards";
  uiComputer.innerHTML += " AI: " + p2.length + " cards";
}

function addCard(p1ImageFront, p2ImageFront) { //classes: ai-card, player-card
  playArea.innerHTML = ''; //First, clear the play area
  (!cardFlipped) ?
  playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <img src="${cardImageBack}">
    </div>
    <div class="player-card">
      <img src="${cardImageBack}">
    </div>
  `) :
  playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <img src="${p2ImageFront}">
    </div>
    <div class="player-card">
      <img src="${p1ImageFront}">
    </div>
  `);
  cardFlipped = false; // Set global variable back to false for future reuse.
}

/*
* Add p1 & p2 cards to display;
* Click handler to check game logic/win state of p1 or p2
*/
function runGameInstance(p1Card, p2Card) {
  // Add starting cards
  addCard(cardImageHandler(p1Card), cardImageHandler(p2Card));

  // Test logic once game area has been clicked on by player:
  playArea.addEventListener('click', () => {
    cardFlipped = true;
    addCard(cardImageHandler(p1Card), cardImageHandler(p2Card)); //flip cards over

    devices.forEach(device => {
      if(p1Card === device.device) {
        console.log(p1);
        console.log(p2);
        console.log('You drew ' + device.device);
        if(p2Card === device.win) {
          console.log('You win! ' + device.device + ' beats ' + device.win);
          gameUpdateHandler(p1, p2, device.device, device.device);
        } else if(p2Card === device.lose) {
          console.log('You lost... ' + device.device + ' loses to ' + device.lose);
          gameUpdateHandler(p2, p1, device.device, device.device);
        } else {
          console.log('Tie round.');
          //TODO: Write code for tie state...
            // Continue drawing until one player draws the higher card
            // Push all cards to the winning player's array
        }
      }
    });
    //TODO: Fix bug that allows player to continuously click...
  });
}

/*
* Take two player areas and two card values, then add/remove them from the
* correct hand:
*/
function gameUpdateHandler(arr1, arr2, losingCard, winningCard) {
  arr1.push(winningCard);
  arr2.shift(losingCard);
  console.log(p1, p2);
}

/*
* Get and return the corresponding device image randomly from assets list:
*/
function cardImageHandler(card) {
  for(let device of devices) {
    const randomImage = Math.floor(Math.random() * device.assets.length);
    if(card === device.device) {
      return device.assets[randomImage];
    }
  }
}

// TODO: Game logic:
//If player's card beats opponent's, player takes both cards (check)
// otherwise, if opponent's card wins, opponent takes both cards. (check)
//If both cards are the same, WAR begins:
//play until a user wins... winner takes all cards currently in the play area.

//TODO: Add click handler for player to start a new game (shuffle deck)
//TODO: Add ability for Player to add their name as the current player
//TODO: Add click handler for player to draw/play a new card

createDeck(); // Start game
