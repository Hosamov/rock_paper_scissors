import devices from './cardData.js';

// Target global DOM Elements:
const playArea = document.getElementById('play-area');
const instructions = document.getElementById('instructions');
const playerTie = document.getElementById('player-tie');
const aiTie = document.getElementById('ai-tie');
const tiePot = document.getElementById('tie-pot');
const tiePotText = document.querySelector('.tie-pot-centered');
const infoContainer = document.getElementById('info-container');

//Declare needed global variables needed:
let gameStart = true;
let deckSize = 18; // initial value (18, 36, 54)
let newDeck = []; //init newDeck to hold all card values before dealing
let playerDecks = [ [],[] ];
let [p1, p2] = playerDecks; // p1 = human player, p2 = ai player
let tieArr = []; // Array to keep track of tied cards
let cardFlipped = false; // Globally track whether card is flipped
let currentCard = 0; // index of current card in player's deck

/*
* Function to display the main game menu/information div
*/
function infoMessage() {
  const deckCount = document.querySelector('.deck-count');
  const btnDeck = document.querySelectorAll('.btn-deck');
  const btnShuffleDeck = document.querySelector('.btn-shuffle-deck');

  infoContainer.classList.toggle('visible');

  // Iterate through buttons, change card value and add active class to selected button
  btnDeck.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Iterate through btnDeck, remove active class for appending to new btn
      for(let i = 0; i < btnDeck.length; i++) btnDeck[i].classList.remove('active');

      deckSize = e.target.value;
      deckCount.innerText = `${deckSize} cards`; // Display deck size to user
      btn.classList.add('active');
    });
  });

  // Click handler for the Start Game button:
  btnShuffleDeck.addEventListener('click', () => {
    console.log('Shuffling deck and starting a new game...');
    gameStart = false;
    // Start new game instance:
    createDeck(deckSize, true); // (Chosen deck size, is new game instance)
    handleFAIcon();
  });
}

/*
* Function to create a new deck with 18, 36, or 54 cards
* @param  {Number} num  Iterator value (9, 12, 18)
*/
function createDeck(num, gameReset) {
  if(gameReset) {
    // Reset the global vars for a new game iteration:
    newDeck = [];
    playerDecks = [[],[]];
    [p1, p2] = playerDecks;
    tieArr = [];
    currentCard = 0;
    tiePot.classList.remove('active');
  }

  const splitNum = (num / 3);
  const classes = ['Rock', 'Paper', 'Scissors'];
  for (let i = 0; i < splitNum; i++) {
    newDeck.push(...classes);
  }
   // Shuffle deck and deal out cards
   shuffleDeck(newDeck);
   dealCards(newDeck);
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
  return array;
}

/*
* Function that evenly distributes randomized decks to each player
* @param {Array} newDeck  Array for newly shuffled deck
*/
function dealCards(newDeck) {
  for (let i = 0; i < newDeck.length; i++) {
    // Check odd/even values, push value to respective player decks
    playerDecks[i % 2].push(newDeck[i]);
  }

  // Pass starting cards to P1 & P2
  runGameInstance(p1[currentCard], p2[currentCard]);
  currentCard++;
  uiHandler(p1, p2); // Send current score data to ui handler
}

