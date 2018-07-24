var numCards = 4;
var cards = [];
var firstGuessId = -1;
var timer = 0;
var hideCardsTimer = 0;
var correctGuessTimer = 0;
var pics = [];
//var cardBack;
//var tableCloth;
var winFlag = false;
var buttons = [];
var font;
var score = 0;
var timerDelay = 15;

function preload() {
	// soundFormats('mp3');
	correctPlay = loadSound('data/correctPlay.mp3');
	levelComplete = loadSound('data/levelComplete.mp3');
}

function setup() {
	
	
	correctPlay.setVolume(0.6);
	levelComplete.setVolume(0.4);
	
  // createCanvas(window.innerWidth * 0.95, window.innerHeight * 0.95);
  createCanvas(window.innerWidth * 1, window.innerHeight * 1);
  frameRate(30);
  
  createBoard();
  myFont = loadFont('data/impact.ttf');
  textFont(myFont);
  cardBack = loadImage("data/cardBack.jpg");
  tableCloth = loadImage("data/tableCloth.jpg");
  soundOn = loadImage("data/soundOn.gif");
  soundOff = loadImage("data/soundOff.gif");
  soundIcon = new soundButton();
  
  if (buttons != null){
    for (var i = 0; i < 4; i++){
      buttons[i] = new Button(i * width / 5 + width / 10, height / 8,
      width / 6, height / 10, i);
    }
  }
  
  pictures = [
    "001.jpg",
    "005.jpg",
    "036.JPG",
    "121.jpg",
    "1516.jpg",
    "IMG_1318.JPG",
    "IMG_1314.JPG",
    "IMG_1316.JPG",
    "IMG_1312.JPG",
    "IMG_1310.JPG",
    "IMG_1307.JPG",
    "IMG_1305.JPG",
    "IMG_1270.jpg",
    "IMG_1026.jpg",
    "IMG_1263.jpg",
    "IMG_0961.jpg",
    "IMG_1207.jpg",
    "chucky.jpg",
    "yellowy.jpg"
  ]
  
  // WE SHOULD SHUFFLE THE IMAGES HERE
  pictures = shuffle(pictures);
  for (let i = 0; i < numCards; i++) {
	  pics[i] = loadImage("data/" + pictures[i]);
  }
}

function draw() {
  background(0, 50, 120, 255);
  fill(255, 255, 255, 255);
  imageMode(CORNER);
  tableCloth.resize(width, height);
  background(tableCloth);
  
  if (localStorage.getItem("highScore" + numCards)){
	  push();
	  textAlign(LEFT, TOP);
	  textSize(min(width, height) / 30);
	  text("High score: " + localStorage.getItem("highScore" + numCards), 5, 5);
	  pop();
  }
  
  if (! winFlag) {
    timer += 1;
  }
  
  hideCardsTimer -= 1;
  if (hideCardsTimer == 0){
    hideCards();
  }
  
  correctGuessTimer -= 1;
  if (correctGuessTimer == 0){
    correctGuess();
  }
  
  for (let card of cards){
    card.show();
  }
  
  if (winFlag) {
    for (let button of buttons) {
      button.visible = true;
    }
    winner();
  }
  
  for (let button of buttons) {
    button.show();
  }
  
  soundIcon.show();
  
}

function createBoard() {
  var nextX, nextY, gap;
  var cardWidth = min(height, width) / sqrt (2 * numCards);
  gap = cardWidth / 6;
  nextX = gap;
  nextY = gap;
  var maxX = 0;
  ids = [];
  
  // make a list of ids
  for (let i = 0; i < numCards * 2; i++) {
    if (i < numCards) {
      ids.push(i);
    } else {
      ids.push(i - numCards);
    }
  }
  // shuffle ids to use as param for new Cards
  ids = shuffle(ids);
  
  // Create Cards and put them in array: cards
  for (let i = 0; i < 2 * numCards; i++){
    if(nextX + gap + cardWidth > width){
      nextX = gap;
      nextY += (cardWidth * 3 / 4 + gap);
    }
	
	cards.push(new Card(nextX, nextY, cardWidth, ids[i]));
	nextX += (gap + cardWidth);
  }
  
  // center the cards on the board
  // centering on the x is harder because the last card may not be farthest right
  while (true) {
	  for (let card of cards) {
		  if (card.x > maxX) {
			  maxX = card.x;
		  }
	  }
	  if (cards[0].x < width - (maxX + cards[0].w + gap / 2)) {
		  for (let card of cards) {
			  card.x += gap / 8;
		  }
	  } else {
		  break;
	  }
  }
  
  // center the y axis
  while (cards[0].y < height - (cards[cards.length - 1].y + cards[0].h + gap)) {
	  for (let card of cards) {
		  card.y += gap / 8;
	  }
  }
}

