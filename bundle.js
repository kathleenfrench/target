(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// game.js

var alert = require('alerts');

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
    score = 0,
    lives = 3,
    livesText,
    lifeLostText,
    playing = false,
    startButton,
    spaceKey,
    textSpace;

// http://127.0.0.1:8080/

function preload(){
  game.load.image('ball', 'assets/ball.png');
  game.load.image('paddle', 'assets/paddle.png');
  game.load.image('brick', 'assets/brick.png');
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.spritesheet('ball', 'assets/wobble.png', 20, 20);
  game.load.spritesheet('button', 'assets/button.png', 120, 40);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
  ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
  ball.anchor.set(0.5);
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;

  initBricks();
  textStyle = { font: '16px Arial', fill: '#0095DD'};
  scoreText = game.add.text(5, 5, 'Score: 0', textStyle);
  livesText = game.add.text(game.world.width - 5, 5, 'Lives: ' + lives, textStyle);
  livesText.anchor.set(1, 0);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'You died. Click to continue.', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  // start button

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);

  // pause functionality

  spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(togglePause, this);

}

function update(){
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  if (playing){
    paddle.x = game.input.x || game.world.width * 0.5;
  }
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
  ball.animations.play('wobble');
  // shorthand for below --> game.add.tween(brick.scale).to({ x: 2, y: 2}, 500, Phaser.Easing.Elastic.Out, true, 100);
  var killTween = game.add.tween(brick.scale);
  killTween.to({x: 0, y: 0}, 200, Phaser.Easing.Linear.None);
  killTween.onComplete.addOnce(function(){
    brick.kill();
  }, this);
  killTween.start();
  score += 10;
  scoreText.setText('Score: ' + score);

  if (score === brickInfo.count.row * brickInfo.count.col * 10){
    alert('You Win!');
    location.reload();
  }
}

function ballLeaveScreen(){
  lives--;
  if (lives){
    livesText.setText('Lives: ' + lives);
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(function(){
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert('Game Over');
    location.reload();
  }
}

function ballHitPaddle(ball, paddle){
  ball.animations.play('wobble');
  ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}

function startGame(){
  startButton.destroy();
  ball.body.velocity.set(150, -150);
  playing = true;
}

function togglePause(){
  game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
}

},{"alerts":2}],2:[function(require,module,exports){
var initialized;
var container = document.createElement('div');

var alert = function (message, options) {
  return (new Alert(message, options)).show();
};

// Config options
alert.transitionTime = 0;
alert.containerClassName = 'alerts';
alert.showClassName = 'alert-show';
alert.dismissClassName = 'alert-dismiss';

alert.Alert = Alert;
alert.container = container;

try { module.exports = alert; }
catch (err) { window.al = alert; }



function Alert (message, options) {
  if (!initialized) initialize();

  options = options || {};
  this.options = options;

  this.message = message || '';
  this.timeout = options.timeout || false;
  this.className = options.className || '';
  this.onshow = options.onshow;
  this.ondismiss = options.ondismiss;
}

Alert.prototype.create = function () {
  var el = this.el = document.createElement('div');
  var timeout = alert.transitionTime || 0;
  var optsClassName = this.className;
  el.className = ['alert', this.className].join(' ');
  el.innerHTML = this.message;
  
  setTimeout(function () { 
    el.className = ['alert', alert.showClassName, optsClassName].join(' ');
  }, timeout);
  container.appendChild(this.el);
};

Alert.prototype.show = function () {
  this.create();
  this.configure();

  if (typeof this.onshow === 'function') this.onshow.call(this.el, this.options);
  return this;
};

Alert.prototype.configure = function () {
  var self = this;
  var timeout;

  if (this.timeout) {
    timeout = setTimeout(function () { self.destroy(); }, this.timeout);
  }

  this.el.addEventListener('click', function (e) {
    if (timeout) clearTimeout(timeout);
    self.destroy();
  }, false);
};

Alert.prototype.destroy = function () {
  var el = this.el;
  var timeout = alert.transitionTime || 0;
  var self = this;

  el.className = ['alert', alert.dismissClassName, this.className].join(' ');
  setTimeout(function () { 
    if (typeof self.ondismiss === 'function') self.ondismiss.call(self);
    container.removeChild(el);
  }, timeout);
};

function initialize () {
  initialized = true;
  container.className = alert.containerClassName;
  document.body.appendChild(container);
}
},{}]},{},[1]);