/*
* Function that adds two cards (from p1 and p2's deck) to the display.
* @param {String} p1ImageFront  Card image for P1
* @param {String} p2ImageFront  Card image for P2
*/
function addUpdateCard(p1ImageFront, p2ImageFront) { //classes: ai-card, player-card
  const cardImageBack = './images/card_back.png';
  playArea.innerHTML = ''; //Clear the play area of existing cards

  // Display back of card until cardFlipped:
  playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <img src="${!cardFlipped ? cardImageBack : p2ImageFront}">
    </div>
    <div class="player-card">
      <img src="${!cardFlipped ? cardImageBack : p1ImageFront}">
    </div>
  `);
  cardFlipped = false; // Reset global var for reuse
}

/*
* Function that displays a win/lose message in center of the screen with an
* action button.
* @param  {String} message  Win/lose message
* @param  {String} btnText  Text for btnEl
*/
function addMessage(message, btnText) {
  const container = document.getElementById('container');
  container.insertAdjacentHTML('beforeend', `
    <div id="message" class="message">
      <h4>${message}</h4>
      <button id="action-button" class="btn">${btnText}</button>
    </div>
  `);

  const btnEl = document.getElementById('action-button');
  const messageEl = document.getElementById('message');

  // Note: Programmed it this way to allow for future expansion
  setTimeout(() => messageEl.classList.add('visible'), 1000);
    // Add button functionality:
    btnEl.innerText = btnText;
    btnEl.addEventListener('click', () => {
      setTimeout(() => {
        location.reload(); // Page refresh to reload
      }, 2000);
      container.lastElementChild.remove(); //remove message container from display
    });
}

/*
* Function that draws a new card for each player
* @param  {Boolean} hasWon  State of win/lose for round
*/
function drawCard(hasWon) {
  setTimeout(() => {
    // Animate card styles based on P1 win/lose/tie state:
    if(hasWon === true && hasWon !== null) {
      winLoseTieHandler('win', 'lose');
    } else if(hasWon === false) {
      winLoseTieHandler('lose', 'win');
    } else {
      winLoseTieHandler('tie', 'tie');
    }
  }, 2000); // 2s

  // Clear play area, draw new cards:
  setTimeout(() => {
    if (hasWon) playArea.innerHTML = ''; // Reset play area

    // Ensure there are still cards before resetting index:
    if(p1[currentCard] === undefined || p2[currentCard] === undefined) {
      currentCard = 0;
    }

    // Draw new card at the current index
    runGameInstance(p1[currentCard], p2[currentCard]);
    currentCard++;
  }, 3000); // 3s
}

/*
* Function to run the actual game instance
* @param  {String} p1Card  Name of P1's current card
* @param  {String} p2Card  Name of P2's current card
*/
function runGameInstance(p1Card, p2Card) {
  uiHandler(); // Update scores

  // Assess both player arrays to determine whether game is over
  if(p1.length <= 0 || p2.length <= 0) {
    return endGame();
  }

  // Add starting cards
  addUpdateCard(cardImageHandler(p1Card), cardImageHandler(p2Card));
  const playerCard = document.querySelector('.player-card img');

  // Perform following logic once game area has been clicked on:
  playerCard.addEventListener('click', () => {
    cardFlipped = true;
    addUpdateCard(cardImageHandler(p1Card), cardImageHandler(p2Card)); //flip cards over

    // Loop through devices array to check cards against each other:
    devices.forEach(device => {
      if (p1Card === device.device) {
        if (p2Card === device.win) {
          deviceUpdateHandler(true, 'win', 'lose', p1);
          gameUpdateHandler(p1, p2, device.device, device.win);
        } else if (p2Card === device.lose) {
          deviceUpdateHandler(false, 'lose', 'win', p2);
          gameUpdateHandler(p2, p1, device.device); // Note: P2 takes only 3 args (as opposed to 4 for P1)
        } else { // Tie round: Begin War...
          drawCard(); // Arg: NULL
          tieArr.push(p1Card, p2Card); // Place tied cards into their own array

          // Shuffle both P1 & P2 decks to add randomness after > 4 cards in tie pot
          if (tieArr.length > 4) {
            console.log('Shuffling decks...');
            shuffleDeck(p1);
            shuffleDeck(p2);
          }
          // Remove both P1 & P2's tied cards from their hands temporarily:
          p1.shift(0);
          p2.shift(0);

          // Display the tie pot:
          setTimeout(() => {
            tiePot.classList.add('active');
            tiePotText.innerText = tieArr.length;
          }, 2000); // Wait 2s
        }
      }
    });
  });
}

/*
* Function to test and return end game state
*/
function endGame() {
  // First, check if the tie pot exists:
  if(tiePot.classList.contains('active')) {
    // Give player with the most cards the tie pot
    if(p1 > p2) {
      tieResult('win', 'lose'), // P1 wins
      tieWinHandler(p1)
    } else if (p1 < p2) {
      tieResult('lose', 'win'), // P2 wins
      tieWinHandler(p2)
    } else {
      tieResult(); // Tie game (no player gets the pot)
    }
  }

  setTimeout(() => {
    playArea.innerHTML = '';
    if(p1.length === 0 && p2.length > 0) {
      return addMessage('Game over. Better luck next time.', 'Play Again', 'shuffle');
    } else if (p1.length > 0 && p2.length === 0) {
      return addMessage('Congratulations...You win!', 'Play Again', 'shuffle');
    } else {
      return addMessage('Tie game.', 'Play Again', 'shuffle');
    }
  }, 2000); // 2s
}


////HELPER FUNCTIONS////

// Function to animate Win/Lose/Tie state:
function winLoseTieHandler(p1State, p2State) {
  const playerCard = document.querySelector('.player-card');
  const aiCard = document.querySelector('.ai-card');
  playerCard.classList.add(p1State);
  aiCard.classList.add(p2State);
}

// Helper function to call main functions from within runGameInstance():
function deviceUpdateHandler(bool, res1, res2, tieWinner) {
  drawCard(bool);
  tieResult(res1, res2);
  tieWinHandler(tieWinner);
}

// Helper function to display current cards per player:
function uiHandler() {
  const playerScore = document.getElementById('player-score');
  const aiScore = document.getElementById('ai-score');
  aiScore.innerHTML = `<i class="fas fa-desktop"></i> AI: ${p2.length} cards`;
  playerScore.innerHTML = `<i class="fas fa-user"></i> Player: ${p1.length} cards`;
}


// Helper function to distribute cards to the winning player
function tieWinHandler(playerArr) {
  if (tieArr.length) {
    playerArr.push(...tieArr);
    tieArr = []; //empty global array
  }
}

// Function to append correct classnames then clear the tie area after tie break:
function tieResult(class1, class2) {
  playerTie.classList.add(class1);
  aiTie.classList.add(class2);
  setTimeout(() => clearTiePot(), 2000);
}

// Helper function to reset tie pot DOM elements after tie has been won:
function clearTiePot() {
  winTiePotAnimation();
  uiHandler();
  setTimeout(() => {
    tiePot.classList.remove('active', 'win', 'lose');
    playerTie.classList.remove('win', 'lose');
    aiTie.classList.remove('win', 'lose');
    tiePotText.innerText = '';
  }, 2000);
}

// Helper function to animate tie pot win/lose status
function winTiePotAnimation() {
  // Card animations for win/lose:
  if(playerTie.classList.contains('win')) {
    tiePot.classList.add('win');
    tiePot.classList.remove('lose');
  } else if (playerTie.classList.contains('lose')) {
    tiePot.classList.add('lose');
    tiePot.classList.remove('win');
  } else {
    tiePot.classList.remove('win', 'lose');
  }
}

// Function to change information icon based on visible state of info window
function handleFAIcon() {
  // If the game is just starting, dont' display an icon:
  if(gameStart === true) {
    instructions.innerHTML = ``;
    infoMessage(); // Do display info by default
  } else {
    // Otherwise, display the applicable information or gamepad FontAwesome icon:
    if(!infoContainer.classList.contains('visible')) {
      instructions.innerHTML = `<i class="fas fa-info-circle"></i>`;
    } else {
      instructions.innerHTML = `<i class="fas fa-gamepad"></i>`;
    }
    infoMessage();
  }
}

/*
* Helper function that takes two player arrays and two card values, then
* adds/removes to/from correct hand:
*/
function gameUpdateHandler(arr1, arr2, card, losingCard) {
  // Push card to win arr, shift card from lose arr
  return (!losingCard) ? (
    arr1.push(card),
    arr2.shift(card)
  ) : (
    arr1.push(losingCard),
    arr2.shift(losingCard)
  );
}

/*
 * Helper function to get and return the corresponding device image randomly
 * from list of assets
 * Note: There are 3 (three) total images to display per device (see cardData.js)
 */
function cardImageHandler(card) {
  for (let device of devices) {
    const randomImage = Math.floor(Math.random() * device.assets.length);
    if (card === device.device) {
      return device.assets[randomImage];
    }
  }
}

//////////////////////////

// Click handler for information button:
instructions.addEventListener('click', () => {
  handleFAIcon();
});

// Show info screen upon game start:
infoMessage();
