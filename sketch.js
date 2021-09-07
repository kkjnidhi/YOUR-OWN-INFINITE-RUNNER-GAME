var PLAY = 1;
var END = 0;
var gameState = PLAY;
var player, p_running, p_collided;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var backgroundImg
var score=0;
var jumpSound, collidedSound;
var gameOver, restart;
function preload(){
  collidedSound = loadSound("collided.wav")
  backgroundImg = loadImage("bg.jpg") 
  p_running = loadAnimation("pic 1.png","pic 2.png","pic 3.png","pic 4.png","pic 5.png");
  p_collided = loadAnimation("pic 1.png");
  obstacle1 = loadImage("g2.png");
  obstacle2 = loadImage("g3.png");
  obstacle3 = loadImage("g4.png"); 
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);  
  player = createSprite(250,height-80,20,50);  
  player.addAnimation("running", p_running);
  player.addAnimation("collided", p_collided);
  player.scale = 0.3
  player.setCollider('circle',0,0,100)
  player.debug = true
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup = new Group();
   score = 0;
}

function draw() {
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50); 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    player.y = World.mouseY
    player.velocityY = player.velocityY + 0.8  
    spawnObstacles();
    if(obstaclesGroup.isTouching(player)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true; 
    player.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
 //change the player animation
    player.changeAnimation("collided",p_collided);
     //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1); 
   
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width+20,height-300,20,30);
    obstacle.y = Math.round(random(30,800));
    obstacle.setCollider('circle',0,0,60)
    // obstacle.debug = true
    obstacle.debug = true
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
      case 3: obstacle.addImage(obstacle3);
              break;

    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
    obstacle.depth = player.depth;
    player.depth =  player.depth+1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();

  
  player.changeAnimation("running",p_running);
  
  score = 0;
  
}
