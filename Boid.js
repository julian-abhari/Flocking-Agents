class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.radius = 3;
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.separationWeight = separationSlider.value();
    this.alignmentWeight = alignmentSlider.value();
    this.cohesionWeight = cohesionSlider.value();
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.display();
  }

  update() {
    this.separationWeight = separationSlider.value();
    this.alignmentWeight = alignmentSlider.value();
    this.cohesionWeight = cohesionSlider.value();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    fill(175);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -this.radius*2);
    vertex(-this.radius, this.radius*2);
    vertex(this.radius, this.radius*2);
    endShape();
    pop();
  }

  // Wrap around
  borders() {
    if (this.position.x < -this.radius) this.position.x = width + this.radius;
    if (this.position.y < -this.radius) this.position.y = height + this.radius;
    if (this.position.x > width + this.radius) this.position.x = -this.radius;
    if (this.position.y > height + this.radius) this.position.y = -this.radius;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(boids) {
    // Calculate forces
    var separateForce = this.separate(boids);
    var alignmentForce = this.align(boids);
    var cohesionForce = this.cohesion(boids);
    // Arbitrarily weight these forces
    separateForce.mult(this.separationWeight);
    alignmentForce.mult(this.alignmentWeight);
    cohesionForce.mult(this.cohesionWeight);
    // Add the force vectors to acceleration
    this.applyForce(separateForce);
    this.applyForce(alignmentForce);
    this.applyForce(cohesionForce);
  }

  separate(boids) {
    var desiredSeparation = 25;
    var separateForce = createVector();
    var count = 0;
    // For every boid in the system, chekc if its too close
    for (var i = 0; i < boids.length; i += 1) {
      var distance = p5.Vector.dist(this.position, boids[i].position);
      if ((distance > 0) && (distance < desiredSeparation)) {
        // Calculate vector pointing away from neighbor
        var difference = p5.Vector.sub(this.position, boids[i].position);
        difference.normalize();
        difference.div(distance);
        separateForce.add(difference);
        count += 1;
      }
    }
    if (count > 0) {
      separateForce.div(count);
    }
    if (separateForce.mag() > 0) {
      separateForce.normalize();
      separateForce.mult(this.maxSpeed);
      // Steering = Desired - velocity
      separateForce.sub(this.velocity)
      separateForce.limit(this.maxForce);
    }
    return separateForce;
  }

  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    var neighborDistance = 50;
    var alignmentForce = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i += 1) {
      var distance = p5.Vector.dist(this.position, boids[i].position);
      if ((distance > 0) && (distance < neighborDistance)) {
        alignmentForce.add(boids[i].velocity);
        count += 1;
      }
    }
    if (count > 0) {
      alignmentForce.div(count);
      alignmentForce.normalize();
      alignmentForce.mult(this.maxSpeed);
      var steeringForce = p5.Vector.sub(alignmentForce, this.velocity);
      steeringForce.limit(this.maxForce);
      return steeringForce;
    } else {
      return createVector(0, 0);
    }
  }

  // For the average position (i.e. center) of all nearby boids, calculate steering vector towards that position
  cohesion(boids) {
    var neighborDistance = 50;
    var centerOfBoids = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i += 1) {
      var distance = p5.Vector.dist(this.position, boids[i].position);
      if ((distance > 0) && (distance < neighborDistance)) {
        centerOfBoids.add(boids[i].position);
        count += 1;
      }
    }
    if (count > 0) {
      centerOfBoids.div(count);
      return this.seek(centerOfBoids);
    } else {
      return createVector(0, 0);
    }
  }

  // Method that calculuates a steering force towards a target
  // Steering force = desired force - current velocity
  seek(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    var steeringForce = p5.Vector.sub(desired, this.velocity);
    steeringForce.limit(this.maxForce);
    return steeringForce;
  }
}
