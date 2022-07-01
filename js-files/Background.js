class Background{
    constructor({position, imageSrc, scale = 1, numOfFrames = 1, offset = {x:0,y:0}}){
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.numOfFrames = numOfFrames;
        this.currFrame = 0;
        this.framesElapsed = 0;
        // ^this is asking the computer to go through this many frames(frames here doesn't necessarily mean the diffrent images 
        // but rather just the amount of potential frames that would have elapsed)
        this.targetWaitFrames = 10;
        //this is how many frames we want to elapse before we switch to the next image
        this.offset = offset;

    }
    //details about the image
    draw(){
        c.drawImage(
            this.image, 
            (this.image.width / this.numOfFrames ) * this.currFrame, //splits the image with the different animation sprites to choose the right one x-axis
            0,
            this.image.width/this.numOfFrames, //the actual width of the individual animations
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y, 
            (this.image.width/this.numOfFrames) * this.scale, //scales the sprite to fit correctly onto the canvas
            this.image.height * this.scale) //scales the sprite to fit correctly onto the canvas
            //console.log(this.image.width/this.numOfFrames);
    }
    
    update(){
        this.draw();
        //these update the sprite through its animations
        this.framesElapsed++;

        //the first if statement is just to make sure an appropriate amount of time has passed before the sprite is updated
        if(this.framesElapsed % this.targetWaitFrames === 0){
            if(this.currFrame < (this.numOfFrames-1)){
                this.currFrame ++;
            }
            else{
                this.currFrame = 0;
            }
        } 
    }

}

class Fighter extends Background{
    constructor({position, velocity, color ='red', attackOffset, imageSrc, scale = 1, numOfFrames = 1, offset = {x:0,y:0}, sprites}){
        super({position, imageSrc, scale, numOfFrames, offset});
        // this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.health = 100;
        this.width = 50;
        this.lastKey;
        this.attackRange = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            attackOffset,
            width: 100,
            height: 50,
        }
        this.color = color;
        this.isAttacking = false;
        this.currFrame = 0;
        this.framesElapsed = 0;
        this.targetWaitFrames = 10;
        this.sprites = sprites;

       // const sprite;
        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
        console.log(this.sprites);
    }
    //the update function updates the drawing of the sprites 
    update(){
        this.draw();

        //these update the sprite through its animations
        this.framesElapsed++;

        //the first if statement is just to make sure an appropriate amount of time has passed before the sprite is updated
        if(this.framesElapsed % this.targetWaitFrames === 0){
            if(this.currFrame < (this.numOfFrames-1)){
                this.currFrame ++;
            }
            else{
                this.currFrame = 0;
            }
        } 

        this.attackRange.position.x = this.position.x + this.attackRange.attackOffset.x;//making sure the attack points the right way
        this.attackRange.position.y = this.position.y;

        this.position.x += this.velocity.x;//makes the x axis of the sprite update
        this.position.y += this.velocity.y;//makes the y axis of the sprite update

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){//the condition here makes sure that the bottom of the sprite doesn't go lower than the canvas
            this.velocity.y = 0;//when the bottom of the sprite touches the bottom of the canvas the sprite stops because it's y velocity is set to 0
            this.position.y = 331;//locking the position of the ground after fall so the sprite stays
        }
        else{
            this.velocity.y += gravity;//this creates the acceleration
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    nextSprite(sprite){
        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){//checking if we are currently not on this animation
                    this.image = this.sprites.idle.image;//sets the displaying image to be idle
                    this.numOfFrames = this.sprites.idle.numOfFrames;//gives the image it's appropriate number of frames
                    this.currFrame = 0; //setting this back to zero ensures the animation starts from the first sprite in the image
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.numOfFrames = this.sprites.run.numOfFrames;
                    this.currFrame = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.numOfFrames = this.sprites.jump.numOfFrames;
                    this.currFrame = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.numOfFrames = this.sprites.fall.numOfFrames;
                    this.currFrame = 0;
                }
                break;
        }
    }
}