"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const ENEMY_SPEED = 3;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Enemy2;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy2( position) {
  //this.missiles = missiles;
  this.missileCount = 4;
  
  this.lazerCount = 0;
  
  //this.bombs = bombs;
  this.bombCount = 10;
  
  //this.bullets = bullets;
  this.angle = 0;
  this.position = position;
  this.velocity = {x: 0, y: 0};
  this.img = new Image()
  this.img.src = 'assets/destruct_sprites.png';
  this.width  = 32; 
  this.height = 32;
  
  this.health = 3;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.movementTimer = 0;
  this.dir = 1;
  
  //this.state = "normal";
  this.state = "normal";
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy2.prototype.update = function(elapsedTime) {

  
  
  
  /*
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
	  
	  
	  break;
	  
	  case "exploding":
	  this.explodingTimer++;
	  console.log(this.position);
	  this.explosionParticles.emit(this.position);
	  this.explosionParticles.update(elapsedTime);
	  if (this.explodingTimer>65)
	  {
		  this.explodingTimer =0;
		  this.state = "hitInv";
		  
		  this.health = 5;
	  }
	  break
	  
  }*/
  
  //this.position.x += ENEMY_SPEED;
  switch (this.state)
  {
	  case "normal":
	  //this.position.y += ENEMY_SPEED;
	  this.movementTimer++;
	  if (this.movementTimer > 40 )
	  {
		  this.movementTimer = 0;
		  if (this.dir == -1)
			  this.dir = 1 
		  else 
			  this.dir = -1;
	  }
	  if (this.dir == 1)
		  this.position.y += ENEMY_SPEED;
	  else 
		  this.position.y -= ENEMY_SPEED;
	  break;
	  case "exploding":
	  this.explodingTimer++;
	  console.log(this.position);
	  this.explosionParticles.emit(this.position);
	  this.explosionParticles.update(elapsedTime);
	  
	  if (this.explodingTimer>65)
	  {
		  this.explodingTimer =0;
		  this.state = "dead";
		  
		  //this.health = 5;
	  }
	  break;
  }
  
  
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy2.prototype.render = function(elapasedTime, ctx) {
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
	  
	  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
	  ctx.drawImage(this.img, 49, 74, 10, 10, 0, -4, 32, 32)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy2.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy2.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy2.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%6;
	 
	 if (i<4)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Bomb"};
	 
	 return drop 
 }