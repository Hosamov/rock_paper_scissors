const container = document.getElementById('container');
const playArea = document.getElementById('play-area');

const newDeck = [];
const playerDecks =[[],[]];

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
  distributeCards(newDeck);
};

function addCard(card) {
  playArea.insertAdjacentHTML('beforeend', `
    <div class="card">
      <h2>${card}</h2>
    </div>
  `);
}

//distribute equal amount of cards to individual players' decks
function distributeCards(newDeck) {
  //evenly distribute randomized decks to two players:
  //https://stackoverflow.com/questions/44655347/move-every-other-value-from-array-into-a-new-array
  for(let i = 0; i < newDeck.length; i++) {
    playerDecks[i % 2].push(newDeck[i]); //check odd/even values, push value to respective player decks
  }
  let [p1, p2] = playerDecks; //p1 = human; p2 = ai

  addCard(p1[0]);
  addCard(p2[0]);
}

createDeck();
