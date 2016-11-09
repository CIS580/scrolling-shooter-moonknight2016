"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const SmokeParticles = require('./smoke_particles');
const SmokeParticles = require('./explosion_particles');

/* Constants */
const MISSILE_SPEED = 5;

/**
 * @module Missile
 * A class representing a player's missile
 */
module.exports = exports = Bomb;

/**
 * @constructor Missile
 * Creates a missile
 * @param {Vector} position the position of the missile
 * @param {Object} target the target of the missile
 */
function Bomb(position, target) {
  this.position = {x: position.x, y:position.y}
  this.target = target;
  this.angle = 180;
  this.img = new Image()
  this.img.src = 'assets/destruct_sprites.png';
  this.smokeParticles = new SmokeParticles(400);
  
  this.state = "flying";
  this.flyingTimer = 0;
  this.explodingTimer = 0;
  this.waitTimer = 0;
  this.remove = "no"
  
  this.width = 120;
  this.height = 120;
}

/**
 * @function update
 * Updates the missile, steering it towards a locked
 * target or straight ahead
 * @param {DOMHighResTimeStamp} elapedTime
 */
Bomb.prototype.update = function(elapsedTime) {

	
  // set the velocity
  var velocity = {x: 0, y: -MISSILE_SPEED}
  if(this.target) {
    var direction = Vector.subtract(this.position, this.target);
    velocity = Vector.scale(Vector.normalize(direction), MISSILE_SPEED);
  }

  // determine missile angle
  this.angle = Math.atan2(velocity.y, velocity.x);

  // move the missile
  switch(this.state)
	{
		case "flying":
		this.flyingTimer++;
		this.position.x += velocity.x;
		this.position.y += velocity.y;
		
		  // emit smoke
		this.smokeParticles.emit(this.position);

		// update smoke
		this.smokeParticles.update(elapsedTime);
		
		if (this.flyingTimer > 40)
			
			{
				this.state = "waiting";
				
			}
		break;
		
		case "waiting":
		this.waitTimer++;
		this.smokeParticles.update(elapsedTime);
		if(this.waitTimer>15)
		{
			this.state = "exploding";
			this.smokeParticles.kind = 2;
			this.smokeParticles.randomSize = "yes"
		}
		break;
		case "exploding":
		this.explodingTimer++;
		if (this.explodingTimer>60)
			this.remove = "yes";
		
		  // emit smoke
		this.smokeParticles.emit(this.position);

		// update smoke
		this.smokeParticles.update(elapsedTime);
		//if )
		break;
		
	}


}

/**
 * @function render
 * Renders the missile in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Bomb.prototype.render = function(elapsedTime, ctx) {
  // Draw Missile
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(this.angle);
  if (this.state == "flying")
  ctx.drawImage(this.img, 83, 143, 12, 7, 0, -4, 32, 16);
  ctx.restore();
  // Draw Smoke
  this.smokeParticles.render(elapsedTime, ctx);
}
