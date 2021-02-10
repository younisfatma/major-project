// Fatma Younis 
// Computer Science 30
// Mr. Schellenberg
// Major Project


// Array for start screen
let start = {x: 0, y: 0, isAlive: true,};

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

  //   // Sounds
  //   bgSound = loadSound("assets/backgroundMusic.mp3");
//   lossSound = loadSound("assets/loss.mp3");
//   victorySound = loadSound("assets/Victory.mp3");

//   // Font
//   font = loadFont("assets/ARCADECLASSIC.TTF");
}

let thePlayer, theObstacles;
let theFoods= [];

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

  for (let i = theFoods.length-1; i > 0; i--){
    theFoods[i].display();
    theFoods[i].hit();
    if(theFoods[i].eaten){ //only eat food that are smaller
      theFoods.splice(i, 1);
      thePlayer.diameter+=2;
    }
  }

  thePlayer.display();
  thePlayer.move();

  theObstacles.display();

  theObstacles.collide();
  
}

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
  let newFood = new Food;
  theFoods.push(newFood);//make new food spawn based on time

  //Controls what skin to display
  if (thePlayer.imagenumber < 4){
    this.imagenumber+=1;
  }
  else{
    imagenumber=0;
  }
}

class Player{
  constructor(){
    this.x= width/2;
    this.y = height/2;
    this.radius = 20;
    this.diameter = this.radius*2;
    this.speed = 5;
    this.color = color(255,255,255,0);
    this.imagenumber = 0;
  }

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    ellipseMode(CENTER);

    // Character skins
    imageMode(CENTER);
    image(images[this.imagenumber], this.x, this.y, this.diameter, this.diameter );
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

  stopBall() {
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
  constructor(shortRadius, largeRadius){
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
    this.eaten = collideCircleCircle(thePlayer.x, thePlayer.y, thePlayer.diameter, this.x, this.y, this.radius);
    if (this.eaten){
      console.log("yum");
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
  //   if (this.x-this.length >= 0 && this.x + this.length <= width){
  //     this.x += this.dx;
  //   }
  //   else if (this.y-this.length>=0 && this.y+this.length<=height){
  //     this.y += this.dy;
  //   }
  // }

  collide(){
    this.hit= collideRectCircle(this.x, this.y, this.length, this.length, thePlayer.x, thePlayer.y, thePlayer.radius);
    if (this.hit){
      console.log("ouch");
    }
    if(this.hit && this.length < thePlayer.diameter && thePlayer.diameter >= 40){
      thePlayer.diameter-=5;
    }
  }
}

