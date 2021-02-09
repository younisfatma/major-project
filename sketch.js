// Fatma Younis 
// Computer Science 30
// Mr. Schellenberg
// Grid assignment

// Extra for experts:
// obstical collision
// character skins (images)
// automatically moving object in grid
// sounds
// fonts

// Array for start screen
let start = {x: 0, y: 0, isAlive: true,};

// Variables for the game
let x;
let y;
let foods;
let player = {x:0 , y:0, radius: 15, speed: 5, color: "white"};
let byeFood = false;
let grow = false;
let win = true;
let begin = true;
let end = false;


// Used to tell the time since the game started
let seconds = 0;
let minutes= 0;
let lastSecond = 0;
let lastAddedFood = 0;
let timeLastAddeddFood = 0;
let millisSinceGameStarted;

// Obstacle variables
const ROWS = 15;
const COLS = 15;
let grid = createGrid(ROWS,COLS); 
let rows, cols, cellWidth, cellHeight;
let obstacle = {x: 100, y: 100}; 
let obX = 0;
let obY = 0;

// Previous location of obstacle
let prevobX = 0;
let prevobY = 0;
let state = "right";

// Rectangle collision
let rectx, recty;
let hit = false;

// Images
let bgImg, evilImg, hamsterImg, whaleImg, zombieImg, skeletonImg;
let images = [];
let imagenumber = 0;

// Sounds
let bgSound, lossSound, victorySound;
let millisSinceLossSoundPlayed = 0;

// Font
let font;

function preload(){
  // Images
  bgImg = loadImage("assets/bg.png");
  evilImg = loadImage ("assets/evil.png");
  hamsterImg = loadImage ("assets/hamster.png");
  zombieImg = loadImage ("assets/zombie.png");
  whaleImg = loadImage ("assets/whale.png");
  skeletonImg = loadImage ("assets/skeleton.png");
  images.push(evilImg, hamsterImg, zombieImg, whaleImg, skeletonImg);

  // Sounds
  bgSound = loadSound("assets/backgroundMusic.mp3");
  lossSound = loadSound("assets/loss.mp3");
  victorySound = loadSound("assets/Victory.mp3");

  // Font
  font = loadFont("assets/ARCADECLASSIC.TTF");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  player.x = width / 2;
  player.y = height / 2;

  // Creates the first food
  foods = [{x: random(0, width), y: random(0, width), radius: 10,},];

  // Obstacle grid 
  rows = grid.length;
  cols = grid[0].length;
  cellWidth = width/cols;
  cellHeight = height/rows;

  // Play sound
  bgSound.play();
}

// When the window is resized the canvas is also resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Start screen
  displayStart();
  
  // If mouse is pressed win becomes false and the game is started
  if (win === false) {
    gridBackGround();
    obstacles();
    checkByeFood();
    createBall();
    move();
    stopBall();
    time();
    displayWonScreen();
  }
  // End screen
  displayLostScreen();
}

// Start screen
function displayStart() { 
  if (start.isAlive) {
    image(bgImg, 0,0, width, height);

    fill("white");
    textFont(font);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);
    text("CLICK TO START", width / 2, height / 2);
    
    textSize(18);
    fill(50);
    textStyle(NORMAL);
    text("EAT AS MUCH FOOD AS YOU CAN TO WIN! IF YOU COLLIDE WITH GREEN OBSTICAL YOU LOSE!", width/2, height*11/16);
    text("Right Click to Change your Character", width/2, height*3/4);
    text("Use WASD to Control", width/2, height*13/16);
    
    // Time value
    millisSinceGameStarted = millis();
  }
}
 
// Creates the background
function gridBackGround(){
  background(0);
  for (let x = 0; x < width; x += 25) {
    for (let y = 0; y < height; y += 25) {
      noStroke();
      fill(40);
      circle(x, y, 10);
    }
  }
}

// Creates and displays the time
function time(){
  if (millis() - millisSinceGameStarted - lastSecond >= 1){
    seconds +=1;
    lastSecond += 1000;
    if (seconds >= 60){
      seconds = 0;
      minutes +=1;
    }
  }
  fill("white");
  text("Time  "+ minutes + ":"+ seconds, 80, 30); 
}

// Starts the game and controls color of the ball
function mousePressed() {
  if (start.isAlive === true) {
    start.isAlive = false;
    win = false;
  }

  // Controls what skin to display
  if (imagenumber < 4){
    imagenumber+=1;
  }
  else{
    imagenumber=0;
  }
}

// Checks if the food is eaten
function checkByeFood() {
  if (byeFood === false) {
    createFood();
  }
  byeFood = eatFood(byeFood);
}

// Creates the player balll
function createBall() {
  noStroke();
  fill(color(255,255,255,0));
  ellipse(player.x, player.y, player.radius * 2, player.radius * 2);
  ellipseMode(CENTER);

  // Character skins
  imageMode(CENTER);
  image(images[imagenumber], player.x, player.y, player.radius*2, player.radius*2 );
}

