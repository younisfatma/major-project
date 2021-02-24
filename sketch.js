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
let bgImg, evilImg, hamsterImg, whaleImg, zombieImg, skeletonImg, obsImage, dragonImage, octopusImage, sharImage, pikaImage;
let images = [];

// used to switch colors
let colorOptions = ["linen", "lightgrey", "aqua", "pink", "yellow", "DarkOrchid"];
let colorSlide = 0;

// Sounds
let bgSound, lossSound, victorySound;
let millisSinceLossSoundPlayed = 0;

// Font
let font;
let playerName; //text

// game variables
let thePlayer, theObstacles;
let theFoods= [];
let points = 0;

function preload(){
  // Images
  bgImg = loadImage("assets/bg.png");
  evilImg = loadImage ("assets/evil.png");
  hamsterImg = loadImage ("assets/hamster.png");
  zombieImg = loadImage ("assets/zombie.png");
  whaleImg = loadImage ("assets/whale.png");
  skeletonImg = loadImage ("assets/skeleton.png");
  obsImage =loadImage ("assets/obs.png");
  dragonImage =loadImage ("assets/dragon.png");
  octopusImage=loadImage ("assets/octopus.png");
  sharImage=loadImage ("assets/shar.png");
  pikaImage=loadImage ("assets/pika.png");


  images.push(dragonImage, octopusImage, sharImage, pikaImage);

  // Sounds
  bgSound = loadSound("assets/backgroundMusic.mp3");
  lossSound = loadSound("assets/loss.mp3");
  victorySound = loadSound("assets/Victory.mp3");

  // Font
  font = loadFont("assets/ARCADECLASSIC.TTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerName = window.prompt("Enter player name: ");

  // Play sound
  // bgSound.play();

  //make obstacles
  thePlayer = new Player();
  theObstacles = new Obstacle;
}

// When the window is resized the canvas is also resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  if (win === false) {
    checkFood();
  
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
  if (keyIsPressed) {
    start.isAlive = false;
    win = false;
  }

  if (start.isAlive) {
    // image(bgImg, 0,0, width, height);

    fill("black");
    textFont(font);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);
    text("PRESS ANY KEY TO START", width / 2, height / 2);

    //choosing the player skin
    thePlayer.display();
    //button
    fill("blue");
    rectMode(CENTER);
    rect(width*3/4, height*3/4, 100, 50);
    fill("white");
    textSize(30);
    textAlign(CENTER);
    text("color", width*3/4, height*3/4);
    
    fill("green");
    rectMode(CENTER);
    rect(width*3/4, height*3/4-50, 100, 50);
    fill("white");
    textSize(30);
    textAlign(CENTER);
    text("image", width*3/4, height*3/4-50);

    // textSize(18);
    // fill(50);
    // textStyle(NORMAL);
    // text("EAT AS MUCH FOOD AS YOU CAN TO WIN!", width/2, height*11/16);
    // text("Right Click to Change your Character", width/2, height*3/4);
    // text("Use WASD to Control", width/2, height*13/16);
    
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
  if (start.isAlive){
    //color change
    if (mouseX >= width*3/4-50 && mouseX <= width*3/4+50 && mouseY >= height*3/4-25 && mouseY<=height*3/4+25){
      console.log("true");
      thePlayer.color = colorOptions[0+colorSlide];
      if (colorSlide < 5){
        colorSlide+=1;
      }
      else{
        colorSlide=0;
      }
    }
    //image change
    if (mouseX >= width*3/4-50 && mouseX <= width*3/4+50 && mouseY >= height*3/4-25-50 && mouseY<=height*3/4+25-50){
      if (thePlayer.imagenumber < 3){
        thePlayer.imagenumber += 1; 
      }
      else{
        thePlayer.imagenumber = 0;
      }
    }
  }


  //restart button
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
function checkFood(){
  for (let i = theFoods.length-1; i > 0; i--){
    theFoods[i].display();
    theFoods[i].hit();
    if(theFoods[i].eaten){ //add only eat food that are smaller
      theFoods.splice(i, 1);
      thePlayer.radius+=2;
    }
  }
}

class Player{
  constructor(){
    this.x= width/2;
    this.y = height*3/4;
    this.radius = 20;
    this.speed = 5;
    this.color = "red";
    //(255,255,255,0);
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

    text(playerName, this.x+this.radius*2+25, this.y);
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
      thePlayer.speed-=0.05;
      points += this.radius/2;
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
    ellipse(this.x, this.y, this.length, this.length);

    imageMode(CENTER);
    image(obsImage, this.x, this.y, this.length, this.length);
  }

  collide(){
    this.hit= collideCircleCircle(this.x, this.y, this.length, thePlayer.x, thePlayer.y, thePlayer.radius*2);
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
    text("YOU WON ", width / 2, height / 2);

    text("point" + points.toPrecision(3), width/2, height/4);

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