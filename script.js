import devices from './gameLogic.js';

//DOM Elements:
const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const uiPlayer = document.querySelector('.ui-player');
const uiComputer = document.querySelector('.ui-computer');
// const messageEl = document.getElementById('message');
const actionBtn = document.getElementById('action-button');

//Declare global variables:
const newDeck = []; //init newDeck var to hold all card values before dispersing
const playerDecks = [ [],[] ];
const cardImageBack = './images/card_back.png';

let tieArr = []; // Array to keep track of tied cards
let [p1, p2] = playerDecks; //p1 = human; p2 = ai
let cardFlipped = false; // Globally track whether card is flipped
let currentCard = 0; //iterator for current card index

/*
 * Create a new deck with 32 cards (Game start):
 */
function createDeck() {
  const classes = ['Rock', 'Paper', 'Scissors'];
  for (let i = 0; i < 12; i++) {
    newDeck.push(...classes);
  }
  shuffleDeck(newDeck); // Shuffle new deck to randomize gameplay
}

/*
 * Shuffle deck:
 * https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 */
const shuffleDeck = (array) => {
  currentCard = 0; //reset index of currentCard to 0;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  dealCards(newDeck); // Deal cards out to players
};

// Evenly distribute randomized decks to each player:
function dealCards(newDeck) {
  for (let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }

  runGameInstance(p1[currentCard], p2[currentCard]); // pass starting cards to p1 & p2
  currentCard++;
  uiHandler(p1, p2); //send array data to ui handler
}

// Display current cards per player:
function uiHandler() {
  uiComputer.innerHTML = `<i class="fas fa-desktop"></i> AI: ${p2.length} cards`;
  uiPlayer.innerHTML = `<i class="fas fa-user"></i> Player: ${p1.length} cards`;
}

function addUpdateCard(p1ImageFront, p2ImageFront) { //classes: ai-card, player-card

  // TODO: Add functionality to display multiple stacked cards when WAR/tie has begun
  // if the current round is a tie...
    // display current cards in play
    // notify player, prompt to draw again
  // otherwise, the winning player collects all the cards.

  playArea.innerHTML = ''; //Clear the play area of existing cards
  (!cardFlipped) ?
  // initially display back of card:
  playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <img src="${cardImageBack}">
    </div>
    <div class="player-card">
      <img src="${cardImageBack}">
    </div>
  `):
    playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <img src="${p2ImageFront}">
    </div>
    <div class="player-card played">
      <img src="${p1ImageFront}">
    </div>
  `);
  cardFlipped = false; // Set global variable back to false for future reuse.
}

// Display a win/lose message in center of screen with action button:
function addMessage(message, btnText, state, hasWon) {
  container.insertAdjacentHTML('beforeend', `
    <div id="message" class="message">
      <h4>${message}</h4>
      <button id="action-button">${btnText}</button>
    </div>
  `);
  const btnEl = document.getElementById('action-button');
  const messageEl = document.getElementById('message');
  setTimeout(() => messageEl.classList.add('visible'), 1000);

  //Add button functionality:
  switch(state) {
    case 'draw':
      btnEl.innerText = 'Draw again.'
      btnEl.addEventListener('click', () => {
        drawCard(hasWon);
        container.lastElementChild.remove(); //remove message container
      });
      break;
    case 'shuffle': // Win
      btnEl.innerText = 'Play again?'
      btnEl.addEventListener('click', () => console.log('Shuffling deck'));
      break;
  }
}

//Draw a new card
function drawCard(hasWon) {
  uiHandler();

  // Declare variables for elements needed
  const playerCard = document.querySelector('.player-card');
  const aiCard = document.querySelector('.ai-card');

  // Animate card styles based on win/lose/tie state:
  if(hasWon === true && hasWon !== null) {
    playerCard.classList.add('win');
    aiCard.classList.add('lose');
  } else if(hasWon === false) {
    playerCard.classList.add('lose');
    aiCard.classList.add('win');
  } else {
    playerCard.classList.add('tie');
    aiCard.classList.add('tie');
  }

  setTimeout(() => {
    if(hasWon === true) playArea.innerHTML = '';

    // Ensure currentCard resets when length has been reached:
    if(p1[currentCard] === undefined || p2[currentCard] === undefined) {
      currentCard = 0; // Reset position of currentCard
    }

    runGameInstance(p1[currentCard], p2[currentCard]); //draw new card at current index
    currentCard++;
  }, 1000);
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
      if (p1Card === device.device) {
        console.log('You drew ' + device.device);
        if (p2Card === device.win) {
          addMessage(`You win! ${device.device} beats ${device.win}.`, 'Draw again.', 'draw', true); // Add message to screen...
          tieWinHandler(p1);
          gameUpdateHandler(p1, p2, device.device, device.win);
        } else if (p2Card === device.lose) {
          addMessage(`You lost. ${device.device} loses to ${device.lose}.`, 'Draw again.', 'draw', false); // Add message to screen...
          tieWinHandler(p2);
          gameUpdateHandler(p2, p1, device.device); //p2 takes only 3 args
        } else { // Begin War...
          addMessage(`Tie round.`, 'Draw again.', 'draw'); // Add message to screen...
          tieArr.push(p1Card, p2Card);
          p1.shift(0); // Remove p1's current card
          p2.shift(0); // Remove p2's current card
        }
      }
    });
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

function tieWinHandler(playerArr) {
  if (tieArr.length) {
    playerArr.push(...tieArr); //push all won cards to winning player's hand
    tieArr = []; //empty the global array
  }
}

/*
 * Get and return the corresponding device image randomly from assets list:
 * There are 3 (three) total images to display per device.
 */
function cardImageHandler(card) {
  for (let device of devices) {
    const randomImage = Math.floor(Math.random() * device.assets.length);
    if (card === device.device) {
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
//TODO (maybe): Add ability for Player to add their name as the current player

createDeck(); // Start game
