# Rock Paper Scissors War
### A new take on the classic card game War, with Rock Paper Scissors.
#### v0.0.2
#### Game Designed by: Matt Coale (https://backyarddev.io) & Sally Coale (https://sallyscraftstudio.com)

### Technologies:
- HTML
- CSS
- Vanilla JavaScript

### Game Details:
- Note: P1 is the player; P2 is the computer/AI player
- AI player is displayed at the top, Human player is displayed on the bottom.
- AI player is signified with the color red, whereas the human player is blue.
- An orange border or background signifies in the game that the specified card is tied with its counterpart.

### How to play:
1. Player first must choose how many cards to play with (18, 36, or 54).
2. The cards are shuffled (behind the scenes) and two cards are automatically played. the game area is now active.
3. To play, the player must click the blue-bordered card (the AI card, labeled with a red border, is not able to be clicked by the player).
4. The cards will immediately be overturned, displaying the dealt cards for both the human and AI players.
5. A message modal will display within two (2) seconds, containing a win/lose message for the specific round, and a button the user must click to continue.
6. Depending on the outcome of Steps 4 and 5, the cards will then behave as follows:
  - a. The human player wins both cards currently in the play area.
  - b. The AI player wins both cards currently in the play area.
  - c. It's a tie round and "War" begins. Here's how War works:
    - The tied cards are pushed to their respective "tie" areas (AI's area is directly up, human player is directly down).
    - Player continues to draw from the main deck (clicking active card/follow Steps 3-5) until either the human or AI player draws a more powerful card.
    - All cards from both tie areas are dispersed to the player who drew the winning card.
    - War is over.
7. The game ends when either player possesses all cards.
  - A modal will appear displaying a Win/Lose message with a prompt to restart or quit the game.

#### Report bugs to: hosamov@hotmail.com
