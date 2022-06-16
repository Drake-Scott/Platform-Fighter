const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024; // 16:9 ratio
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;

class Moveset
{
    upAtk;
    rightAtk;
    leftAtk;
    downAtk;
}

// Sprite class for all moving objects.
class Sprite 
{
    // isAirborne;
    // lastKey;
    constructor({position, drawData, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.drawData = drawData;
        this.isAirborne;
        this.lastKey;

        this.rightAtk = {
            position: this.position,
            width: 50,
            height: 25
        };

        this.leftAtk = {
            position: this.position,
            width: 50,
            height: 25
        };

    }

    attackRight()
    {
        let offset = {
            x: this.drawData.width,
            y: (this.drawData.height / 3)
        };
        c.fillStyle = 'red';
        c.fillRect(this.rightAtk.position.x + offset.x, this.rightAtk.position.y + offset.y, this.rightAtk.width, this.rightAtk.height);
    }

    attackLeft()
    {
        let offset = {
            x: this.leftAtk.width,
            y: (this.drawData.height / 3)
        };
        c.fillStyle = 'red';
        c.fillRect(this.leftAtk.position.x - offset.x, this.leftAtk.position.y + offset.y, this.leftAtk.width, this.leftAtk.height);
    }


    draw()
    {
        c.fillStyle = this.drawData.color;
        c.fillRect(this.position.x, this.position.y, this.drawData.width, this.drawData.height);
        

        // c.fillStyle = 'blue';
        // c.fillRect(this.leftAtk.position.x, this.leftAtk.position.y, this.leftAtk.width, this.leftAtk.height);

    }

    update()
    {
        this.draw();
        this.position.y += this.velocity.y; 
        this.position.x += this.velocity.x;

        // Create vertical floor boundary and apply gravity to sprite
        if(this.position.y + this.drawData.height + this.velocity.y >= canvas.height)
        {
            this.isAirborne = false;
            this.velocity.y = 0;                                                       
        } 
        else 
        {
            this.isAirborne = true;
            this.velocity.y += gravity; 
        }

        // Create Horizontal wrap around. 
        // if(this.position.x + this.drawData.width + this.velocity.x >= canvas.width)   
        // {
        //     this.position.x = 0;                                                      
        // } 
        // else if (this.position.x + this.velocity.x <= 0)
        // {
        //     this.position.x = canvas.width - this.drawData.width; 
        // }

        // Create horizontal wall boundarys and restrict movement.
        if((this.position.x + this.drawData.width + this.velocity.x >= canvas.width) && this.velocity.x > 0)   
        {
            this.position.x = canvas.width - this.drawData.width - 5;                                                      
        } 
        else if ((this.position.x + this.velocity.x <= 0) && this.velocity.x < 0)
        {
            this.position.x = 5; 
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
    position: {x: canvas.width - (70), y: 100,},
    velocity: {x: 0, y: 0}
});

function spriteJump(sprite, jumpVelocity){
    sprite.velocity.y = jumpVelocity;
}

function gameStart()
{
    loop();
}

const controller = {
    //P1 controller
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    y: {
        pressed: false
    },
    t: {
        pressed: false
    },

    //P2 controller
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    two: {
        pressed: false
    },
    one: {
        pressed: false
    }
    
}

function loop()
{
    window.requestAnimationFrame(loop); //animate the frames by clearing the rectangle and updating the player / enemy.
    //console.log(player.position.x);
    refreshCanvas();      
    player.update();
    enemy.update();

    player.velocity.x = 0;  // default.
    enemy.velocity.x = 0;

    // Player movement
    if(controller.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5
    }
    else if (controller.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5;
    }

    // Enemy movement
    if(controller.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5
    }
    else if (controller.ArrowRight.pressed && enemy.lastKey  === 'ArrowRight')
    {
        enemy.velocity.x = 5;
    }

    //BATTLE
    if(controller.y.pressed) { player.attackRight() };
    if(controller.t.pressed) { player.attackLeft() };
    if(controller.two.pressed) { enemy.attackRight() };
    if(controller.one.pressed) { enemy.attackLeft() };
}

window.addEventListener('keydown', (event) => {
    switch (event.key)
    {
        case 'd': 
            player.lastKey  = 'd';
            controller.d.pressed = true;
            break;
        case 'a':
            player.lastKey = 'a';
            controller.a.pressed = true;
            break;
        case 'w':
            controller.w.pressed = true;
            if(!player.isAirborne)
            {
                spriteJump(player, -12);
            }
            break;
        case 'y':
            controller.y.pressed = true;
            break;
        case 't':
            controller.t.pressed = true;
            break;

        case 'ArrowRight':
            enemy.lastKey = 'ArrowRight';
            controller.ArrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            enemy.lastKey = 'ArrowLeft';
            controller.ArrowLeft.pressed = true;
            break;
        case 'ArrowUp':
            controller.ArrowUp.pressed = true;
            if(!enemy.isAirborne)
            {
                spriteJump(enemy, -12);
            }
            break;  
        case '2':
            controller.two.pressed = true;
            break;
        case '1':
            controller.one.pressed = true;
            break; 
    }
    //console.log(event.key);
});

window.addEventListener('keyup', (event) => {
    switch (event.key)
    {
        // P1
        case 'd': 
            controller.d.pressed = false;
            break;
        case 'a':
            controller.a.pressed = false;
            break;
        case 'w':
            controller.w.pressed = false;
            break;
        case 'y':
            controller.y.pressed = false;
            break;
        case 't':
            controller.t.pressed = false;
            break;

        // P2
        case 'ArrowLeft': 
            controller.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight': 
            controller.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            controller.ArrowUp.pressed = false;
            break;
        case '2':
            controller.two.pressed = false;
            break;
        case '1':
            controller.one.pressed = false;
            break; 
    }
    //console.debug(event.key);
});