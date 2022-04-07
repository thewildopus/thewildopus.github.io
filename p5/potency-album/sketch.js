/*
  Analyze the frequency spectrum with FFT (Fast Fourier Transform)
  Draw a 1024 particles system that represents bins of the FFT frequency spectrum.

  Example by Jason Sigal and Michelle Chandra
 */

var mic, soundFile; // input sources, press T to toggleInput()

var fft;
var smoothing = 0.8; // play with this, between 0 and .99
var binCount = 32; // size of resulting FFT array. Must be a power of 2 between 16 and 1024
var particles =  new Array(binCount);
var volume = 0.01; // initial starting volume of amplitude (necessary for p5.sound)
var amplitude;
let ds;

//videorecording
const fr = 30; //framerate
let capturer = new CCapture({ format: "webm", framerate: fr });
let btn;
let counter = 1;
let centerX, centerY;
let squareSize;
let step;
let angle;
let div;


// var width = 1280
// var height = 800
// var width = windowWidth
// var height = windowHeight
function preload() {
      egg = loadImage('floral.png');
      egg2 = loadImage('flasky.png');
      bigface = loadImage('fish.png');
      cell = loadImage('cell.png');
      backgroundy = loadImage('potency2.png');

}

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  // tint(255, 50); // Display at half opacity
    image(backgroundy, 0, 0);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);

  // soundFile = createAudio('../../music/shezoremet.mp3')

  soundFile = createAudio('potency_promo.mp3')

  // soundFile = createAudio('../../music/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3')
  soundFile.play();
  mic = new p5.AudioIn();

  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(soundFile);

  amplitude = new p5.Amplitude();

  // instantiate the particles.
  for (var i = 0; i < particles.length; i++) {
    var position = createVector(
      // x position corresponds with position in the frequency spectrum
      map(i, 0, binCount, 0, width * 2),
      random(0, height)
    );
    particles[i] = new Particle(position);
  }
  //   ds = new PenroseLSystem();
  // //please, play around with the following line
  // ds.simulate(4);


  // // video recording
  // frameRate(fr);
  //   capturer.start();
  //   createDiv("Recording!")
  //   div=createDiv("0 seconds recorded!")
  //   btn = createButton("Save").mousePressed(function() {
  //     capturer.save();
  //   });

}

function draw() {

    // returns an array with [binCount] amplitude readings from lowest to highest frequencies
  var spectrum = fft.analyze(binCount);

  // analyze the volume
  volume = amplitude.getLevel();


// v1 Number: red or hue value relative to the current color range
// v2 Number: green or saturation value relative to the current color range
// v3 Number: blue or brightness value relative to the current color range
// alpha Number: (Optional)

  var hue = map(volume, 0, 0.5, 176, 288);
  var sat = map(volume, 0, 0.5, 20, 60);
  var bri = map(volume, 0, 0.5, 0, 40);
  var alp = map(windowHeight, 0, 0.5, 60, 100);

  background(hue, sat, bri, alp);
  // update and draw all [binCount] particles!
  // Each particle gets a level that corresponds to
  // the level at one bin of the FFT spectrum.
  // This level is like amplitude, often called "energy."
  // It will be a number between 0-255.
  for (var i = 0; i < binCount; i++) {
    particles[i].update( spectrum[i] );
    // update x position (in case we change the bin count)
    // particles[i].position.x = map(i, 0, binCount, 0, width * 2);
  }
  // ds.render();


  // //videorecording
  //   capturer.capture(document.getElementById("defaultCanvas0"));
  // div.html(`${floor(frameCount / fr)} seconds recorded`);
  // if(frameCount > fr * 60 * 10){
  //   // after 10 minutes
  //   createDiv("Recording stopped!");
  //   capturer.stop();
  //   noLoop();
  // }
}

// ===============
// Particle class
// ===============

var Particle = function(position) {
  this.position = position;
  this.scale = random(1, 13);
  this.speed = createVector(0, random(0, 5) );
}

var theyExpand = 1+(3*volume);

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / map(someLevel, 50, 255, .25, 2);

  if (this.position.y > height) {
    this.position.y = 0;
  }

  this.diameter = map(someLevel, 0, 200, 0, 60) * this.scale * theyExpand;
  this.diameterSmall = map(someLevel, 0, 200, 50, 10) * this.scale * theyExpand;

  var hue = map(someLevel, 0, 255, 180, 360);
  var sat = 50;
  //var sat = map(volume, 0, 0.5, 80, 100);
 // var sat = map(someLevel, 0, 255, 40, 80);
  var bri = map(volume, 0, 0.5, 50, 100);
  //var bri = map(this.radius, 0, width/1.2, 80, 100);
  var alp = map(volume, 0, 0.5, 60, 100);

  fill(hue,sat,bri,alp);


  if (this.position.x < 400){
      image(bigface, this.position.x-this.diameter/2, this.position.y-this.diameter/2, this.diameter/1.5, this.diameter/1.5);

}

 else if (this.position.x < 750){

  ellipse(this.position.x, this.position.y, this.diameterSmall, this.diameterSmall);

    image(egg, this.position.x-this.diameterSmall/2, this.position.y-this.diameterSmall/2, this.diameterSmall, this.diameterSmall);
}

