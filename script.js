import devices from './gameLogic.js';
const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const uiPlayer = document.querySelector('.ui-player');
const uiComputer = document.querySelector('.ui-computer');
const playerCard = document.querySelector('.player-card');

const newDeck = [];
const playerDecks =[[],[]];

let [p1, p2] = playerDecks; //p1 = human; p2 = ai
let p1CardInPlay;
let p2CardInPlay;

function createDeck() {
  const classes = ['Rock', 'Paper', 'Scissors'];
  for(let i = 0; i < 12; i++) {
    newDeck.push(...classes);
  }
  shuffleDeck(newDeck);
}

//Shuffle deck:
//https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
const shuffleDeck = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  dealCards(newDeck);
};

function addCard(card, image, divClass) {
  playArea.insertAdjacentHTML('beforeend', `
    <div class="${divClass}">
      <img src="${image}">
    </div>
  `);
}

// function addAICard(card, image) {
//   playArea.insertAdjacentHTML('beforeend', `
//     <div class="ai-card">
//       <img src="${image}">
//     </div>
//   `);
// }

//evenly distribute randomized decks to two players:
function dealCards(newDeck) {
  //https://stackoverflow.com/questions/44655347/move-every-other-value-from-array-into-a-new-array
  for(let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }
  runGameInstance(p1[0], p2[0]);
  uiHandler(p1, p2); //send array data to ui handler
}

function uiHandler() {
  uiPlayer.innerHTML += ": " + p1.length + " cards";
  uiComputer.innerHTML += ": " + p2.length + " cards";
}

function runGameInstance(p1Card, p2Card) {
  //TODO: Call a new function to get the correct images from gameLogic.js

  // Starting cards:
  addCard(p1Card, devices[0].assets[1], 'player-card');
  addCard(p2Card, devices[0].assets[1], 'ai-card');

  playArea.addEventListener('click', () => {
    // console.log(p1Card);
    testCards(p1Card, p2Card);

    //TODO: Fix bug that allows player to continuously click...
  });

  const testCards = (p1Card, p2Card) => {
    devices.forEach(device => {
      if(p1Card === device.device) {
        console.log(p1);
        console.log(p2);
        console.log('You drew ' + device.device);
        if(p2Card === device.win) {
          console.log('You win! ' + device.device + ' beats ' + device.win);
          // updateHandler(p1, p2, device.lose, device.win);
          updateHandler(p1, p2, device.device, device.device);
        } else if(p2Card === device.lose) {
          console.log('You lost... ' + device.device + ' loses to ' + device.lose);
          updateHandler(p2, p1, device.device, device.device);
        } else {
          alert('Tie round.');

          //TODO: Write code for tie state...
            // Continue drawing until one player draws the higher card
            // Push all cards to the winning player's array
        }
      }
    });
  }
}

// TODO: Game logic:
//If player's card beats opponent's, player takes both cards
// otherwise, if opponent's card wins, opponent takes both cards.
//If both cards are the same, WAR begins:
//play until a user wins... winner takes all cards currently in the play area.


//TODO: Add click handler for player to start a new game (shuffle deck)
//TODO: Add ability for Player to add their name as the current player
//TODO: Add click handler for player to draw/play a new card
function updateHandler(arr1, arr2, losingCard, winningCard) {
  arr1.push(winningCard);
  arr2.shift(losingCard);
  console.log(p1, p2);
}

function cardImageHandler(p1Card, p2Card) {

}

createDeck();
