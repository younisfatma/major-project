// Fatma Younis 
// Computer Science 30
// Mr. Schellenberg
// Major Project

//rules
// use WASD to control character
//you can hide under the green circle, as soon as you grow larger than the circle you will start to take damage

//start/win screens
let start = {x: 0, y: 0, isAlive: true,};
let win = true;
let reset;

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
let bgSound, victorySound, eatSound, shrinkSound;
let victorySoundOn;

// Font
let font;
let playerName; 

// game variables
let thePlayer;
let theFoods = [];
let theObstacles = [];
let points = 0;

function preload(){
  // Images
  obsImage = loadImage ("assets/obs.png");
  dragonImage = loadImage ("assets/dragon.png");
  octopusImage = loadImage ("assets/octopus.png");
  sharImage = loadImage ("assets/shar.png");
  pikaImage = loadImage ("assets/pika.png");
  images.push(dragonImage, octopusImage, sharImage, pikaImage);

  // Sounds
  bgSound = loadSound("assets/backgroundMusic.mp3");
  victorySound = loadSound("assets/Victory.mp3");
  victorySoundOn = false;
  eatSound = loadSound("assets/eat.mp3");
  shrinkSound = loadSound("assets/click.mp3");

  // Font
  font = loadFont("assets/ARCADECLASSIC.TTF");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerName = window.prompt("Enter player name: ");
  points = 0;

  // Play sound
  bgSound.play();

  //makes objects
  thePlayer = new Player;
  let oneObstacle = new Obstacle;
  theObstacles.push(oneObstacle);
}

function draw() {
  background(255);
  if (win === false) {
    thePlayer.display();
    thePlayer.move();
    foods();
    obstacles();
  }

  time();
  displayStart();
  displayWonScreen();
}

// Start screen
function displayStart() { 
  if (keyIsPressed) {
    start.isAlive = false;
    win = false;
  }

  if (start.isAlive) {
    fill("black");
    textFont(font);
    textSize(40);
    textAlign(CENTER);
    textStyle(BOLD);
    text("PRESS ANY KEY TO START", width / 2, height / 2);

    //buttons for changing skins and colors
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

    //display player
    thePlayer.display();

    // Time value
    millisSinceGameStarted = millis();
  }
}

//displays time
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
  textSize(20);
  fill("black");
  text("Time  "+ minutes + ":"+ seconds, 80, 30); 
}

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
    //skin change
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
  if(win === true && mouseX >=286 && mouseX <=591 && mouseY >=224 && mouseY<575 && reset === true){
    setup();
    start.isAlive = true;
    reset = false;
    console.log(mouseX, mouseY);
    seconds = 0;
    minutes= 0;
    lastSecond = 0;
    for (let i = theFoods.length-1; i >=0; i--){
      theFoods.splice(i ,1);
    }
  }
}

//makes new food
function spawnFood(){
  let newFood = new Food;
  theFoods.push(newFood);
}

//displays and removes food
function foods(){
  for (let i = theFoods.length-1; i >= 0; i--){
    theFoods[i].display();
    //checks for collision
    theFoods[i].hit();
    if(theFoods[i].eaten){ 
      theFoods.splice(i, 1);
      thePlayer.radius+=2;
    }
  }
}

//displays obstacles and checks for collision
function obstacles(){
  for (let i = theObstacles.length-1; i >= 0; i--){
    theObstacles[i].display();
    theObstacles[i].collide();
  }
}

class Player{
  constructor(){
    this.x= width/2;
    this.y = height*3/4;
    this.radius = 20;
    this.speed = 5;
    this.color = "black";
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

    //display's the player name
    text(playerName, this.x, this.y - this.radius - 25);
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
  constructor(){ 
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
      eatSound.play();
      console.log("yum");
      thePlayer.radius += this.radius/2;
      thePlayer.speed-=0.05;
      points += this.radius/2;
    }
  }
}

class Obstacle{
  constructor(){
    this.diameter = random(50, 100);
    this.x = random(0, width - this.diameter);
    this.y = random(0, height - this.diameter);
    this.hit= false;
    this.color = "lime";
    this.move = random(1,2);
  }

  display(){
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);

    imageMode(CENTER);
    image(obsImage, this.x, this.y, this.diameter, this.diameter);
  }

  collide(){
    this.hit= collideCircleCircle(this.x, this.y, this.diameter, thePlayer.x, thePlayer.y, thePlayer.radius*2);
    if (this.hit){
      console.log("ouch");
    }
    if(this.hit && this.diameter <= thePlayer.radius*2 && thePlayer.radius*2 >= 40){
      thePlayer.radius-=5;
      shrinkSound.play();
    }
  }
}

// If the player has grown more than width/6 the player wins the game
function displayWonScreen() {
  if (thePlayer.radius*2 > width / 4) {
    // Victory sound 
    if(victorySoundOn === false){
      bgSound.pause();
      victorySound.play();
      victorySoundOn = true;
    }

 
    //text
    background(0);
    fill("green");
    textSize(50);
    textAlign(CENTER);
    textStyle(BOLD);
    text("YOU WON ", width / 2, height / 4);

    //displays points
    if (points>=100){
      text("points  " + points.toPrecision(3), width/2, height/2);
    }
    else if (points >= 1000){
      text("point  "+ points.toPrecision(4), width/2, height/2);
    }
    else{
      text("points   " + points.toPrecision(2), width/2, height/2);
    }

    //displays restart button
    rectMode(CENTER);
    rect(width/2, height*3/4, 200, 70);
    fill("white");
    text("RESTART", width/2, height*3/4);

    //reseting some values
    win = true;
    reset = true;
  }
}