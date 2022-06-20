const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024; // 16:9 ratio
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;
const currStage = 1;

// TODO: 
// COOLDOWNS for moves, period where it doesnt happen again. (maybe make them take the keyup from previous attack to input another attack of the same key).
// Moveset class for different characters, polymorphism of up down left right.
// powerups: maybe double jump (DJCs?) or dash.
// tipper hitboxes.
// knockback that goes up with percent i.e. ssbm
// data structure of list of edges / platforms. can store their coordinates in JSON. Maybe add "grounded" boolean to sprite class.



// Sprite class for all moving objects.
class Sprite 
{
    constructor({position, drawData, velocity, offset})
    {
        this.position = position;
        this.velocity = velocity;
        this.drawData = drawData;
        this.offset = offset;

        this.lastKey;
        
        this.isAirborne;
        this.attackingRight;
        this.attackingLeft;
        this.percent = 0;       //HP

        // All attacks have (for future polymorphism i.e. diff characters):
        // position x, y (offset will be passed by character)
        // width height.
        // TODO: knockback / damage / lag (maybe pass lag through the functions)?

        this.rightAtk = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 50,
            height: 25,
            knockback: {
                x: 10,
                y:-10
            },
            damage: 5,
            lag: 5,
            startup: 5
        };

        this.leftAtk = {
            position: {
                x:  this.position.x,
                y: this.position.y
            },
            width: 50,
            height: 25,
            knockback: {
                x:-10,
                y:-10
            },
            damage: 5,
            lag: 5,
            startup: 5
        };
    }


    getHit(rect2, swtchCase)
    {
        switch (swtchCase)
        {
            case rect2.rightAtk:
                if(this.percent > 0)
                {
                    this.velocity.x = rect2.rightAtk.knockback.x + (this.percent / 4);  
                    this.velocity.y = rect2.rightAtk.knockback.y - (this.percent / 4);
                    this.percent += rect2.rightAtk.damage;
                }
                else
                {
                    this.velocity.x = rect2.rightAtk.knockback.x;
                    this.velocity.y = rect2.rightAtk.knockback.y;
                    this.percent += rect2.rightAtk.damage;
                }
                console.log(this.percent);
                break;
            case rect2.leftAtk:
                if(this.percent > 0)
                {
                    this.velocity.x = rect2.leftAtk.knockback.x - (this.percent / 4);
                    this.velocity.y = rect2.leftAtk.knockback.y - (this.percent / 4);
                    this.percent += rect2.leftAtk.damage;
                }
                else
                {
                    this.velocity.x = rect2.leftAtk.knockback.x ;
                    this.velocity.y = rect2.leftAtk.knockback.y;
                    this.percent += rect2.leftAtk.damage;
                }
                break;
        }

    }

    attackRight()
    {
        this.attackingRight = true;
        setTimeout(() => {
            this.attackingRight = false;
        }, 200);
    }

    attackLeft()
    {
        this.attackingLeft = true;
        setTimeout(() => {
            this.attackingLeft = false;
        }, 200);        
    }


    draw()
    {
        c.fillStyle = this.drawData.color;
        c.fillRect(this.position.x, this.position.y, this.drawData.width, this.drawData.height);

        // Draw current attacks
        if(this.attackingRight)
        {
            c.fillStyle = '#FF0000';
            c.fillRect(this.rightAtk.position.x, this.rightAtk.position.y, this.rightAtk.width, this.rightAtk.height);
        }
        else if (this.attackingLeft)
        {
            c.fillStyle = '#FF0000';
            c.fillRect(this.leftAtk.position.x, this.leftAtk.position.y, this.leftAtk.width, this.leftAtk.height);
        }
    }

    update()
    {

        this.draw();
        this.position.y += this.velocity.y; 
        this.position.x += this.velocity.x;

        this.rightAtk.position = {
            x: this.position.x + this.offset.right.x,
            y: this.position.y + this.offset.right.y
        };
        this.leftAtk.position = {
            x: this.position.x + this.offset.left.x,
            y: this.position.y + this.offset.left.y
        };

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
    c.fillStyle = '#A0D3D6'
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStage()
{
    switch(currStage)
    {
    case 1:        
        console.debug("1");
        c.fillstyle = 'black';
        c.fillRect(256, 544, 512, 32);
        c.fillRect(32, 352, 192, 32);
        c.fillRect(800, 352, 192, 32);
        c.fillRect(384, 160, 256, 32);
       return;
    }
}

const player = new Sprite({
    drawData: {width: 50, height: 50, color: '#CF67EE'}, 
    position: {x: 20, y: 20},  
    velocity: {x: 0, y: 0},
    offset: {
        right : { x: 50, y: 17 }, 
        left : { x: -50, y: 17 }
    }
});

const enemy = new Sprite({
    drawData: {width: 50, height: 50, color: ' #41D474'},
    position: {x: canvas.width - (70), y: 100,},
    velocity: {x: 0, y: 0},
    offset: {
        right : { x: 50, y: 17 },
        left : { x: -50, y: 17 }
    }
});

function spriteJump(sprite, jumpVelocity){
    sprite.velocity.y = jumpVelocity;
}

function gameStart()
{
    loop();
}

function rectangularCollision (rect1, rect2, swtchCase)
{
    switch (swtchCase)
    {
        case rect1.rightAtk:
            return (
            rect1.rightAtk.position.x + rect1.rightAtk.width >= rect2.position.x            &&  // right side of attack crosses left side of enemy.
            rect1.rightAtk.position.x <= rect2.position.x + rect2.drawData.width            &&  // left side of attack less than right side of enemy.
            rect1.rightAtk.position.y + rect1.rightAtk.height >= rect2.position.y           &&  // bottom of attack is under top of enemy.
            rect1.rightAtk.position.y <= rect2.position.y + rect2.drawData.height           &&  // top of attack is above bottom of enemy.
            rect1.attackingRight);
        case rect1.leftAtk:
            //console.log("block pos: " + rect1.position.x + "\natk pos: " + rect1.leftAtk.position.x);
            return (rect1.leftAtk.position.x <= rect2.position.x + rect2.drawData.width    &&  //left side of attack >= right side enemy.
            rect1.leftAtk.position.x >= rect2.position.x                                   &&  //right side of attack <= left side of enemy.
            rect1.leftAtk.position.y + rect1.leftAtk.height >= rect2.position.y            &&  // bottom of attack below top of enemy.
            rect1.leftAtk.position.y <= rect2.position.y + rect2.drawData.height           &&  // top of attack is above bottom of enemy.
            rect1.attackingLeft);

    }
}

function loop()
{
    window.requestAnimationFrame(loop); //animate the frames by clearing the rectangle and updating the player / enemy.
    //console.log(player.position.x);
    refreshCanvas();

    player.update();
    enemy.update();

    document.getElementById("purplePercent").innerHTML = player.percent + "%";
    document.getElementById("greenPercent").innerHTML = enemy.percent + "%";

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
    // P1 right attack
    if(rectangularCollision(player, enemy, player.rightAtk))
    {
        console.log("purple right attack hit");
        player.attackingRight = false;
        enemy.getHit(player, player.rightAtk);
        console.log(player.attackingRight);
    }
    // P1 left attack
    if(rectangularCollision(player, enemy, player.leftAtk))
    {
        console.log("purple left attack hit");
        player.atackingLeft = false;
        enemy.getHit(player, player.leftAtk);
        console.log(player.attackingLeft);
    } 
    // P2 right attack
    if(rectangularCollision(enemy, player, enemy.rightAtk))
    {
        console.log("green right attack hit");
        enemy.attackingRight = false;
        player.getHit(enemy, enemy.rightAtk);
        console.log(enemy.attackingRight);
    }
    // P2 left attack
    if(rectangularCollision(enemy, player, enemy.leftAtk))
    {
        console.log("green left attack hit");
        enemy.attackingLeft = false;
        player.getHit(enemy, enemy.leftAtk);
        console.log(enemy.attackingLeft);
    }

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
            player.attackRight();
            break;
        case 't':
            controller.t.pressed = true;
            player.attackLeft();
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
            enemy.attackRight();
            break;
        case '1':
            enemy.attackLeft();
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