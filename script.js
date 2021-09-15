import devices from './gameLogic.js';

//DOM Elements:
const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const uiPlayer = document.querySelector('.ui-player');
const uiComputer = document.querySelector('.ui-computer');

//Declare global variables:
const newDeck = []; //init newDeck var to hold all card values before dispersing
const playerDecks =[[],[]];
const tieArr = []; // Array to keep track of tied cards
const cardImageBack = './images/card_back.png';
let [p1, p2] = playerDecks; //p1 = human; p2 = ai
let cardFlipped = false; // Globally track whether card is flipped

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

function addUpdateCard(p1ImageFront, p2ImageFront) { //classes: ai-card, player-card

  // TODO: Add functionality to display multiple stacked cards when WAR/tie has begun

  playArea.innerHTML = ''; //Clear the play area of cards
  (!cardFlipped) ?
  // initially display back of card:
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
  addUpdateCard(cardImageHandler(p1Card), cardImageHandler(p2Card));
  const playerCard = document.querySelector('.player-card img');

  // Perform logic once game area has been clicked on by player:
  playerCard.addEventListener('click', () => {
    cardFlipped = true;
    addUpdateCard(cardImageHandler(p1Card), cardImageHandler(p2Card)); //flip cards over

    // Loop through devices array to check cards against each other:
    devices.forEach(device => {
      if(p1Card === device.device) {
        console.log(p1);
        console.log(p2);
        console.log('You drew ' + device.device);
        if(p2Card === device.win) {
          console.log('You win! ' + device.device + ' beats ' + device.win);
          tieHandler(p1);
          gameUpdateHandler(p1, p2, device.device, device.win);
        } else if(p2Card === device.lose) {
          console.log('You lost... ' + device.device + ' loses to ' + device.lose);
          tieHandler(p2);
          gameUpdateHandler(p2, p1, device.device); //p2 takes only 3 args
        } else { // Begin War...
          //TODO: Write code for tie state...
            // Continue drawing cards until one player draws the higher card
            //  If two of the same card exist,
              //  remove them both from the respective players
              //  add them both to tieArr for future use
            //  When a player wins the round,
              // Push all cards to the winning player's array

          tieArr.push(p1Card, p2Card);
          console.log('Tie round.');
          console.log(tieArr);

        }
      }
    });
    //TODO: Fix bug that allows player to continuously click...
  });
}

/*
* Take two player areas and two card values, then add/remove them to/from the
* correct hand:
*/
function gameUpdateHandler(arr1, arr2, card, losingCard) {
  return (!losingCard) ? (
    arr1.push(card),
    arr2.shift(card),
    console.log(p1, p2)
  ) : (
    arr1.push(losingCard), //push losing card to player
    arr2.shift(losingCard), //remove losing card from ai
    console.log(p1, p2)
  );
}

function tieHandler(playerArr) {
  if(tieArr.length) {
    playerArr.push(...tieArr); //push all won cards to winning player's hand
    tieArr = []; //empty the global array
  }
}

/*
* Get and return the corresponding device image randomly from assets list:
* There are 3 (three) total images to display per device.
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
