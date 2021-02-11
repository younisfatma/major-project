// Fatma Younis 
// Computer Science 30
// Mr. Schellenberg
// Major Project

//start/win/lose screens
let start = {x: 0, y: 0, isAlive: true,};
let win = true;
let end = false;

// Used to tell the time since the game started
let seconds = 0;
let minutes= 0;
let lastSecond = 0;
let lastAddedFood = 0;
let timeLastAddeddFood = 0;
let millisSinceGameStarted;

// Images
let bgImg, evilImg, hamsterImg, whaleImg, zombieImg, skeletonImg;
let images = [];


// Sounds
let bgSound, lossSound, victorySound;
let millisSinceLossSoundPlayed = 0;

// Font
let font;

// game variables
let thePlayer, theObstacles;
let theFoods= [];

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
  thePlayer = new Player();
  theObstacles = new Obstacle;
  // Play sound
  // bgSound.play();
}

// When the window is resized the canvas is also resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  if (win === false) {
    for (let i = theFoods.length-1; i > 0; i--){
      theFoods[i].display();
      theFoods[i].hit();
      if(theFoods[i].eaten){ //add only eat food that are smaller
        theFoods.splice(i, 1);
        thePlayer.radius+=2;
      }
    }

    thePlayer.display();
    thePlayer.move();

    theObstacles.display();
    theObstacles.collide();
  }

  time();
  displayStart();
  displayWonScreen();
  displayLostScreen();
}

// Start screen
function displayStart() { 
  if (start.isAlive) {
    // image(bgImg, 0,0, width, height);

    fill("black");
    textFont(font);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);
    text("CLICK TO START", width / 2, height / 2);
    
    textSize(18);
    fill(50);
    textStyle(NORMAL);
    text("EAT AS MUCH FOOD AS YOU CAN TO WIN!", width/2, height*11/16);
    text("Right Click to Change your Character", width/2, height*3/4);
    text("Use WASD to Control", width/2, height*13/16);
    
    // Time value
    millisSinceGameStarted = millis();
  }
}

function time(){
  if (millis() - millisSinceGameStarted - lastSecond >= 1){ 
    seconds +=1;
    lastSecond += 1000;
    if (seconds >= 60){
      seconds = 0;
      minutes +=1;
    }
    spawnFood();
  }
  textFont(font);
  fill("black");
  text("Time  "+ minutes + ":"+ seconds, 80, 30); 
}

// Starts the game and controls color of the ball
function mousePressed() {
  if (start.isAlive === true) {
    start.isAlive = false;
    win = false;
  }
  //Controls what skin to display
  if (thePlayer.imagenumber < 4){
    thePlayer.imagenumber += 1;
  }
  else{
    thePlayer.imagenumber = 0;
  }

  //restart buttonw
  if(win === true && mouseX >=286 && mouseX <=591 && mouseY >=224 && mouseY<575){
    setup();
    start.isAlive = true;
    console.log(mouseX, mouseY);
    seconds = 0;
    minutes= 0;
    lastSecond = 0;
    for (let i = theFoods.length; i >=0; i--){
      theFoods.splice(i ,1);
    }
  }
}

function spawnFood(){
  let newFood = new Food;
  theFoods.push(newFood);//make new food spawn based on time
}

class Player{
  constructor(){
    this.x= width/2;
    this.y = height/2;
    this.radius = 20;
    this.speed = 5;
    this.color = color(255,255,255,0);
    this.imagenumber = 0;
  }

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
    ellipseMode(CENTER);

    // Character skins
    imageMode(CENTER);
    image(images[this.imagenumber], this.x, this.y, this.radius*2, this.radius*2 );
  }
  
  move(){
    if (keyIsDown(65)) { //a
      this.x -= this.speed;
    }
    
    if (keyIsDown(68)) { ///s
      this.x += this.speed;
    }
    
    if (keyIsDown(87)) { //w
      this.y -= this.speed;
    }
    if (keyIsDown(83)) { //d
      this.y += this.speed;
    }

    //prevent the player from flying off the screen
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    }
    if (this.x + this.radius > width) {
      this.x = width - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    }
    if (this.y + this.radius > height) {
      this.y = height - this.radius;
    }
  }

  
  radius(){
    this.radius += 3;
  }
}

class Food{
  constructor(shortRadius, largeRadius){ //havent done anything with these values yet
    this.x = random(0, width);
    this.y = random(0, height);
    this.radius = random(5, 20);
    this.color = color(random(255), random(255), random(255));
    this.eaten = false;
    
  }
  
  display(){
    noStroke();
    fill(this.color);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }

  hit(){
    this.eaten = collideCircleCircle(thePlayer.x, thePlayer.y, thePlayer.radius*2, this.x, this.y, this.radius*2);
    if (this.eaten){
      console.log("yum");
      thePlayer.radius += this.radius/2;
    }
  }
}

class Obstacle{
  constructor(){
    this.length = random(50, 100);
    this.x = random(0, width-this.length);
    this.y = random(0, height-this.length);
    this.dx = random(1, 5);
    this.dy = random(1, 5);
    this.hit= false;
    this.color = "lime";
  }

  display(){
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.length, this.length);
  }

  // move(){
  // }

  collide(){
    this.hit= collideRectCircle(this.x, this.y, this.length, this.length, thePlayer.x, thePlayer.y, thePlayer.radius*2);
    if (this.hit){
      console.log("ouch");
    }
    if(this.hit && this.length <= thePlayer.radius*2 && thePlayer.radius*2 >= 40){
      thePlayer.radius-=5;
    }
  }
}

// If the player has grown more than width/6 the player wins the game
function displayWonScreen() {
  if (thePlayer.radius*2 > width / 4) {
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

    rectMode(CENTER);
    rect(width/2, height*3/4, 200, 70);
    fill("white");
    text("RESTART", width/2, height*3/4);
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