class Flock {

  constructor() {
    this.boids = [];
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  run() {
    // Passing the entire list of boids to each boid individually.
    for (var i = 0; i < this.boids.length; i += 1) {
      this.boids[i].run(this.boids);
    }
  }
}