else if (this.position.x < 1000){

 // ellipse(this.position.x, this.position.y, this.diameterSmall, this.diameterSmall);

   image(egg2, this.position.x-this.diameterSmall/2, this.position.y-this.diameterSmall/2, this.diameterSmall, this.diameterSmall);
}

    else {
          fill(hue,sat/2,bri,alp);

ellipse(this.position.x, this.position.y, this.diameter, this.diameter);


            image(cell, this.position.x-this.diameter/2, this.position.y-this.diameter/2, this.diameter, this.diameter);
    }





   //   //tint uses memory like crazy
  // tint(hue,sat,bri);

}

// ================
// Helper Functions
// ================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function keyPressed() {
  if (key == 'T') {
    toggleInput();
  }
}

// To prevent feedback, mic doesnt send its output.
// So we need to tell fft to listen to the mic, and then switch back.
function toggleInput() {
  if (soundFile.isPlaying() ) {
    soundFile.pause();
    mic.start();
    amplitude.setInput(mic);
    fft.setInput(mic);
  } else {
    soundFile.play();
    mic.stop();
    amplitude.setInput(soundFile);
    fft.setInput(soundFile);
  }
}


function PenroseLSystem() {
    this.steps = 0;

   //these are axiom and rules for the penrose rhombus l-system
   //a reference would be cool, but I couldn't find a good one
    this.axiom = "[X]++[X]++[X]++[X]++[X]";
    this.ruleW = "YF++ZF----XF[-YF----WF]++";
    this.ruleX = "+YF--ZF[---WF--XF]+";
    this.ruleY = "-WF++XF[+++YF++ZF]-";
    this.ruleZ = "--YF++++WF[+ZF++++XF]--XF";

    //please play around with the following two lines
    this.startLength = 500.0;
    this.theta = TWO_PI / 6.0; //36 degrees, try TWO_PI / 6.0, ...
    this.reset();
}

PenroseLSystem.prototype.simulate = function (gen) {
  while (this.getAge() < gen) {
    this.iterate(this.production);
  }
}

PenroseLSystem.prototype.reset = function () {
    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

PenroseLSystem.prototype.getAge = function () {
    return this.generations;
  }

//apply substitution rules to create new iteration of production string
PenroseLSystem.prototype.iterate = function() {
    let newProduction = "";

    for(let i=0; i < this.production.length; ++i) {
      let step = this.production.charAt(i);
      //if current character is 'W', replace current character
      //by corresponding rule
      if (step == 'W') {
        newProduction = newProduction + this.ruleW;
      }
      else if (step == 'X') {
        newProduction = newProduction + this.ruleX;
      }
      else if (step == 'Y') {
        newProduction = newProduction + this.ruleY;
      }
      else if (step == 'Z') {
        newProduction = newProduction + this.ruleZ;
      }
      else {
        //drop all 'F' characters, don't touch other
        //characters (i.e. '+', '-', '[', ']'
        if (step != 'F') {
          newProduction = newProduction + step;
        }
      }
    }

    this.drawLength = this.drawLength * 0.5;
    this.generations++;
    this.production = newProduction;
}

//convert production string to a turtle graphic
PenroseLSystem.prototype.render = function () {
    translate(width / 2, height / 2);

    this.steps += 20;
    if(this.steps > this.production.length) {
      this.steps = this.production.length;
    }

    for(let i=0; i<this.steps; ++i) {
      let step = this.production.charAt(i);

      //'W', 'X', 'Y', 'Z' symbols don't actually correspond to a turtle action
      if( step == 'F') {
        stroke(255, 60);
        for(let j=0; j < this.repeats; j++) {
          line(0, 0, 0, -this.drawLength);
          noFill();
          translate(0, -this.drawLength);
        }
        this.repeats = 1;
      }
      else if (step == '+') {
        rotate(this.theta);
      }
      else if (step == '-') {
        rotate(-this.theta);
      }
      else if (step == '[') {
        push();
      }
      else if (step == ']') {
        pop();
      }
    }
  }
