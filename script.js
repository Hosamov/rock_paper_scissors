const container = document.getElementById('container');
const playArea = document.getElementById('play-area');
const uiPlayer = document.querySelector('.ui-player');
const uiComputer = document.querySelector('.ui-computer');

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

function addPlayerCard(card) {
  playArea.insertAdjacentHTML('beforeend', `
    <div class="player-card">
      <h2>${card}</h2>
    </div>
  `);
}

function addAICard(card) {
  playArea.insertAdjacentHTML('beforeend', `
    <div class="ai-card">
      <h2>${card}</h2>
    </div>
  `);
}

//evenly distribute randomized decks to two players:
function dealCards(newDeck) {
  //https://stackoverflow.com/questions/44655347/move-every-other-value-from-array-into-a-new-array
  for(let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }
  addAICard(p2[0]);
  addPlayerCard(p1[0]);
  uiHandler(p1, p2); //send array data to ui handler
}

function uiHandler() {
  uiPlayer.innerHTML += ": " + p1.length + " cards";
  uiComputer.innerHTML += ": " + p2.length + " cards";
}

//TODO: Add game logic...
//If player's card beats opponent's, player takes both cards
// otherwise, if opponent's card wins, opponent takes both cards.
//If both cards are the same, WAR begins:
//play until a user wins... winner takes all cards currently in the play area.
function runGameInstance(p1StartingCard, p2StartingCard) {

}



//TODO: Add click handler for player to start a new game (shuffle deck)

//TODO: Add ability for Player to add their name as the current player
//TODO: Add click handler for player to draw/play a new card


createDeck();
