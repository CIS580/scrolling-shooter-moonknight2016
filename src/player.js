"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const PLAYER_SPEED = 7;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(bullets, missiles,bombs) {
  this.missiles = missiles;
  this.missileCount = 40;
  
  this.lazerCount = 0;
  
  this.bombs = bombs;
  this.bombCount = 10;
  
  this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 500, y: 600};
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/tyrian.shp.007D3C.png';
  this.width  = 23; 
  this.height = 27;
  
  this.health = 5;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.bullets2 = [];
  
  this.state = "normal";
  
  this.deaths = 0;
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {

  
  
  
  //
  switch(this.state)
  {
	  case "hitInv":
	  this.hitTimer++;
	  if (this.hitTimer>60)
	  {
		  this.hitTimer =0;
		  this.state = "normal";
	  }
	  case "normal":
		  // set the velocity
	  this.velocity.x = 0;
	  if(input.left) this.velocity.x -= PLAYER_SPEED;
	  if(input.right) this.velocity.x += PLAYER_SPEED;
	  this.velocity.y = 0;
	  if(input.up) this.velocity.y -= PLAYER_SPEED / 2;
	  if(input.down) this.velocity.y += PLAYER_SPEED / 2;

	  // determine player angle
	  this.angle = 0;
	  if(this.velocity.x < 0) this.angle = -1;
	  if(this.velocity.x > 0) this.angle = 1;

	  // move the player
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;

	  // don't let the player move off-screen
	  if(this.position.x < 0) this.position.x = 0;
	  if(this.position.x > 1024) this.position.x = 1024;
	  if(this.position.y > 786) this.position.y = 786;
	  
	  for(var i = 0; i < this.bullets2.length; i++) {
		this.bullets2[i].y-=4;
		}
	  
	  break;
	  
	  case "exploding":
	  this.explodingTimer++;
	  //console.log(this.position);
	  this.explosionParticles.emit(this.position);
	  this.explosionParticles.update(elapsedTime);
	  if (this.explodingTimer>65)
	  {
		  this.explodingTimer =0;
		  this.state = "hitInv";
		  
		  this.health = 5;
	  }
	  break
	  
  }
  
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  
  switch(this.state)
  {
	  case "hitInv":
	  if (this.hitTimer%4==1)
		ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
	  break;
	  
	  case "exploding":
	  ctx.restore();
	  this.explosionParticles.render(elapasedTime, ctx);
	  break;
	  case "normal":
	  ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  }
  
  
  //
  ctx.restore();
  
  
  
  ctx.restore();
  
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  //ctx.translate(this.position.x, this.position.y);
  for(var i = 0; i < this.bullets2.length; i++) {
    ctx.fillRect(this.bullets2[i].x,this.bullets2[i].y,2,2);
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Player.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}


Player.prototype.fireBullet2 = function() {
  var position = {x : this.position.x, y: this.position.y }; 
  this.bullets2.push(position);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
 
 Player.prototype.removeBullet = function() {
  
}
Player.prototype.fireMissile = function() {
  if(this.missileCount > 0){
    var position = Vector.add(this.position, {x:0, y:0})
    var missile = new Missile(position);
    this.missiles.push(missile);
    this.missileCount--;
  }
}

Player.prototype.throwBomb = function() {
  if(this.bombCount > 0){
    var position = Vector.add(this.position, {x:0, y:0})
    var bomb = new Bomb(position);
    this.bombs.push(bomb);
    this.bombCount--;
  }
}

Player.prototype.takeHit = function()
{
	if (this.state =="normal")
	{
	this.state = "hitInv";
	this.health--;
	if (this.health<1)
		this.die();
	}
	
}

Player.prototype.die = function()
{
	this.explosionParticles = new ExplosionParticles(400);
	this.explosionParticles.radius = 20;
	this.randomSize = "yes";
	this.state = "exploding";
	this.deaths++;
	//this.health--;
}

Player.prototype.addBullet = function(){
	
var pos = {x: this.position.x-1, y:this.position.y-11};
	this.bullets2.push(pos);
	console.log(this.bullets2.length);
}
