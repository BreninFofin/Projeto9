var trex, trex_running, edges;
var groundImage;
var cloud, cloudsGroup, cloudImage;
var obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpsound, checkpointsound, diesound;
var gameOver, restart;
var gameOverimg, resetimg; 

function preload() {

  //carregar trex
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
 
  //carregar gameOver
  gameOverimg = loadImage("gameOver.png")
  resetimg = loadImage("restart.png")
  //carregar chão
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("hi.png");

  //carregar obstáculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  //carregando as variáveis

  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);

  //criando grupos de obstáculos e nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //Sprite de quando morrer
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverimg);
  restart = createSprite(width/2,height/2 - 60);
  restart.addImage(resetimg);

  //criando o trex
  trex = createSprite(50, height - 70, 20, 50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  trex.setCollider("rectangle",0,0,trex.width,trex.height); 

  //criar chão
  ground = createSprite(200, height - 15, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //chão invisível
  invisibleGround = createSprite(width/2, height - 10, width, 10);
  invisibleGround.visible = false;

  //pontos
  score = 0
}

function draw() {
  
  //definir a cor do plano de fundo 
  background(180);
  text("Score: " + score, 500, 50);
  if (gameState === PLAY) {
    ground.velocityX = -(4+3*score/500);

    gameOver.visible = false;
    restart.visible = false;
    
    //chão infinito
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

    //pontuação
    score = score + Math.round(frameCount / 60);

     //pular quando tecla de espaço for pressionada
  if ((touches.length > 0 || keyDown("space")) && trex.y >= height-70) {
    trex.velocityY = -12;
    jumpsound.play();
    touches = [];
  }

  //velocidade do trex
  trex.velocityY = trex.velocityY + 0.8;

  //gerar nuvens
  spawnClouds();

  //gerar obstáculos
  spawnObstacle();

  //verificar se o trex tocou num obstáculo
  if (obstaclesGroup.isTouching(trex)){
   gameState = END;
  }

  } else if (gameState === END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    gameOver.visible = true;
    obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);
    restart.visible = true;
  }

  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  if (mousePressedOver(restart)){
  reset()
  }

  drawSprites();
}
function spawnClouds() {
  //gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10, height - 100));
    cloud.scale = 0.08;
    cloud.velocityX = -3
    //ajustar profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //tempo de vida para as nuvens
    cloud.lifetime = width/3;

    //adicionando cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}
//criar obstáculos
function spawnObstacle() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width, height - 30, 10, 40);
    obstacle.velocityX = -(6+score/500);
    //obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    //tamanho e tempo de vida do obstáculo
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adicionando cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}