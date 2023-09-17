const canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 700;
const canvasMiddle = { x: canvas.width / 2, y: canvas.height / 2};
const red = "#FF0000";
const yellow = "#964B00"
const green = "#008000";
const backgroundColor = "black";


function clear() {
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(obj) {
    ctx.beginPath();
    ctx.arc(obj.position.x, obj.position.y, obj.radius, 0, Math.PI * 2); // Draw a full circle
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function createNewBall(list, mouse) {
    const newBall = new Ball(getRandomInt(3, 10), new Vector2d(mouse.x, mouse.y),new Vector2d(getRandomInt(-10, 10), getRandomInt(0, -15)));
    list.push(newBall);
}


let objects = [new Ball(4, new Vector2d(canvas.width/2, canvas.height/2 - 500),new Vector2d(10, 0)),
               new Ball(10, new Vector2d(canvas.width/2 - 200, canvas.height/2 - 500),new Vector2d(5, 0))]

let mouse = new Vector2d(0, 0);

canvas.addEventListener("mousemove", (event) => {
// Get the mouse position relative to the canvas
const rect = canvas.getBoundingClientRect();
mouse = new Vector2d(event.clientX - rect.left, event.clientY - rect.top);

});
let pressedKeys = []

canvas.addEventListener("mousedown", (e)=>{
    createNewBall(objects, mouse);
})

window.addEventListener("keydown", e=>{
    if (e.key == " " && !pressedKeys.includes(e.key)) {
        pressedKeys.push(e.key);
    }
    if (e.key == "d" && !pressedKeys.includes(e.key)) {
        pressedKeys.push(e.key);
    }
})
window.addEventListener("keyup", e=>{
    pressedKeys = pressedKeys.filter((key)=>{key != e.key});
    
})

function gameLoop() {
    requestAnimationFrame(gameLoop);
    clear();
    for (ball of objects) {
        ball.velocity.limit(20)
        ball.bounce();
        ball.accelerate();
        ball.move();
        ball.applyFriction();
        drawCircle(ball);
        ball.acceleration.setNew(new Vector2d(0, 0))
        applyForce(new Vector2d(0, ball.weight), ball);
        if (pressedKeys.includes(" ")) {
            //this will simulate the force of a really strong wind upwards, and the acceleration will be force -9 divided by mass
            const upForce = -10/ball.mass;
            const sideWaysForce = 0;
            applyForce(new Vector2d(sideWaysForce, upForce), ball)
        }
        if (pressedKeys.includes("d")) {
            //apply wind to the right
            const upForce = 0;
            const sideWaysForce = 0.3/ball.mass;
            applyForce(new Vector2d(sideWaysForce, upForce), ball)
        }
    }
    if (pressedKeys.includes("mouse")) {
        
    }
    
    

}

gameLoop();



