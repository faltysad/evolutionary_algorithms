// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

const TOTAL = 350;
var birds = [];
let savedBirds = [];
var pipes = [];
let counter = 0;

function setup() {
  createCanvas(400, 600);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  background(0);
  if (counter % 75 == 0) {
    pipes.push(new Pipe());
  }
  counter++;

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    for(let j = birds.length - 1; j >= 0; j--) {
      if(pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
      }
    }

    // if (pipes[i].hits(bird)) {
    //   console.log("HIT");
    // }


    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }


  }

  for (let bird of birds) {
    bird.think(pipes);
    bird.update();
    bird.show();
  }

  if (birds.length === 0) {
    counter = 0;
    nextGeneration();
    pipes = [];
}


}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }