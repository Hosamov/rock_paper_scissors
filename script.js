import devices from './gameLogic.js';

//DOM Element targets:
const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const uiPlayer = document.querySelector('.ui-player');
const playerScore = document.getElementById('player-score');
const aiScore = document.getElementById('ai-score');
const playerTie = document.getElementById('player-tie');
const aiTie = document.getElementById('ai-tie');
const uiComputer = document.querySelector('.ui-computer');

//Declare global variables:
const newDeck = []; //init newDeck var to hold all card values before dispersing
const playerDecks = [ [],[] ];
const cardImageBack = './images/card_back.png';
let tieArr = []; // Array to keep track of tied cards
let [p1, p2] = playerDecks; // p1 = human player, p2 = ai player
let cardFlipped = false; // Globally track whether card is flipped
let currentCard = 0; // Iterator for current card index

/*
* Function to create a new deck with 18, 36, or 54 cards
* @param  {Number} num  Iterator value (9, 12, 18)
*/
function createDeck(num) {
  const classes = ['Rock', 'Paper', 'Scissors'];
  for (let i = 0; i < num; i++) {
    newDeck.push(...classes);
  }
  shuffleDeck(newDeck); // Shuffle new deck to randomize gameplay
}

/*
 * Function to shuffle the deck
 * @param {array} Holds cards to shuffle
 * @source  https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
 */
function shuffleDeck(array) {
  currentCard = 0; //reset index of currentCard to 0;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  dealCards(array); // fairly deal cards out to both players
};

/*
* Function that evenly distributes randomized decks to each player
* @param {Array} newDeck  Array for newly shuffled deck
*/
function dealCards(newDeck) {
  for (let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }

  // Pass starting cards to P1 & P2
  runGameInstance(p1[currentCard], p2[currentCard]);
  currentCard++;
  uiHandler(p1, p2); //send array data to ui handler
}

/*
* Function that adds two cards (from p1 and p2's deck) to the display.
* @param {String} p1ImageFront  Card image for P1
* @param {String} p2ImageFront  Card image for P2
* return Insert HTML
*/
function addUpdateCard(p1ImageFront, p2ImageFront) { //classes: ai-card, player-card
  playArea.innerHTML = ''; //Clear the play area of existing cards

  (!cardFlipped) ?
  // Initially display back of card:
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

/*
* Function that displays a win/lose message in center of the screen with an
* action button.
* @param  {String} message  Win/lose message
* @param  {String} btnText  Text for btnEl
* @param  {String} state    For determining button state
* @param  {Boolean} hasWon  Passthrough param for tracking win/lose state
*/
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

/*
* Function that draws a new card for each player
* @param  {Boolean} hasWon  State of win/lose for round
*/
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

  // Run an updated instance of the game, using each player's next card:
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
* Function to run the actual game instance
* @param  {String} p1Card  Name of P1's current card
* @param  {String} p2Card  Name of P2's current card
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
          tieResult('win', 'lose');
          addMessage(`You win! ${device.device} beats ${device.win}.`, 'Draw again.', 'draw', true);
          tieWinHandler(p1);
          gameUpdateHandler(p1, p2, device.device, device.win);
        } else if (p2Card === device.lose) {
          tieResult('lose', 'win');
          addMessage(`You lose. ${device.device} loses to ${device.lose}.`, 'Draw again.', 'draw', false);
          tieWinHandler(p2);
          gameUpdateHandler(p2, p1, device.device); // Note: P2 takes only 3 args (as opposed to 4 for p1)
        } else { // Begin War...
          addMessage(`Tie round.`, 'Draw again.', 'draw');
          tieArr.push(p1Card, p2Card); //place tied cards in their own array

          // Remove both P1's & P2's tied cards from their hands temporarily:
          p1.shift(0);
          p2.shift(0);

          const btnEl = document.getElementById('action-button');
          btnEl.addEventListener('click', () => {
            // Add card images to respective game tie areas
            setTimeout(() => {
              playerTie.insertAdjacentHTML('beforeend', `
                <img src=${device.assets[0]}>
              `);
              aiTie.insertAdjacentHTML('beforeend', `
                <img src=${device.assets[0]}>
              `);
            }, 600);
          })
        }
      }
    });
  });
}


//////////////////////////HELPER FUNCTIONS//////////////////////

// Display current cards per player:
function uiHandler() {
  aiScore.innerHTML = `<i class="fas fa-desktop"></i> AI: ${p2.length} cards`;
  playerScore.innerHTML = `<i class="fas fa-user"></i> Player: ${p1.length} cards`;
}

// Function to add proper classNames then clear the tie area:
function tieResult(class1, class2) {
  playerTie.classList.add(class1);
  aiTie.classList.add(class2);
  setTimeout(() => clearTied(), 2000);
}

// Function to reset tie DOM elements:
function clearTied() {
  playerTie.classList.remove('win', 'lose');
  aiTie.classList.remove('win', 'lose');
  playerTie.innerHTML = '';
  aiTie.innerHTML = '';
}

/*
* Helper function that takes two player areas and two card values, then
* add/remove in correct hand:
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

/*
* Helper function to distribute cards to the winning player
*/
function tieWinHandler(playerArr) {
  if (tieArr.length) {
    playerArr.push(...tieArr);
    tieArr = []; //empty global array
  }
}

/*
 * Helper function to get and return the corresponding device image randomly
 * from assets list.
 * Note: There are 3 (three) total images to display per device (see gameLogic.js).
 */
function cardImageHandler(card) {

  // TODO: Figure out how to make tie card the same as what's shown on the screen

  for (let device of devices) {
    const randomImage = Math.floor(Math.random() * device.assets.length);
    if (card === device.device) {
      return device.assets[randomImage];
    }
  }
}

//TODO: Add end game functionality (winning/losing message, 'restart game' button)
//TODO: Add click handler for player to start a new game (shuffle deck)
//TODO: Add game instructions prior to game start

// Start game:
createDeck(18); // 9, 12, 18
