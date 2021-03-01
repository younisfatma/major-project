// Fatma Younis 
// Computer Science 30
// Mr. Schellenberg
// Major Project

// Rules:
// use WASD to control character
// you can hide under the green circle, as soon as you grow larger than the circle you will start to take damage
// barriers dont work

// start/win screens
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
let theFoods;
let theObstacles;
let points = 0;
let maxX= 1000;
let maxY = 1000;
let minY= 0;
let minX = 0;
let secondsSinceSpawnedObstacle = 0;

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

  //sound
  bgSound.play();
  victorySoundOn = false;

  // makes objects
  thePlayer = new Player;

  theFoods = [];
  theObstacles = [];
  let oneObstacle = new Obstacle;
  theObstacles.push(oneObstacle);

  // reset
  maxX= 1000;
  maxY = 1000;
  minY= 0;
  minX = 0;
  points = 0;
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

// start screen
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
    text("PRESS ANY KEY TO START", width/2, height*3/4);

    // buttons for changing skins and colors
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

    // display player
    thePlayer.display();

    // time value
    millisSinceGameStarted = millis();
  }
}

// displays time
function time(){
  if (millis() - millisSinceGameStarted - lastSecond >= 1){ 
    seconds +=1;
    lastSecond += 1000;
    if (seconds >= 60){
      seconds = 0;
      minutes +=1;
    }
    spawnObstacle();
    spawnFood();
  }
  textFont(font);
  textSize(20);
  fill("black");
  text("Time  "+ minutes + ":"+ seconds, 80, 30); 
}

function mousePressed() {
  if (start.isAlive){
    // color change
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
    // skin change
    if (mouseX >= width*3/4-50 && mouseX <= width*3/4+50 && mouseY >= height*3/4-25-50 && mouseY<=height*3/4+25-50){
      if (thePlayer.imagenumber < 3){
        thePlayer.imagenumber += 1; 
      }
      else{
        thePlayer.imagenumber = 0;
      }
    }
  }

  // restart button
  if(win === true && mouseX >= width/2-100 && mouseX <=width/2+100 && mouseY >= height*3/4-35 && mouseY<= height*3/4+35 && reset === true){
    setup();
    start.isAlive = true;
    reset = false;
    seconds = 0;
    minutes= 0;
    lastSecond = 0;
  }
}

// makes new food
function spawnFood(){
  for (let i = 2; i >0 ; i--){
    let newFood = new Food;
    theFoods.push(newFood);
  }
}

// spawns obstacle
function spawnObstacle(){
  if (seconds - secondsSinceSpawnedObstacle >= 10){
    let oneObstacle = new Obstacle;
    theObstacles.push(oneObstacle);
    secondsSinceSpawnedObstacle = seconds;
  }
}

// displays and removes food
function foods(){
  for (let i = theFoods.length-1; i >= 0; i--){
    theFoods[i].display();
    // checks for collision
    theFoods[i].hit();
    if(theFoods[i].eaten){ 
      theFoods.splice(i, 1);
      thePlayer.radius+=2;
    }
  }
}

// displays obstacles and checks for collision
function obstacles(){
  for (let i = theObstacles.length-1; i >= 0; i--){
    theObstacles[i].display();
    theObstacles[i].collide();
  }
}

class Player{
  constructor(){
    this.x= width/2;
    this.y =  height/2;  //height*3/4;
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

    // character skins
    imageMode(CENTER);
    image(images[this.imagenumber], this.x, this.y, this.radius*2, this.radius*2 );

    // display's the player name
    text(playerName, this.x, this.y - this.radius - 25);
  }

  move(){
    if (keyIsDown(65)) { //a
      for (let i = theFoods.length-1; i >= 0; i--){
        theFoods[i].x += this.speed;
      }
      for (let i = theObstacles.length-1; i >= 0; i--){
        theObstacles[i].x += this.speed;
      }
      // maxX += this.speed;
      // minX -= this.speed;
    }
    if (keyIsDown(68)) { ///d
      for (let i = theFoods.length-1; i >= 0; i--){
        theFoods[i].x -= this.speed;
      }
      for (let i = theObstacles.length-1; i >= 0; i--){
        theObstacles[i].x -= this.speed;
      }
      // maxX -= this.speed;
      // minX += this.speed;
    }
    if (keyIsDown(87)) { //w
   
      for (let i = theFoods.length-1; i >= 0; i--){
        theFoods[i].y += this.speed;
      }
      for (let i = theObstacles.length-1; i >= 0; i--){
        theObstacles[i].y += this.speed;
      }
      // maxY += this.speed;
      // minY -= this.speed;
    }
    if (keyIsDown(83)) { //s
      for (let i = theFoods.length-1; i >= 0; i--){
        theFoods[i].y -= this.speed;
      }
      for (let i = theObstacles.length-1; i >= 0; i--){
        theObstacles[i].y -= this.speed;
      }
      // maxY -= this.speed;
      // minY += this.speed;
    }

    // // prevent the player from flying off the screen
    // if (this.x - this.radius <= minX) {
    //   // this.x += this.speed;
    //   console.log("minX");
    // }
    // if (this.x + this.radius >= maxX) {
    //   // this.x -= this.speed;
    //   console.log("maxX");
    // }
    // if (this.y - this.radius < minY) {
    //   // this.y += this.speed;
    //   console.log("minY");
    // }
    // if (this.y + this.radius > maxY) {
    //   // this.y -= this.speed;
    //   console.log("maxY");
    // }
    // console.log(maxX, maxY, minX,minY, this.x, this.y);
    // console.log(mouseX, mouseY);
  }
  
  radius(){
    this.radius += 3;
  }
}

class Food{
  constructor(){ 
    this.x = random(0, maxX);
    this.y = random(0, maxY);
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
      points += this.radius/2;
      if (thePlayer.speed >1){
        thePlayer.speed -= 0.02;
      }
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

// If the player has grown more than width/4 the player wins the game
function displayWonScreen() {
  if (thePlayer.radius*2 > width /4) {
    // Victory sound 
    if(victorySoundOn === false){
      bgSound.pause();
      victorySound.play();
      victorySoundOn = true;
    }

    // text
    background(0);
    fill("green");
    textSize(50);
    textAlign(CENTER);
    textStyle(BOLD);
    text("YOU WON ", width / 2, height / 4);

    // displays points
    if (points>=100){
      text("points  " + points.toPrecision(3), width/2, height/2);
    }
    else if (points >= 1000){
      text("point  "+ points.toPrecision(4), width/2, height/2);
    }
    else{
      text("points   " + points.toPrecision(2), width/2, height/2);
    }

    // displays restart button
    rectMode(CENTER);
    rect(width/2, height*3/4, 300, 70);
    fill("white");
    text("PLAY  AGAIN", width/2, height*3/4);

    // reseting some values
    win = true;
    reset = true;
  }
}