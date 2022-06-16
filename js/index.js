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
    constructor({position, drawData, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.drawData = drawData;
        this.isAirborne;
        this.lastKey;

        this.attackingRight;
        this.attackingLeft;
        //horizontal attacks.
        this.rightAtk = {
            position: this.position,
            width: 50,
            height: 25
        };
        this.rightOffset = {
            x: this.drawData.width,
            y: (this.drawData.height / 3)
        };

        this.leftAtk = {
            position: this.position,
            width: 50,
            height: 25
        };
        this.leftOffset = {
            x: this.leftAtk.width,
            y: (this.drawData.height / 3)
        };


    }

    attackRight()
    {
        this.attackingRight = true;
        setTimeout(() => {
            this.attackingRight = false;
        }, 100);

        c.fillStyle = 'red';
        c.fillRect(this.rightAtk.position.x + this.rightOffset.x, this.rightAtk.position.y + this.rightOffset.y, this.rightAtk.width, this.rightAtk.height);
    }

    attackLeft()
    {
        this.attackingLeft = true;
        setTimeout(() => {
            this.attackingLeft = false;
        }, 100);

        this.attackingLeft = true;
        c.fillStyle = 'red';
        c.fillRect(this.leftAtk.position.x - this.leftOffset.x, this.leftAtk.position.y + this.leftOffset.y, this.leftAtk.width, this.leftAtk.height);
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
    if(controller.y.pressed) 
    { 
        player.attackRight();
        if(player.rightAtk.position.x + player.rightOffset.x + player.rightAtk.width >= enemy.position.x    &&  // right side of attack crosses left side of enemy.
            player.rightAtk.position.x + player.rightOffset.x <= enemy.position.x + enemy.drawData.width    &&  // left side of attack less than right side of enemy.
            player.rightAtk.position.y + player.rightOffset.y + player.rightAtk.height >= enemy.position.y  &&  // bottom of attack is under top of enemy.
            player.rightAtk.position.y + player.rightOffset.y <= enemy.position.y + enemy.drawData.height   )   // top of attack is above bottom of enemy.
        {
            console.log("purple right attack hit");
        }
    };
    if(controller.t.pressed)
    {
        player.attackLeft();
        if(player.leftAtk.position.x - player.leftOffset.x <= enemy.position.x + enemy.drawData.width       &&  //left side of attack >= right side enemy.
            player.leftAtk.position.x >= enemy.position.x                                                   &&  //right side of attack <= left side of enemy.
            player.leftAtk.position.y + player.leftOffset.y + player.leftAtk.height >= enemy.position.y     &&  // bottom of attack below top of enemy.
            player.leftAtk.position.y + player.leftOffset.y <= enemy.position.y + enemy.drawData.height     )   //top of attack above bottom of enemy.
        { 
            console.log("purple left attack hit");
        }
    };
    if(controller.two.pressed) 
    { 
        enemy.attackRight();
        if(enemy.rightAtk.position.x + enemy.rightOffset.x + enemy.rightAtk.width >= player.position.x      &&  // right side of attack crosses left side of enemy.
            enemy.rightAtk.position.x + enemy.rightOffset.x <= player.position.x + player.drawData.width    &&  // left side of attack less than right side of enemy.
            enemy.rightAtk.position.y + enemy.rightOffset.y + enemy.rightAtk.height >= player.position.y    &&  // bottom of attack is under top of enemy.
            enemy.rightAtk.position.y + enemy.rightOffset.y <= player.position.y + player.drawData.height   )   // top of attack is above bottom of enemy.
        {
            console.log("green right attack hit");
        }
    };
    if(controller.one.pressed) 
    { 
        enemy.attackLeft();
        if(enemy.leftAtk.position.x - enemy.leftOffset.x <= player.position.x + player.drawData.width       &&  //left side of attack >= right side enemy.
            enemy.leftAtk.position.x >= player.position.x                                                   &&  //right side of attack <= left side of enemy.
            enemy.leftAtk.position.y + enemy.leftOffset.y + enemy.leftAtk.height >= player.position.y       &&  // bottom of attack below top of enemy.
            enemy.leftAtk.position.y + enemy.leftOffset.y <= player.position.y + player.drawData.height     )   //top of attack above bottom of enemy.
        { 
            console.log("green left attack hit");
        }
    };
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