function mousePressed() {
	if (winFlag) {
		for (let button of buttons) {
			if (button.checkPressed()){
				button.action();
			}
		}
	}
	// If someone wants to play faster clicking the screen will let them
	if (hideCardsTimer > 0) {
		// added a buffer to timerDelay for touch screens touching too fast
		if (hideCardsTimer < timerDelay - 6) {
			hideCardsTimer = 1;
		}
		return;
	} else if (correctGuessTimer > 0 && hideCardsTimer < timerDelay * 2 - 6) {
		if (correctGuessTimer < timerDelay * 2 - 6) {
			correctGuessTimer = 1;
		}
		return;
		// bug fix. Starting a new game would select the first card.
	} else if (timer < 5) {
		return;
	}
	
	// Did someone click a card?
	for (let i = cards.length - 1; i >= 0; i--) {
		if (cards[i].x < mouseX && cards[i].x + cards[i].w > mouseX
      && cards[i].y < mouseY && cards[i].y + cards[i].w > mouseY
      && ! cards[i].visible
    ){
      cards[i].visible = true;
      checkGuess(cards[i].id);
      return;
    }
	}
	if (
    soundIcon.x - soundIcon.r / 2 < mouseX
    && mouseX < soundIcon.x + soundIcon.r / 2
    && soundIcon.y - soundIcon.r / 2 < mouseY
    && mouseY < soundIcon.y + soundIcon.r / 2
  ) {
    soundIcon.change();
  }
}

function checkGuess(id){
	// this 'if' covers the first card of two to be checked
	if (firstGuessId == -1){
    firstGuessId = id;
  } else if (firstGuessId == id) {
    // do stuff for correct answer
    correctGuessTimer = timerDelay;
    score += numCards * 5;
    //correctPlay.amp(0.8);
    //correctPlay.play();
  } else{
    // do stuff for incorrect answer
    firstGuessId = -1;
    hideCardsTimer = timerDelay * 2;
    score -= numCards * 1;
  }
}

function hideCards() {
  for (let card of cards) {
    card.visible = false;
  }
}

function correctGuess() {
  if (cards.length == 2) {
    winFlag = true;
	if (soundIcon.mode == 'on'){
	  levelComplete.play();
	}
    return;
  }
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].id == firstGuessId) {
      cards.splice(i, 1);
    }
  }
  if (soundIcon.mode == 'on'){
	correctPlay.play();
  }
  firstGuessId = -1;
}

function winner() {
  push();
  textAlign(CENTER, BOTTOM);
  var bigness = min(width, height) / 5;
  textSize(bigness);
  fill(255, 0, 0, 255);
  text("You Win!", width / 2, height / 2);
  textAlign(CENTER, TOP);
  fill(255, 255, 255, 255);
  textSize(bigness / 2);
  text("score: " + score, width / 2, height / 2);
  //text("seconds: "+ str(timer / 30), width / 2, height / 2);
  textAlign(CENTER, CENTER);
  text("Start New Game", width / 2, height / 16);
  if (! localStorage.getItem("highScore" + numCards)  || localStorage.getItem("highScore" + numCards) < score) {
	  localStorage.setItem("highScore" + numCards, score);
  }
  if (localStorage.getItem("highScore" + numCards) == score) {
	  // stroke('yellow');
	  // strokeWeight(bigness / 20);
	  textAlign(CENTER, BOTTOM);
	  textSize(bigness);
	  fill('yellow');
	  text("HIGH SCORE!!!", width / 2, height - height / 20);
	  fill('white');
	  text("HIGH SCORE!!!", width / 2 + width / 200, height - height / 20 + height / 200);
  }
  pop();
}

function newGame(tempNumCards) {
  numCards = tempNumCards;
  cards.length = 0;
  timer = 0;
  setup();
  firstGuessId = -1;
  correctGuessTimer = 0;
  hideCardsTimer = 0;
  winFlag = false;
  score = 0;
}
