/// <reference path="p5/ts/p5.global-mode.d.ts">

// ------------ Vars ------------ //
let randy;
let start = false;
let offset = 20;

// ------------ Setup ------------ // 
function setup() {
   let cvs = createCanvas(windowWidth - offset, windowHeight - offset);
   cvs.style('display', 'block');
   randy = new DrawWalker(80, 4);
   drawWarning();
}

function drawWarning() {
   let x = width * 0.5;
   let y = height * 0.5;

   textSize(32);
   textAlign(CENTER, CENTER);

   text('EPILEPSY WARNING', x, y - 20);
   textSize(20);
   text('Do not run this if you have an aversion to bright flashing lights.', x, y + 15);
   text('Click anywhere to begin.', x, y + 40);
   text('Click anywhere again to pause/unpause the program', x, y + 65);
}


// ------------ Draw ------------ // 
function draw() {
   if (start && !randy.paused) {
      randy.targetStep();
   }
}

// ------------ Wait for click to start ------------ // 
function mouseClicked() {
   if (!start) {
      start = true;
      clear();
   }
   if (start) {
      randy.togglePause();
   }
}

// ------------ Window Resizing ------------ // 
function windowResized() {
   resizeCanvas(windowWidth - offset, windowHeight - offset);
   if (randy != null) {
      randy.boundX = windowWidth;
      randy.bounY = windowHeight;
   }
   if(!start){
      drawWarning();
   }
}

class DrawWalker {
   constructor(radius, stepsize) {

      this.paused = true;

      this.x = int(width * 0.5);
      this.y = int(height * 0.5);

      this.stepsize = stepsize;
      this.radius = radius;

      this.targetX;
      this.targetY;

      this.pickTarget();
   }

   // clamp position to the canvas size
   clampValues() {
      this.x = Math.min(width, Math.max(0, this.x));
      this.y = Math.min(height, Math.max(0, this.y));
   }

   // draw the walker on the canvas
   show() {
      fill(random(255), random(255), random(255));
      ellipse(this.x, this.y, this.radius, this.radius);
   }

   // gets a target for the walker to go to 
   pickTarget() {
      this.targetX = Math.floor(Math.random() * (width + 1));
      this.targetY = Math.floor(Math.random() * (height + 1));
   }

   // moves and draws the walker 
   step(dirX, dirY) {
      this.clampValues();
      this.x += this.stepsize * dirX;
      this.y += this.stepsize * dirY;
      this.show();
   }

   // take a random step
   randomStep() {
      let dirX = (Math.random() < 0.5) ? -1 : 1;
      let dirY = (Math.random() < 0.5) ? -1 : 1;

      this.step(dirX, dirY);
   }

   // step towards the target
   targetStep() {

      if (Math.random() < 0.05 || int(dist(this.x, this.y, this.targetX, this.targetY)) <= 5) {
         this.pickTarget();
         console.log(this.targetX, this.targetY);
      }

      let dirX = (this.x > this.targetX) ? -1 : 1;
      let dirY = (this.y > this.targetY) ? -1 : 1;

      this.step(dirX, dirY);
   }

   togglePause() {
      this.paused = !this.paused;
   }
}