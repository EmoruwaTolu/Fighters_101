// class Fighter extends Background{
//     constructor({position, velocity, color ='red', offset, image, scale = 1, numOfFrames = 1}){
//         super(position, image, scale, numOfFrames);
//         this.velocity = velocity;
//         this.height = 150;
//         this.health = 100;
//         this.width = 50;
//         this.lastKey;
//         this.attackRange = {
//             position: {
//                 x: this.position.x,
//                 y: this.position.y
//             },
//             offset,
//             width: 100,
//             height: 50,
//         }
//         this.color = color;
//         this.isAttacking = false;
//         this.currFrame = 0;
//         this.framesElapsed = 0;
//         this.targetWaitFrames = 10;
//     }
//     //the update function updates the drawing of the sprites 
//     update(){
//         this.draw();

//         this.attackRange.position.x = this.position.x + this.attackRange.offset.x;//making sure the attack points the right way
//         this.attackRange.position.y = this.position.y;

//         this.position.x += this.velocity.x;//makes the x axis of the sprite update
//         this.position.y += this.velocity.y;//makes the y axis of the sprite update

//         if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){//the condition here makes sure that the bottom of the sprite doesn't go lower than the canvas
//             this.velocity.y = 0;//when the bottom of the sprite touches the bottom of the canvas the sprite stops because it's y velocity is set to 0
//         }
//         else{
//             this.velocity.y += gravity;//this creates the acceleration
//         }
//     }

//     attack(){
//         this.isAttacking = true;
//         setTimeout(() => {
//             this.isAttacking = false;
//         }, 100)
//     }
// }