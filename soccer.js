window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame              ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame         ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
})();

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     ||  
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"); // Create canvas context

var W = window.innerWidth, // Window's width
    H = window.innerHeight; // Window's height

var mouse = {};

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

ctx.fillRect(0, 0, W, H);

white_circle = new Circle(W/2, H/2, W/8, 'white');
green_circle = new Circle(W/2, H/2, W/8-5, 'green');
white_center = new Circle(W/2, H/2, 6, 'white');
left_penalty = new Circle(W/8, H/2, 6, 'white');
right_penalty = new Circle(W-W/8, H/2, 6, 'white');
white_left_circle = new Circle(W/8, H/2, W/8, 'white');
green_left_circle = new Circle(W/8, H/2, W/8-5, 'green');
white_right_circle = new Circle(W-W/8, H/2, W/8, 'white');
green_right_circle = new Circle(W-W/8, H/2, W/8-5, 'green');

var particles = [], // Array containing particles
    ball = {}, // Ball object
    paddles = [2]; // Array containing two paddles

// Ball object
ball = new Ball();

// Function for creating balls
function Ball() {
    // Height and width
    this.x = W/2;
    this.y = H/2;
    this.r = 5;
    this.c = "white";
    this.vx = Math.floor((Math.random()*10)+1);
    this.vy = Math.floor((Math.random()*10)+1);

    // Function for drawing ball on canvas
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
}


// Function for creating paddles
function Paddle(pos) {
    // Height and width
    //this.h = Math.floor((Math.random()*100)+H/6);
    this.h = H/5;
    this.w = 5;
    
    // Paddle's position
    this.x = (pos == "right") ? 0 : W - this.w;
    this.y = H/2 - this.h/2;
}

// Function for creating balls
function Circle(x,y,r,color) {
    // Height and width
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = color;

    // Function for drawing circle on canvas
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("left"));
paddles.push(new Paddle("right"));

// Function to paint canvas
function paintCanvas() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, W, H);
    white_circle.draw();
    green_circle.draw();
    white_center.draw();
    white_left_circle.draw();
    green_left_circle.draw();
    white_right_circle.draw();
    green_right_circle.draw();
    ctx.fillStyle = "white";
    ctx.fillRect(0, H/7, W/6, H/7*5);
    ctx.fillRect(W-W/6, H/7, W/6, H/7*5);
    ctx.fillStyle = "green";
    ctx.fillRect(0, H/7+5, W/6-5, H/7*5-10);
    ctx.fillRect(W-W/6+5, H/7+5, W/6+5, H/7*5-10);
    left_penalty.draw();
    right_penalty.draw();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, 5);
    ctx.fillRect(0, H-5, W, 5);
    ctx.fillRect(W/2-3, 0, 5, H);
}

// Draw everything on canvas
function draw() {
    paintCanvas();
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        
        ctx.fillStyle = "yellow";
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    
    ball.draw();
    update();
}

// Function for running the whole animation
function animloop() {
    init = requestAnimFrame(animloop);
    draw();
}

animloop();

function update() {
    // Move the paddles on mouse move
    if(mouse.x && mouse.y) {
        for(var i = 1; i < paddles.length; i++) {
            p = paddles[i];
            p.y = mouse.y - p.h/2;
        }       
    }

    // Move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Collision with paddles
    p1 = paddles[1];
    p2 = paddles[2];
    
    if(collides(ball, p1)) {
        ball.vx = -ball.vx;
    }

    else if(collides(ball, p2)) {
        ball.vx = -ball.vx;
    } 

    else {
      // Collide with walls, If the ball hits the top/bottom,
      // walls, invert the y-velocity vector of ball
      if(ball.y + ball.r > H) {
          ball.y = H - ball.r;
          ball.vy = -ball.vy;
      } 
      
      else if(ball.y < 0) {
          ball.y = ball.r;
          ball.vy = -ball.vy;
      }
    
      // If ball strikes the vertical walls, run gameOver()
      if(ball.x + ball.r > W) {
          //ball.vx = -ball.vx;
          //ball.x = W - ball.r;
          gameOver();
      }
    
      else if(ball.x -ball.r < 0) {
          //ball.vx = -ball.vx;
          //ball.x = ball.r;
          gameOver();
      }
    }
}

//Function to check collision between ball and one of
//the paddles
function collides(b, p) {
    if(b.y + ball.r >= p.y && b.y - ball.r <=p.y + p.h) {
        if(b.x >= (p.x - p.w) && p.x > 0){
            return true;
        }
        
        else if(b.x <= p.w && p.x == 0) {
            return true;
        }
        
        else return false;
    }
}

canvas.addEventListener("mousemove", trackPosition, true);

// Track the position of mouse cursor
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function gameOver() {
    ctx.fillStlye = "white";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", W/2, H/2 + 25 );
    
    // Stop the Animation
    cancelRequestAnimFrame(init);
}
