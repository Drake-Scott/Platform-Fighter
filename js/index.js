const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024; // 16:9 ratio
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;

// Sprite class for all moving objects.
class Sprite 
{
    isAirborne;
    constructor({position, drawData, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.drawData = drawData;
    }

    draw()
    {
        c.fillStyle = this.drawData.color;
        c.fillRect(this.position.x, this.position.y, this.drawData.width, this.drawData.height);
    }

    update()
    {

        this.draw();
        this.position.y += this.velocity.y; 
        this.position.x += this.velocity.x;

        if(this.position.y + this.drawData.height + this.velocity.y >= canvas.height)   //if the bottom of the rectangle + the velocity = the bottom of the canvas
        {
            this.isAirborne = false;
            this.velocity.y = 0;                                                        //downward velocity = 0,
        } 
        else 
        {
            this.isAirborne = true;
            this.velocity.y += gravity; 
        }

        if(this.position.x + this.drawData.width + this.velocity.x >= canvas.width)   
        {
            this.position.x = 0;                                                      
        } 
        else if (this.position.x + this.velocity.x <= 0)
        {
            this.position.x = canvas.width - this.drawData.width; 
        }

        this.position.x += this.velocity.x;

    }
}

function refreshCanvas()
{
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
}

const player = new Sprite({
    drawData: {width: 50, height: 50, color: 'purple'}, 
    position: {x: 20, y: 20},  
    velocity: {x: 0, y: 0}
});

const enemy = new Sprite({
    drawData: {width: 50, height: 50, color: 'green'},
    position: {x: 400, y: 100,},
    velocity: {x: 0, y: 0}
});

function spriteJump(sprite, jumpVelocity){
    sprite.velocity.y = jumpVelocity;
}

function gameStart()
{
    //window.location.reload();
    loop();
}

const controller = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: true
    }
}

let lastKey;

function loop()
{
    window.requestAnimationFrame(loop); //animate the frames by clearing the rectangle and updating the player / enemy.
    refreshCanvas();      
    player.update();
    //enemy.update();

    player.velocity.x = 0;  // default.
    if(controller.a.pressed && lastKey === 'a')
    {
        player.velocity.x = -5
    }
    else if (controller.d.pressed && lastKey === 'd')
    {
        player.velocity.x = 5;
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key)
    {
        case 'd': 
            lastKey = 'd';
            controller.d.pressed = true;
            break;
        case 'a':
            lastKey = 'a';
            controller.a.pressed = true;
            break;
        case 'w':
            //lastKey = 'w';
            controller.w.pressed = true;
            if(!player.isAirborne)
            {
                spriteJump(player, -7);
            }
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key)
    {
        case 'd': 
            controller.d.pressed = false;
            break;
        case 'a':
            controller.a.pressed = false;
            break;
        case 'w':
            controller.w.pressed = false;
            break;
    }
    //console.debug(event.key);
});