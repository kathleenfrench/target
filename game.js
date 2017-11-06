var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update
});

var ball,
    paddle,
    bricks,
    newBrick,
    brickInfo,
    scoreText,
    score = 0;

// http://127.0.0.1:8080/

function preload(){
  game.load.image('ball', 'assets/ball.png');
  game.load.image('paddle', 'assets/paddle.png');
  game.load.image('brick', 'assets/brick.png');
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
  ball.anchor.set(0.5);
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function(){
    alert('Game Over');
    location.reload();
  }, this);
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, -150);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;

  initBricks();
  scoreText = game.add.text(5, 5, 'Score: 0', { font: '18px Arial', fill: '#0095DD'});
}

function update(){
  game.physics.arcade.collide(ball, paddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  paddle.x = game.input.x || game.world.width * 0.5;
}

function initBricks(){
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 7,
      col: 3
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 10
  };

  bricks = game.add.group();

  for (c = 0; c < brickInfo.count.col; c++){
    for (r = 0; r < brickInfo.count.row; r++){
      var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}


function ballHitBrick(ball, brick){
  brick.kill();
  score += 10;
  scoreText.setText('Score: ' + score);

  var count_alive = 0;
  for (i = 0; i < bricks.children.length; i++){
    if (bricks.children[i].alive == true){
      count_alive ++;
    }
  }
  if (count_alive == 0){
    alert('You Win!');
    location.reload();
  }
}