// Moves the ball
function move() {
  if (keyIsDown(65)) { //a
    player.x -= player.speed;
  }

  if (keyIsDown(68)) { ///s
    player.x += player.speed;
  }

  if (keyIsDown(87)) { //w
    player.y -= player.speed;
  }
  if (keyIsDown(83)) { //d
    player.y += player.speed;
  }
}

// Stops the ball from flying off the window
function stopBall() {
  if (player.x - player.radius < 0) {
    player.x = player.radius;
  }
  if (player.x + player.radius > width) {
    player.x = width - player.radius;
  }
  if (player.y - player.radius < 0) {
    player.y = player.radius;
  }
  if (player.y + player.radius > height) {
    player.y = height - player.radius;
  }
}

// Makes the ball grow bigger
function ballWidth() {
  player.radius += 3;
  if (player.speed > 1 && player.speed > 1) {
    player.speed -= 0.05;
  }
}

// Creates the food for the player to eat
function createFood() { 
  for (let food of foods){
    noStroke();
    fill("yellow");
    circle(food.x, food.y, food.radius * 2);
  }
  if (millis()-lastAddedFood > 4000+timeLastAddeddFood ){
    foods.push({x: random(0, width), y: random(0, width), radius: 10,});
    lastAddedFood = millis();
    timeLastAddeddFood +=2000;
    
  }
}

// Determines when the player has touched the food, calls the food to grow, and chooses a new location for the food
function eatFood(byeFood) {
  for (let food of foods){
    if (player.x <= food.x + player.radius && player.x >= food.x - player.radius && player.y <= food.y + player.radius && player.y >= food.y - player.radius) {
      ballWidth();
      if (player.x > food.x + player.radius && player.x < food.x - player.radius && player.y > food.y + player.radius && player.y < food.y - player.radius) { //determines if player has moved or not
        food.x = random(0, width);
        food.y = random(0, height);
        return true;
      }
      food.x = random(0, width);
      food.y = random(0, height);
    }
  }
  return false;
}

// Green obstacle
function obstacles(){
  createObstacle();
  checkCollision();
  if (frameCount% 20 === 0){
    moveObstacle();
    determineState();
  }
}

// Creates the obstacle
function createObstacle(){
  grid[prevobY][prevobX] = 0;
  grid[obY][obX] = 1;
  displayGrid();
}

// Moves the obstacle
function moveObstacle(){
  // Used to return the current block back to transparent
  prevobX = obX;
  prevobY = obY;

  // Moves the obstacle
  if (obY !== rows && obX !== cols){
    if (state=== "right" ) {
      obX += 1;
    }
    else if (state === "down"){
      obY += 1;
    }
    else if (state === "left"){
      obX -= 1;
    }
    else if (state ==="up"){
      obY -= 1;
    }
  }
}

// Determines what direction to travel
function determineState(){
  if (state === "right" && obY === 0 && obX === cols-1){ 
    state = "down";
  }
  else if (state === "down" && obY === rows-1 && obX === cols-1){
    state = "left";
  }
  else if (state === "left" && obY === rows-1 && obX === 0){
    state = "up";
  }
  else if (state === "up" && obY === 0 && obX === 0){
    state = "right";
  }
}

// Create's grid for the obstacle
function createGrid(cols, rows){
  let grid = [];
  for (let y = 0; y < rows; y++){
    grid.push([]);
    for (let x = 0; x < cols; x++){
      grid[y].push(0);
    }
  }
  return grid;
}

// Display's grid for the obstacle
function displayGrid(){
  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      if (grid[y][x] === 1){
        rectx = x*cellWidth;
        recty = y*cellHeight;
        fill("lime");
        noStroke();
        rect(rectx, recty, cellWidth, cellHeight);
      } 
    }
  }
}

// Collision (this doesnt work once the player gets to a certain size)
function checkCollision(){
  hit = collideRectCircle(rectx, recty, cellWidth, cellHeight, player.x, player.y, player.radius);
  if (hit) {
    // Ends the game
    win = true;
    end = true;
    millisSinceLossSoundPlayed = millis();
  }
}

// If the player has grown more than width/6 the player wins the game
function displayWonScreen() {
  if (player.radius > width / 6) {
    // Victory sound 
    bgSound.pause();
    victorySound.play();

    win = true;
    background(0);
    fill("green");
    textSize(50);
    textAlign(CENTER);
    textStyle(BOLD);
    text("YOU WON", width / 2, height / 2);
  }
}

// If player hits green obstacal they lose
function displayLostScreen(){
  if (end){
    // Plays loss sound for 3 seconds
    bgSound.pause();
    if (millis() - millisSinceLossSoundPlayed < 3000){
      lossSound.play();
    }
    else{
      lossSound.stop();
    }

    background(0);
    fill("red");
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);
    text("YOU LOST", width / 2, height / 2);
  }
}