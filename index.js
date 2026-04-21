import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

//const prompt = require("prompt-sync")({ sigint: true });

// TODO: Game elements/assets constants
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";

// TODO: UP / DOWN / LEFT / RIGHT / QUIT default keyboard constants
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";

// TODO: MSG_UP / MSG_DOWN / MSG_LEFT / MSG_RIGHT / MSG_ QUIT / MSG_INVALID message constants
const FEEDBACK_UP = "You moved up";
const FEEDBACK_DOWN = "You moved down";
const FEEDBACK_LEFT = "You moved left";
const FEEDBACK_RIGHT = "You moved right";
const FEEDBACK_QUIT = "You have quit the game";
const FEEDBACK_INVALID = "Invalid input";

// TODO: WIN / LOSE / OUT / QUIT messages constants
const WIN_MSG = "Congratulations, you have won!";
const LOSE_MSG = "Game over. You fell into a hole.";
const OUT_MSG = "Game over. You stepped out of the platform.";
const QUIT_MSG = "You quit the game, thank you for playing.";

// TODO: MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 8;
const COLS = 8;
const PERCENT = 0.2;


class Field {

  score = 0;

  // TODO: constructor, a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gameplay = false;
    this.x = 0; //for tracking x(horizontal) position of player on map
    this.y = 0; //for tracking y(Vertical) position of player on map
  }
  // TODO: generateField is a static method, returning a 2D array of the fields

  static generateField(rows, col, percentage) {
    const map = [[]];
    for (let i = 0; i < rows; i++) {
      map[i] = [];    //generate the row for the map

      for (let j = 0; j < col; j++) {
        map[i][j] = Math.random() > PERCENT ? GRASS : HOLE;    //populate grass per column in each row

      }

    }
    return map;
  }
  // TODO: welcomeMessage is a static method, displays a string
  static welcomeMsg(msg) {
    console.log(msg);
  }

  // TODO: setHat positions the hat along a random x and y position within field array
  setHat(){
    const x = Math.floor(Math.random() * (ROWS -1)) + 1;    //establish a random position of X in the field
    const y = Math.floor(Math.random() * (COLS -1)) + 1;    //establish a random position of Y in the field
    this.field[x][y] = HAT;  //set the hat along the derived random position this.field[x][y]
  }
  // TODO: printField displays the updated status of the field position
  printField(){
    this.field.forEach(row => console.log(row.join('')));  //omits the spaces within the fields so it is seamless
  }
  // TODO: updateMove displays the move (key) entered by the user
  updateMove(direction){
      console.log(direction);
  }

  // !! TODO: updateGame Assessment Challenge
  updateGame(){
    
      // check the following conditions:
      // 1. Whether the player fell into a hole, end the game
      // 2. Whether the player moved out of the map, end the game
      // 3. Whether the player moved to the hat, wins the game
      // 4. Whether the player moved to grass spot, continue the game
      // Update position of the player on the map
    
    // 1. Check if out of bounds
    if (this.y < 0 || this.y >= ROWS || this.x < 0 || this.x >= COLS) {
      console.log(OUT_MSG);
      this.#end();
      return;
    }

    // 2. Check if player fell into a hole
    if (this.field[this.y][this.x] === HOLE) {
      console.log(LOSE_MSG);
      this.#end();
      return;
    }

    // 3. Check if player found the hat
    if (this.field[this.y][this.x] === HAT) {
      console.log(WIN_MSG);
      this.#end();
      return;
    }

    // 4. Update the map with the player's new position
    this.field[this.y][this.x] = PLAYER;

  }

    // * start() a public method of the class to start the game
  start(){
    this.gamePlay = true;
          
    this.field[0][0] = PLAYER;   //set the player's position to the start of the map
    this.setHat();

    while(this.gamePlay){        // while gamePlay is true, ask the user for an input (W), (A), (S), (D) or (Q)

      this.printField();
      const input = prompt("Enter (w)up, (s)down, (a)left, (d)right. Press (q) to quit.");
      let flagInvalid = false; //use a flag to determine if the game entry is correct
      let feedback = "";

      const oldX = this.x;
      const oldY = this.y;

      switch (input.toUpperCase()) {
        case UP:
          this.y -= 1;
          feedback = FEEDBACK_UP;
          break;
        case DOWN:
          this.y += 1;
          feedback = FEEDBACK_DOWN;
          break;
        case LEFT:
          this.x -= 1;
          feedback = FEEDBACK_LEFT;
          break;
        case RIGHT:
          this.x += 1;
          feedback = FEEDBACK_RIGHT;
          break;
        case QUIT:
          feedback = FEEDBACK_QUIT;
          this.#end();
          break;
        default:
          feedback = FEEDBACK_INVALID;
          flagInvalid = true;
          break;
      }

      this.updateMove(feedback);

      if (!flagInvalid){     // flagInvalid is a boolean
        //replace previous position with GRASS
        if (this.field[oldY] && this.field[oldY][oldX] === PLAYER){
          this.field[oldY][oldX] = GRASS;
        }
        //update the gameplay
        this.updateGame();
      }

    }
  }
  //end() a private method to end the game

  #end() {
    this.gamePlay = false;
    process.exit();
  }

}


// TODO: Generate a new field - using Field's static method: generateField
const createField = Field.generateField(ROWS, COLS, PERCENT);


// TODO: Generate a welcome message
Field.welcomeMsg("\n************WELCOME TO FIND YOUR HAT************\n");

// TODO: Create a new instance of the game
// by passing createField as a parameter to the new instance of field
const gameField = new Field(createField);
// TODO: Invoke method start(...) from the instance of game object

gameField.start();

//  ! method #end() cannot be instantiated by the instance of Field - it is a private method
// gameField.#end(); // ❌