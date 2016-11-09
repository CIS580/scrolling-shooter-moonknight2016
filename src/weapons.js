"use strict";

/* Classes and Libraries */


/* Constants */
const PLAYER_SPEED = 7;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Weapons;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Weapons() {
  //this.missiles = missiles;
  //this.missileCount = 4;
  //this.bullets = bullets;
  this.angle = 0;
  this.position = {x: 500, y: 600};
  this.velocity = {x: 0, y: 0};
  this.numberOfweapons = 0;
  this.weapons = [];
  this.weaponsWidth = 60;
  this.weaponsHeight = 30;
  //this.img = new Image()
  //this.img.src = 'assets/tyrian.shp.007D3C.png';
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Weapons.prototype.update = function(elapsedTime ) {

  // set the velocity
  this.velocity.x = 0;
  //i//f(input.left) this.velocity.x -= PLAYER_SPEED;
  //if(input.right) this.velocity.x += PLAYER_SPEED;
  this.velocity.y = 0;
  //if(input.up) this.velocity.y -= PLAYER_SPEED / 2;
  //if(input.down) this.velocity.y += PLAYER_SPEED / 2;

  // determine player angle
  this.angle = 0;
  //if(this.velocity.x < 0) this.angle = -1;
  //if(this.velocity.x > 0) this.angle = 1;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // don't let the player move off-screen
  //if(this.position.x < 0) this.position.x = 0;
  //if(this.position.x > 1024) this.position.x = 1024;
  //if(this.position.y > 786) this.position.y = 786;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Weapons.prototype.render = function(elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  //ctx.translate(this.position.x, this.position.y);
  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  
  for (var i = 0 ; i < this.numberOfweapons ; i++)
  {
	  //ctx.translate(this.weapons[i].x, this.weapons[i].y);
  //ctx.fillRect(0,0, 20,20);
  switch (this.weapons[i].kind)
  {
	case "Missile":
	ctx.fillStyle = "blue"  
	break;
	case "Bomb":
	ctx.fillStyle = "red"  
	break;
	case "Lazer":
	ctx.fillStyle = "violet"
	break;
  }
  
  
  ctx.fillRect(this.weapons[i].x, this.weapons[i].y, this.weaponsWidth,this.weaponsHeight);
  
  ctx.fillStyle = "white";
  ctx.font = "15px Arial";
  ctx.fillText(this.weapons[i].kind,this.weapons[i].x+10, this.weapons[i].y+20);
  
  }
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Weapons.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
Weapons.prototype.fireMissile = function() {
  if(this.missileCount > 0){
    var position = Vector.add(this.position, {x:0, y:0})
    var missile = new Missile(position);
    this.missiles.push(missile);
    this.missileCount--;
  }
  
  
}

Weapons.prototype.addWeapon = function(xx,yy,kind) {
   this.numberOfweapons++;
   var weap = {x: xx, y: yy, kind:kind};
   this.weapons.push(weap);
	console.log (this.weapons);
  
}

Weapons.prototype.addWeapons = function(kind) {
   this.numberOfweapons++;
   var weap = {x: 500, y: 600-50*this.numberOfweapons, kind:kind};
   this.weapons.push(weap);

  
}

Weapons.prototype.removeWeapon = function(num){
	//console.log(this.weapons[num]);
	//console.log("before cutting"+this.numberOfweapons);
	this.weapons.splice(num,1);
	//console.log("after cutting"+this.numberOfweapons);
	this.numberOfweapons--;
}



