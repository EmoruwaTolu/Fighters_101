const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7; //controlling the rate at which things fall

//these blocks of code beneath add the different layers of the background onto the canvas
const background = new Background({
    position:{
        x:0,
        y:0
    },
    imageSrc: './oak_woods_v1.0/background/background2.png'
});

const building = new Background({
    position:{
        x:625,
        y:122
    },
    imageSrc: './oak_woods_v1.0/decorations/shop_anim.png',
    scale: 2.8,
    numOfFrames: 6
});

//creating the character in the canvas
const player = new Fighter({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    attackOffset: {
        x:0,
        y:0
    },
    imageSrc: './oak_woods_v1.0/character/Idle.png',
    scale: 2,
    numOfFrames: 8,
    offset: {
        x:38,
        y:96
    },
    sprites:{
        idle:{
            imageSrc: './oak_woods_v1.0/character/Idle.png',
            numOfFrames: 8
        },
        run:{
            imageSrc: './oak_woods_v1.0/character/Run.png',
            numOfFrames: 8
        },
        jump:{
            imageSrc: './oak_woods_v1.0/character/Jump.png',
            numOfFrames: 2
        },
        fall:{
            imageSrc: './oak_woods_v1.0/character/Fall.png',
            numOfFrames: 2
        }
    }
});
const enemy = new Fighter({
    position: {
        x:600,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    }
});

player.draw();
enemy.draw();
console.log(player);

const key_log = {//key_log logs whether a not a ket to move the sprites has been pressed
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

let lastKey;

//attackCollision checks if either the enemy or player have made contact with their attacks
function attackCollision({rectangle1 , rectangle2}) {
    return(rectangle1.attackRange.position.x + rectangle1.attackRange.width >= rectangle2.position.x && 
        rectangle1.attackRange.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackRange.position.y + rectangle1.attackRange.height >= rectangle2.position.y &&
        rectangle1.attackRange.position.y <= rectangle2.position.y + rectangle2.height)
}

let time = 60;
let timerID;

function timerCount(){
    timerID = setTimeout(timerCount,1000);
    if(time > 0){
        time--;
        document.querySelector('.timer').innerHTML = time;//displays the countdown
    }
    if(time == 0){
        if(player.health == enemy.health){
            clearTimeout(timerID);
            document.querySelector('.result').innerHTML = 'Tie';
            document.querySelector('.result').style.display = 'flex';//displays tie if there is a tie
        }
        if(player.health > enemy.health){
            clearTimeout(timerID);
            document.querySelector('.result').innerHTML = 'Player wins!';
            document.querySelector('.result').style.display = 'flex';
        }
        if(player.health < enemy.health){
            clearTimeout(timerID);
            document.querySelector('.result').innerHTML = 'Player loses!';
            document.querySelector('.result').style.display = 'flex';
        }
    }
}

timerCount();

function animate() {
    window.requestAnimationFrame(animate);//loops the functions forever
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    building.update();
    player.update();
    // enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if(key_log.a.pressed && player.lastKey === 'a'){//if a key_log for a has been pressed then we update it within animate()
        player.velocity.x = -5;
    }
    else if(key_log.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.nextSprite('run');
    }
    else{
        player.nextSprite('idle');
    }

    if(key_log.w.pressed && player.lastKey === 'w'){
        player.velocity.y = -13;
    }

    if(player.velocity.y < 0){
        player.nextSprite('jump');
    }
    if(player.velocity.y > 0){
        player.nextSprite('fall');
    }

    if(key_log.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){//if a key_log for a has been pressed then we update it within animate()
        enemy.velocity.x = -5;
        // console.log('move');
    }
    else if(key_log.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }
    else if(key_log.ArrowUp.pressed && enemy.lastKey === 'ArrowUp'){
        enemy.velocity.y = -20;
    }

    //hitbox hit

    if( attackCollision({rectangle1: player, rectangle2:enemy}) && player.isAttacking){
        player.isAttacking = false;
        console.log('go');
        enemy.health -= 10;//amount of damage done to the enemy 
        document.querySelector('#enemy-health').style.width = enemy.health + '%';//getting the id for the enemy health div and updating it after the damage
    }
    if( attackCollision({rectangle1: enemy, rectangle2:player}) && enemy.isAttacking){
        enemy.isAttacking = false;
        console.log('stop');
        player.health -= 10;//amount of damage done to the enemy 
        document.querySelector('#player-health').style.width = player.health + '%';
    }

    //declaring a winner once someone's health hits zero
    if(enemy.health <= 0){
        clearTimeout(timerID);
        document.querySelector('.result').innerHTML = 'Player wins!';
        document.querySelector('.result').style.display = 'flex';
    }
    if(player.health <= 0){
        clearTimeout(timerID);
        document.querySelector('.result').innerHTML = 'Player loses!';
        document.querySelector('.result').style.display = 'flex';
    }
}

animate();


window.addEventListener('keydown', (event) => {//collects the information of what key is pressed
    switch(event.key) {
        case 'd'://if key pressed is d
            key_log.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a'://if key pressed is a
            key_log.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w'://if key pressed is a
            key_log.w.pressed = true;
            player.lastKey = 'w';
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight'://if key pressed is d
            key_log.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft'://if key pressed is a
            key_log.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp'://if key pressed is a
            key_log.ArrowUp.pressed = true;
            enemy.lastKey = 'ArrowUp';
            // enemy.velocity.y = -3;
            break;
        case 'Shift':
            enemy.attack();
            break;
    }
    // console.log(event.key);
})

window.addEventListener('keyup', (event) => {//collects the information of what key is pressed
    switch(event.key) {
        case 'd'://if key pressed is d
            key_log.d.pressed = false;
            break;
        case 'a'://if key pressed is d
            key_log.a.pressed = false;
            break;
        case 'w'://if key pressed is d
            key_log.w.pressed = false;
            break;
        case 'ArrowRight'://if key pressed is d
            key_log.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft'://if key pressed is d
            key_log.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp'://if key pressed is d
            key_log.ArrowUp.pressed = false;
            break;
    }
    // console.log(event.key);
})