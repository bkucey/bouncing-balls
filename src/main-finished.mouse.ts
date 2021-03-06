// setup canvas
var ballcount = 25;
var ballcounter = document.querySelector("p");
ballcounter.textContent = "Ball Count:" + ballcount;
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var sound = document.querySelector("audio");

var width = (canvas.width = window.innerWidth);
var height = (canvas.height = window.innerHeight);

function setWindow() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.onresize = setWindow;
var promisetodo; //holds the fart sound

// function to generate random number

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

class Shape {
  x: number;
  y: number;
  velX: number;
  velY: number;
  exists: boolean;
  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    exists: boolean
  ) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}
class MeanCircle extends Shape {
  color;
  size: number;
  constructor(x, y, color, size, exists) {
    super(x, y, 20, 20, exists);
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  setControls() {
    window.onmousemove = e => {
      this.x = e.clientX;
      this.y = e.clientY;
    };
    window.ontouchstart = e => {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
    };
    window.ontouchmove = e => {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
    };
    /*
    window.onkeydown = function(e) {
      // a key
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
        console.log("pressed a");
        // d key
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
        // w key
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
        // s key
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    };
    */
  }

  collisionDetect() {
    for (var j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          sound.play();
          balls[j].exists = false;
          ballcount--;
          ballcounter.textContent = "Ball Count:" + ballcount;
        }
      }
    }
  }
}

// define Ball constructor
class Ball extends Shape {
  color;
  size;
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  // define ball draw method

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // define ball update method

  update() {
    if (this.x + this.size >= width && this.velX >= 0) {
      if (this.velX) {
        this.velX = -this.velX;
      } else {
        this.x = width;
      }
    }

    if (this.x - this.size <= 0 && this.velX <= 0) {
      if (this.velX) {
        this.velX = -this.velX;
      } else {
        this.x = 0;
      }
    }

    if (this.y + this.size >= height && this.velY >= 0) {
      if (this.velY) {
        this.velY = -this.velY;
      } else {
        this.y = height;
      }
    }

    if (this.y - this.size <= 0 && this.velY <= 0) {
      if (this.velY) {
        this.velY = -this.velY;
      } else {
        this.y = 0;
      }
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // define ball collision detection

  collisionDetect() {
    for (var j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color =
            "rgb(" +
            random(0, 255) +
            "," +
            random(0, 255) +
            "," +
            random(0, 255) +
            ")";
        }
      }
    }
  }
}
// define array to store balls

var balls = [];

// define loop that keeps drawing the scene constantly
const meanCircle = new MeanCircle(width / 2, height / 2, "white", 10, true);
meanCircle.setControls();
function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, width, height);

  while (balls.length < ballcount) {
    var ball = new Ball(
      random(0, width),
      random(0, height),
      random(-7, 7),
      random(-7, 7),
      "rgb(" +
        random(0, 255) +
        "," +
        random(0, 255) +
        "," +
        random(0, 255) +
        ")",
      random(10, 20),
      true
    );
    balls.push(ball);
  }
  meanCircle.draw();
  meanCircle.checkBounds();
  meanCircle.collisionDetect();
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  requestAnimationFrame(loop);
}

loop();
