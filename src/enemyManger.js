"use strict";

/* Classes and Libraries */
//const Vector = require('./vector');


const Enemy = require('./enemy');
const Enemy2 = require('./enemy2');
const Enemy3 = require('./enemy3');
const Enemy4 = require('./enemy4');
const EnemyFire1 = require('./enemyFire1');

const Enemy10 = require('./enemy10');

const EnemyFire2 = require('./enemyFire2');

const EnemyFire3 = require('./enemyFire3');

const Enemy11 = require('./enemy11');

const Enemy12 = require('./enemy12');

//const Bomb = require('./missile');

/* Constants */
//const PLAYER_SPEED = 7;
//const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = EnemyManger;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function EnemyManger() {
  this.enemyNum = 0;
  this.enemies = [];
  this.enemiesFire = [];
  
  this.bossDeafeated = "no";
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
EnemyManger.prototype.update = function(elapsedTime) {
var drop = {x: 0,y: 0, drop: "nothing"};
for (var i = 0; i < this.enemyNum; i++)
  {
	  this.enemies[i].update(elapsedTime );
	  
	  if (this.enemies[i].kind > 9)
	  {
	  this.shot(i);//console.log(i);
	  }
	  
	  
	  
	  if (this.enemies[i].state == "normal" || this.enemies[i].state == "exploading")
		  this.enemies[i].position.y+=1;
	  if (this.enemies[i].state == "dead" || this.enemies[i].position.y > 1500)
	  {
		  if (!( this.enemies[i].position.y > 1500))
		   drop = this.enemies[i].drop();
		  this.remove(i)
		  i--;
	  }
	  

  }
   return drop;
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
EnemyManger.prototype.render = function(elapsedTime, ctx) {
 
  
  for (var i = 0; i < this.enemyNum; i++)
  {
	  this.enemies[i].render(elapsedTime, ctx);
  }
  ctx.restore();
}

EnemyManger.prototype.add = function(kind,position) {
 var enm;
 switch (kind)
 {
	 case 1:
	 enm = new Enemy(position);
	 break;
	 
	 case 2:
	 enm = new Enemy2(position);
	 break;
	 
	 case 3:
	 enm = new Enemy3(position);
	 break;
	 
	 case 4:
	 enm = new Enemy4(position);
	 break;
	 
	 case 5:
	 enm = new EnemyFire1(position);
	 break;
	 
	 case 6:
	 enm = new EnemyFire2(position);
	 break;
	 
	 case 7:
	 enm = new EnemyFire3(position);
	 break;
	 case 10:
	 enm = new Enemy10(position);
	 break;
	 
	 case 11:
	 enm = new Enemy11(position);
	 break;
	 
	 case 12:
	 enm = new Enemy12(position);
	 break;
 }
 
 this.enemies.push(enm); console.log("kind:"+kind,"position:"+position);
 this.enemyNum++;
}

EnemyManger.prototype.remove = function(num) {
  if (this.enemies[num].kind > 9)
	  this.bossDeafeated = "yes";
  
  //console.log(this.bossDeafeated);
  this.enemies.splice(num,1);
  this.enemyNum--;
  
  
}

EnemyManger.prototype.shot = function( i) {
  
  
	  
		  if (this.enemies[i].shotFire() == "yes")
		  {
			  //var enm = {kind : 1 , position: this.enemies[i].position};
			  switch (this.enemies[i].kind)
			  {
				  case 10:
					var pos = {x: this.enemies[i].position.x , y: this.enemies[i].position.y     +  this.enemies[i].fireRange };
		   
					this.add(5 , pos);
				  break;
				  
				  case 11:
				  var pos = {x: this.enemies[i].position.x+10  , y: this.enemies[i].position.y     +  this.enemies[i].fireRange };
		   
					this.add(6 , pos);
					
					var pos = {x: this.enemies[i].position.x + 90 , y: this.enemies[i].position.y     +  this.enemies[i].fireRange };
		   
					this.add(6 , pos);
				  break;
				  
				  case 12:
				  var pos = {x: this.enemies[i].position.x  , y: this.enemies[i].position.y     +  this.enemies[i].fireRange };
		   
					this.add(7 , pos);
				  
				  var pos = {x: this.enemies[i].position.x + 90 , y: this.enemies[i].position.y     +  this.enemies[i].fireRange+40 };
		   
					this.add(7 , pos);
					
					 var pos = {x: this.enemies[i].position.x + 180 , y: this.enemies[i].position.y     +  this.enemies[i].fireRange+80 };
		   
					this.add(7 , pos);
					
					var pos = {x: this.enemies[i].position.x + 270 , y: this.enemies[i].position.y     +  this.enemies[i].fireRange+40 };
		   
					this.add(7 , pos);
					
					var pos = {x: this.enemies[i].position.x + 360 , y: this.enemies[i].position.y     +  this.enemies[i].fireRange };
		   
					this.add(7 , pos);
				  break;
			  }
		  
		  }
	  
  
  
}



