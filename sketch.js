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

;

// Images
let bgImg, evilImg, hamsterImg, whaleImg, zombieImg, skeletonImg;
let images = [];
let imagenumber = 0;

// Sounds
let bgSound, lossSound, victorySound;
let millisSinceLossSoundPlayed = 0;

// Font
let font;

// function preload(){
//   // Images
//   bgImg = loadImage("assets/bg.png");
//   evilImg = loadImage ("assets/evil.png");
//   hamsterImg = loadImage ("assets/hamster.png");
//   zombieImg = loadImage ("assets/zombie.png");
//   whaleImg = loadImage ("assets/whale.png");
//   skeletonImg = loadImage ("assets/skeleton.png");
//   images.push(evilImg, hamsterImg, zombieImg, whaleImg, skeletonImg);

//   // Sounds
//   bgSound = loadSound("assets/backgroundMusic.mp3");
//   lossSound = loadSound("assets/loss.mp3");
//   victorySound = loadSound("assets/Victory.mp3");

//   // Font
//   font = loadFont("assets/ARCADECLASSIC.TTF");
// }

let thePlayer, theObstacles;
let theFoods= [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  thePlayer = new Player();
  theFood = new Player();
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

  for (let food of theFoods){
    food.display();
  }

  thePlayer.display();
  thePlayer.move();

  theObstacles.display();
}



// Starts the game and controls color of the ball
function mousePressed() {
  let newFood = new Food;
  theFoods.push(newFood);

  // Controls what skin to display
  // if (imagenumber < 4){
  //   imagenumber+=1;
  // }
  // else{
  //   imagenumber=0;
  // }
}

class Player{
  constructor(){
    this.x= width/2;
    this.y = height/2;
    this.radius = 20;
    this.speed = 5;
    this.color = "pink";
    //color(255,255,255,0);
    this.imagenumber = 0;
    
  }

  display(){
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    ellipseMode(CENTER);

    // Character skins
    // imageMode(CENTER);
    // image(images[this.imagenumber], this.x, this.y, this.radius*2, this.radius*2 );
  }
  

  // if (player.x - player.radius < 0) {
  //   player.x = player.radius;
  // }
  // if (player.x + player.radius > width) {
  //   player.x = width - player.radius;
  // }
  // if (player.y - player.radius < 0) {
  //   player.y = player.radius;
  // }
  // if (player.y + player.radius > height) {
  //   player.y = height - player.radius;
  // }

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
  
  width(){
    this.radius += 3;
  }
}

class Food{
  constructor(){
    this.x = random(0, width);
    this.y = random(0, height);
    this.radius = random(5, 20);
    this.color = "yellow";
    //color(random(255), random(255), random(255));
    this.eaten = false;
  }
  
  display(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius * 2);
  }

  // checkCollision(){
  //   this.eaten = collideCircleCircle(player.x, player.y, player.radius, this.x, this.y, this.radius);
  // }
}

class Obstacle{
  constructor(){
    this.x = random(0, width);
    this.y = random(0, height);
    this.length = random(50, 100);
    this.color = "lime";
  }

  display(){
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.length, this.length);
  }

  // move(){
    
  // }

  // hit(){
  //   collideRectCircle(this.x, this.y, this.length, this.length, player.x, player.y, player.radius);
  // }
  

}

