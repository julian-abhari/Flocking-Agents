var flock;
var separationSlider;
var separationLabel;
var alignmentSlider;
var alignmentLabel;
var cohesionSlider;
var cohesionLabel;



function setup() {
  createCanvas(800, 600);
  // Initializing forceWeight sliders
  separationSlider = createSlider(0, 3, 1.5, 0.1);
  separationSlider.position(900, 50);
  separationLabel = createP(`Separation slider: ${separationSlider.value()}`);
  separationLabel.position(900, 0);
  alignmentSlider = createSlider(0, 3, 1.0, 0.1);
  alignmentSlider.position(900, 150);
  alignmentLabel = createP(`Alignment slider: ${alignmentSlider.value()}`);
  alignmentLabel.position(900, 100);
  cohesionSlider = createSlider(0, 3, 1.0, 0.1);
  cohesionSlider.position(900, 250);
  cohesionLabel = createP(`Cohesion slider: ${cohesionSlider.value()}`);
  cohesionLabel.position(900, 200);

  flock = new Flock();
  // Adding initial set of boids
  for (var i = 0; i < 100; i += 1) {
    flock.addBoid(new Boid(width / 2, height / 2));
  }
}

function draw() {
  background(255);
  flock.run();

  // Instructions
  fill(0);
  text("Drag the mouse to generate new vehicles", 10, height - 16);
  // Updating Slider Labels
  separationLabel.html(`Separation slider: ${separationSlider.value()}`);
  alignmentLabel.html(`Alignment slider: ${alignmentSlider.value()}`);
  cohesionLabel.html(`Cohesion slider: ${cohesionSlider.value()}`);
}

function mousePressed() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}
