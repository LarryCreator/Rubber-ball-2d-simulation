class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y
    };
    sub(vector) {
        return new Vector2d(this.x - vector.x, this.y - vector.y);
    };
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }
    mult(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }
    getDotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    normalize() {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag != 0) {
            this.x /= mag;
            this.y /= mag;
        }
        
    }
    mag () {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    setMag(magNum) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        this.x = this.x / mag * magNum;
        this.y = this.y / mag * magNum;
    }
    limit(magLimit) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag > magLimit) {
            this.x = this.x/mag * magLimit;
            this.y = this.y/mag * magLimit;
        }
    }
    copy() {
        return new Vector2d(this.x, this.y);
    }
    setNew(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }
}


class Ball {
    constructor(mass, position, velocity) {
        this.position = position;
        this.prevPos = new Vector2d(0, 0);
        this.velocity = velocity;
        this.acceleration = new Vector2d(0, 0);
        this.friction = 0.000070
        this.mass = mass;
        this.radius = Math.sqrt(this.mass) * 10;
        this.gravity = 0.1;
        this.weight = this.mass * this.gravity;
    }
    applyFriction() {
        if (this.position.y + this.radius >= canvas.height || this.position.y - this.radius <= 0) {
            //direction of friction:
            const friction = this.velocity.copy();
            friction.normalize()
            //the friction force is always going contrary to the movement direction in the x axis
            friction.mult(new Vector2d(-1, -1));
            
            //magnitude of friction:
            //mu == μ which is the greek letter that we use as coefficient of friction
            const mu = this.friction;
            const normalForce = this.mass / this.gravity;
            friction.setMag(mu * normalForce);
            this.velocity.add(friction);
        }
    }
    bounce() {
        if (this.position.y + this.radius > canvas.height && Math.sign(this.velocity.y) == 1) {
            this.position.y = canvas.height - this.radius;
            //when bouncing on the floor, i defined the coefficient of restitution as 0.7
            //so the y axis of the velocity vector will be multiplied by the COR and lose
            //30% of energy with each bounce
            const cor = -0.7
            //the cor is negative so that the y velocity will be inverted, causing the bounce effect
            this.velocity.mult({x: 1, y: cor})
        }
        if (this.position.y - this.radius < 0 && Math.sign(this.velocity.y) == -1) {
            this.position.y = 0 + this.radius;
            const cor = -0.8
            this.velocity.mult({x: 1, y: cor})
        }
        if (this.position.x + this.radius > canvas.width && Math.sign(this.velocity.x) == 1){
            this.position.x = canvas.width - this.radius;
            const cor = -0.9
            this.velocity.mult({x: cor, y: 1})
        }
        if (this.position.x - this.radius < 0 && Math.sign(this.velocity.x) == -1){
            const cor = -0.9
            this.velocity.mult({x: cor, y: 1})
        }
    }
    accelerate() {
        this.velocity.add(this.acceleration);
    }
    move() {
        this.position.add(this.velocity);
    }
}

function getRandomInt(min, max) {
    // Generate a random integer between min (inclusive) and max (inclusive)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function applyForce(force, obj) {
    obj.acceleration.add(force);
}
