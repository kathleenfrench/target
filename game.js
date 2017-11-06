var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update
});

var ball;

function preload(){
  game.load.image('ball', 'assets/ball.png');
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(50, 50, 'ball');
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.velocity.set(150, 150);
}

function update(){
}
