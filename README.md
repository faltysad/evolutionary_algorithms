# evolutionary_algorithms
## Open flappy bird clone project

`./code/sketch.js`
```javascript
// 1. comment out keyPressed() function
```

`./code/bird.js`

```javascript
// 1. add this.brain to Bird class
this.brain = new NeuralNetwork(4, 4, 1);

// 2. new function on Bird class called think()
think(pipes) {
    // find the closest pipe
    let closest = null;
    let closestD = Infinity;
     
    for(let i = 0; i < pipes.length; i++) {
        let d = pipes[i].x - this.x;
        if(d < closestD && d > 0) {
            closest = pipes[i];
            closestD = d;
        }
    }

    // feed the neural net with inputs
    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / width;

    let output = this.brain.predict(inputs);
    if(output[0] > 0.5) this.up();
}

```

`./code/sketch.js`
```javascript
// in draw function() before update() & show()
bird.think(pipes);
// RUN CODE: Now we can actually run the code for the first time

// NEXT STEP: And now we need to implement the neuroevolution part
//TODO REFACTOR var -> LET
// On top of the file, change let bird to let birds = []
// add total const on top of sketch
const TOTAL = 100;
// now  create population of brids, so in setup()
// replace bird = new Bird(); with
for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
}
// in draw, wrap the draw methods with for loop
for (let bird of birds) {
    bird.think(pipes);
    bird.update();
    bird.show();   
}
// comment out the bird hits pipe function
    // if (pipes[i].hits(bird)) {
    //   console.log("HIT");
    // }

// RUN THE CODE!

```

`./code/bird.js`

```javascript
// in show()
stroke(255);
fill(255, 100)

// in constructor() change this.brain = new NeuralNetwork(4, 4, 1); to:
this.brain = new NeuralNetwork(4, 4, 2);
// and in think (), change if(output[0] > 0.5) to:
if(output[0] > output[1]) { ... }
```

`./code/sketch.js`
```javascript
// change const TOTAL = 100; to:
const TOTAL = 250;
// add the collision function, so in draw, inside pipes for loop
// directly after pipes[i].update()
for(let j = birds.length - 1; j >= 0; j--) {
    if(pipes[i].hits(birds[j])) {
        birds.splice(j, 1);
    }
}

```

`create a new file called ga.js`

`import it in index.html!!`

```javascript
// create function nextGeneration()
function nextGeneration() {
    for (let i = 0; i < TOTAL; i++) {
        birds[i] = new Bird();
    }
}
```

`./code/sketch.js`

```javascript
// after the for(let bird of birds) { ... } draw loop
// add function to create next generation
if (birds.length === 0) {
    nextGeneration();
}

// RUN THE CODE
```

`./code/bird.js`

```javascript
// in constructor, before brain, add:
this.score = 0;
this.fitness = 0;

// in update(), beacause it gets called every time
this.score++;
```

`./code/ga.js`

```javascript
// calculate fitness value => probability that bird will
// be picked in the next generation
// calculated and normalized from score => we want value between 0 - 1
// at the start of nextGeneration() call:
calculateFitness()


// under the nextGeneration() create calculateFitness()
function calculateFitness(){
    let sum = 0;
    for (let bird of birds) {
        sum += bird.score;
    }

    for (let bird of birds) {
        bird.fitness = bird.score / sum; // normalizing fitness
    }
}

// now in nextGeneration() inside the for loop change
// birds[i] = new Bird(); as following:

birds[i] = pickOne();

// create function pickOne();
function pickOne() {

}
```

`./code/sketch.js`

```javascript
/// after let birds = [], add:
let savedBirds = [];
// now in the collision for loop, change birds.splice(j, 1); as:
savedBirds.push(birds.splice(j, 1)[0]);
```

`./code/ga.js`

```javascript
// in the pickOne()
 let bird = random(savedBirds);
 return bird;

 // and in nextGeneration()
 // after the for loop where we pickOne, add:
 savedBirds = []; 
```

`./code/bird.js`

```javascript
// add mutate() above constructor
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

//in constructor, add paramater brain => constructor(brain) { ... }
// and change this.brain = new NeuralNetwork(); to:
if (brain instanceof NeuralNetwork) {
    this.brain = brain.copy();
    this.brain.mutate(mutate);
} else {
    this.brain = new NeuralNetwork(4, 4, 2);
}
```

`./code/ga.js`

```javascript
// in pickOne(), after let bird = random(savedBirds), add:
let child = new Bird(bird.brain);
return child;
// RUN THE CODE
```


`./code/sketch.js`

```javascript
// Lets reset the pipes
// lets go where we call the nextGeneration() and:
// above the nextGeneration() call add:
counter = 0;
// and below the nextGeneration() call add:
pipes = [];
// replace the if (frameCount % 75 == 0) statement with:
if (counter % 75 == 0) { ... }
// and add following after the if statement:
counter++;
// and on the top of the line add global variable let counter = 0;
let counter = 0;
// and from setup() remove the pipes.push(new Pipe());
// and now move the whole if (counter % 75 == 0) { ... } statement
// with the counter++ to the draw() directly after background()!
// RUN THE CODE
```

`./code/ga.js`

```javascript
// rewrite the pickOne() so that it selects based on fitness
function pickOne() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
        r = r - savedBirds[index].fitness;
        index++;
    }
    index--;

    let bird = savedBirds [index];
    let child = new Bird(bird.brain);
    return child;
}

// and in the calculateFitness() change for(let bird of birds) { ... }
// to ... of savedBrids on both places!!
for(let bird of savedBirds) { ... }
// DONE, RUN THE GAME!!
```



### Lets speed the training part up!
#### We need to separate the drawing from the game's logic

`./code/sketch.js`

```javascript
// In the draw(), lets take the pipes.show()
// and in the bottom for loop, where we call bird.show()
// lets also separate that
// and now, at the end of the draw() and from the bottom,
// take the background (0)
// and now on the end of the draw(), put this:

// All the drawing stuff
background(0);

for (let bird of birds) {
    bird.show();
}

for (let pipe of pipes) {
    pipe.show();
}

// now we need to wrap whole body of draw() with for loop:
for (let n = 0; n < cycles; n++) {
    ...draw()
}
// and create let cycles on the top of the file:
let cycles = 100;
// and also on the top, add slider
let slider;
// and now in setup(), after createCanvas()
slider = createSlider(1, 100, 1);
// and in the for loop that wraps draw(), change cycles as following:
for (let n = 0; n < slider.value(); n++) { ... }
```
