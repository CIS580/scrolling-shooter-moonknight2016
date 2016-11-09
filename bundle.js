(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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




},{}],2:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
const Weapons = require('./Weapons');
const EnemyManger = require('./enemyManger');


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var bullets = new BulletPool(10);
var missiles = [];
var bombs = [];
var bombs2 = [];
var player = new Player(bullets, missiles,bombs);
var weapons = new Weapons();
var enemyManger = new EnemyManger();

var score = 0;
var numberOfDeaths = 0;
var enemiesKilled = 0;
var health = 5;
var passedLevelTimer = 0;

var backgrounds = [
  new Image(),
  new Image(),
  new Image()
];
//backgrounds[0].src = 'assets/foreground.png';
//backgrounds[1].src = 'assets/midground.png';
//backgrounds[2].src = 'assets/background.png';

backgrounds[0].src = 'assets/map3-1.png';
backgrounds[1].src = 'assets/map2-1.png';
backgrounds[2].src = 'assets/map.png';

var camera2 = {x:0,y: 4000,y1: 17253,y2: 17253};

var levelEnemies = []
var levelState = "beforeStarting"
var currentlevel = 1;
var enemiesTimer = 0;


/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
	
	case "g":
      player.fireMissile();
      event.preventDefault();
      break;
	  
	  case "b":
      player.throwBomb();
      event.preventDefault();
      break;
	  
	case "f":
      //player.fireMissile();
      event.preventDefault();
      
	   var direction = {x: 0, y:0};/*Vector.subtract(
      reticule,
      camera.toScreenCoordinates(player.position)
		);*/
		player.addBullet();
		break;
	case "v":
      weapons.addWeapons("Missile");
	  weapons.addWeapons("Bomb");
	  weapons.addWeapons("Lazer");
	  //console.log(weapons.numberOfweapons);
      event.preventDefault();
      break;
	  
	case "t":
      //player.takeHit();
      event.preventDefault();
      break;
	case "y":
      //player.die();
      event.preventDefault();
      break;
	  
	case "i":
      //player.die();
	  //enemyManger.add(1,{x:200,y:200});
	  //console.log(enemyManger.enemies);
      event.preventDefault();
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

	switch (levelState)
	{
		case "passedLevel":
		passedLevelTimer++;
		
		if (passedLevelTimer> 200)
		{
			passedLevelTimer = 0;
			currentlevel++;
			
			enemiesTimer = 0;
			player = new Player(bullets, missiles,bombs);
			
			enemyManger = new EnemyManger();
			
			levelState = "beforeStarting";
			
			
		}
		break;
		case "beforeStarting":
		populateLevel();
		
		levelState = "normal";
		break;
		
		
		
		case "normal":
		spawnEnemies();
	
	enemiesTimer++;
  // update the player
  player.update(elapsedTime, input);

  // update the camera
  //camera.update(player.position);
  cameraUpdate();

  // Update bullets
  bullets.update(elapsedTime, function(bullet){
    if(!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update missiles
  var markedForRemoval = [];
  missiles.forEach(function(missile, i){
    missile.update(elapsedTime);
    if(Math.abs(missile.position.x - camera.x) > camera.width * 2)
      markedForRemoval.unshift(i);
  });
  // Remove missiles that have gone off-screen
  markedForRemoval.forEach(function(index){
    missiles.splice(index, 1);
  });
  
   markedForRemoval = [];
  bombs.forEach(function(bomb, i){
    bomb.update(elapsedTime);
    if(bomb.remove == "yes")
      markedForRemoval.unshift(i);
  });
  // Remove missiles that have gone off-screen
  markedForRemoval.forEach(function(index){
    bombs.splice(index, 1);
  });
  
  takeWeapons();
  
  var drop = enemyManger.update(elapsedTime);
  
  if (drop.drop != "nothing")
  {
	  //console.log(drop);
	  weapons.addWeapon(drop.x,drop.y,drop.drop);
  }
  
  hitEnemies();
  getHit();
  
	passLevels();
	
		break;
	}
	
		
	
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
	
	switch (levelState)
	{
		case "passedLevel":
		
			ctx.fillStyle = "black";
		  ctx.fillRect(0, 0, 1024, 786);
		  ctx.fillStyle = "white";
		  ctx.font = "35px Arial";
		  ctx.fillText("You passed Level " + currentlevel  ,180,300);
		  ctx.fillText("Your score is:" + score,180,340);
		  ctx.fillText("Your Number of Deaths:" + player.deaths,180,380);
		  
		  //ctx.fillText("Bomb:" + player.bombCount,180,60);
		  //ctx.fillText("Lazer:" + player.lazerCount  ,180,80);
		  //ctx.fillText("Health Meter:"   ,180,100);
		  //ctx.fillStyle = "blue";
		
		
		break;
		
		case "normal":
		ctx.fillStyle = "black";
		  ctx.fillRect(0, 0, 1024, 786);
			renderBackgrounds(elapsedTime, ctx)
		  // TODO: Render background
			
		  // Transform the coordinate system using
		  // the camera position BEFORE rendering
		  // objects in the world - that way they
		  // can be rendered in WORLD cooridnates
		  // but appear in SCREEN coordinates
		  ctx.save();
		  ctx.translate(-camera.x, -camera.y);
		  renderWorld(elapsedTime, ctx);
		  ctx.restore();

		  // Render the GUI without transforming the
		  // coordinate system
		  renderGUI(elapsedTime, ctx);
		break
	}
  
}


/**
  * @function renderBackgrounds
  * Renders the parallax scrolling backgrounds.
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderBackgrounds(elapsedTime, ctx) {
  ctx.save();

  // The background scrolls at 2% of the foreground speed
  ctx.translate(0, -camera2.y2 * 0.2);
  ctx.drawImage(backgrounds[2], 0, 0);
  ctx.restore();

  // The midground scrolls at 60% of the foreground speed
  ctx.save();
  ctx.translate(0, -camera2.y);
  ctx.drawImage(backgrounds[0], 0, 0);
  ctx.restore();

  // The foreground scrolls in sync with the camera
  
  
  
  ctx.save();
  ctx.translate(0, -camera2.y1 * 0.2);
  ctx.drawImage(backgrounds[1], 0, 0);
  ctx.restore();
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
    // Render the bullets
    bullets.render(elapsedTime, ctx);

    // Render the missiles
    missiles.forEach(function(missile) {
      missile.render(elapsedTime, ctx);
    });
	
	bombs.forEach(function(bomb) {
      bomb.render(elapsedTime, ctx);
    });

    // Render the player
    
	weapons.render(elapsedTime, ctx);
	
	enemyManger.render(elapsedTime, ctx);
	player.render(elapsedTime, ctx);
	
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
  ctx.fillStyle = "white";
  ctx.font = "15px Arial";
  ctx.fillText("Your score is:" + score,180,20);
  ctx.fillText("Missiles:" + player.missileCount  ,180,40);
  ctx.fillText("Bomb:" + player.bombCount,180,60);
  ctx.fillText("Lazer:" + player.lazerCount  ,180,80);
  ctx.fillText("Health Meter:"   ,180,100);
  ctx.fillStyle = "blue";
  ctx.fillRect(278,88 , 105, 15);
  ctx.fillStyle = "pink";
  ctx.fillRect(280,90 , 20*player.health, 10);
}

function takeWeapons()
{
	var rec2 = {x:player.position.x,y:player.position.y,width:player.width,height:player.height};
	for (var i = 0 ; i < weapons.numberOfweapons; i++)
	{
		
		var rec1 = {x:weapons.weapons[i].x,y:weapons.weapons[i].y,width:weapons.weaponsWidth,height:weapons.weaponsHeight};
		
		if (testForRectCollision(rec1,rec2))
		{
			//console.log(weapons.weapons);
			switch (weapons.weapons[i].kind)
			{
				case "Missile":
				player.missileCount+=2;
				break;
				case "Bomb":
				player.bombCount+=1;
				break;
				case "Lazer":
				player.lazerCount+=1;
				break;
				
			}
			
			weapons.removeWeapon(i);
			i--;
			
			
		}
		
		
	}
	
}

function hitEnemies()
{
	
	for (var i = 0 ; enemyManger.enemyNum>i ; i++)
	{
		
		/*
		missiles.forEach(function(missile, j){
		 missiles.length;
		if (testForRectPointCollision(enemyManger.enemies[i].position , missile.position))
		{
			enemyManger.enemies[i].hurt();
			
		}
		
        //markedForRemoval.unshift(i);
		});
		*/
		
		// missiles
		for (var j = 0; j < missiles.length; j++)
		{
			var r1 = {x: enemyManger.enemies[i].position.x,
			y: enemyManger.enemies[i].position.y , width: enemyManger.enemies[i].width, height: enemyManger.enemies[i].height};
			
			var r2 = {x: missiles[j].position.x , y: missiles[j].position.y,
					  width: missiles[j].width, height: missiles[j].height}
			if (testForRectCollision( r1, r2) && enemyManger.enemies[i].state != "exploding" )
			{
				enemyManger.enemies[i].hurt();
				missiles.splice(j, 1);
				j--;
				
			}
		}
		
		//bombs
		for (var j = 0; j < bombs.length; j++)
		{
			var r1 = {x: enemyManger.enemies[i].position.x,
			y: enemyManger.enemies[i].position.y , width: enemyManger.enemies[i].width, height: enemyManger.enemies[i].height};
			
			var r2 = {x: bombs[j].position.x , y: bombs[j].position.y,
					  width: bombs[j].width, height: bombs[j].height}
			if (bombs[j].state == "exploding"&&testForRectCollision( r1, r2) && enemyManger.enemies[i].state != "exploding" )
			{
				enemyManger.enemies[i].hurt();
				//bombs.splice(j, 1);
				//j--;
				
			}
		}
		
		for (var ii = 0; ii < player.bullets2.length; ii++)
		{
			var r1 = {x: enemyManger.enemies[i].position.x,
			y: enemyManger.enemies[i].position.y , width: enemyManger.enemies[i].width, height: enemyManger.enemies[i].height};
			
			var r2 = {x: player.bullets2[ii].x , y: player.bullets2[ii].y,
					  width: 2, height: 2}
					  //console.log(r2);
					  if (testForRectCollision( r1, r2))
					  {
						  player.bullets2.splice(ii,1);
						  enemyManger.enemies[i].hurt();
						  ii--;
					  }
			
		}
		/*
		for (var j = 0; j < missiles.length; j++)
		{
			var r1 = {x: enemyManger.enemies[i].position.x,
			y: enemyManger.enemies[i].position.y , width: enemyManger.enemies[i].width, height: enemyManger.enemies[i].height};
			
			var r2 = {x: missiles[j].position.x , y: missiles[j].position.y,
					  width: missiles[j].width, height: missiles[j].height}
			if (testForRectCollision( r1, r2) && enemyManger.enemies[i].state != "exploding" )
			{
				enemyManger.enemies[i].hurt();
				missiles.splice(j, 1);
				j--;
				
			}
		}
			
		*/
	}
}

function cameraUpdate ()
{
	camera2.y-=4;
	if (camera2.y < -400)
		camera2.y = 5000
	
	camera2.y1-=14;
	if (camera2.y1 < -3000 )
		camera2.y1 = 22453
	
	camera2.y2-=3;
	
}
function getHit()
{
	for (var i = 0 ; enemyManger.enemyNum>i ; i++)
	{
		var r1 = {x: enemyManger.enemies[i].position.x,
			y: enemyManger.enemies[i].position.y , width: enemyManger.enemies[i].width, height: enemyManger.enemies[i].height};
			var r2 = {x: player.position.x,
			y: player.position.y , width: player.width, height: player.height};
			
		if (testForRectCollision(r1, r2))
		{
			player.takeHit();
		}
	}
	
}

function testForRectCollision(r1, r2) {
	
	var errorMargine = 2;
  return !( r1.x > r2.x + r2.width-errorMargine ||
            r1.x + r1.width-errorMargine < r2.x ||
            r1.y > r2.y + r2.height-errorMargine ||
            r1.y + r1.height-errorMargine < r2.y
          );
}

function testForRectPointCollision(r, p)
{
	return !( r.x > p.x  ||
            r.x + r.width < p.x ||
            r.y > p.y ||
            r.y + r.height< p.y
          );
	
}

function populateLevel()
{
	
	levelState = "during level"
	
	switch (currentlevel)
	{
		
		case 1:
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 20};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 50};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 50};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 2 , spawnTime: 100};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 2 , spawnTime: 100};levelEnemies.push(enemy); 
			
			var enemy = {x: 200, y: -60 , kind: 1 , spawnTime: 150};levelEnemies.push(enemy); 
			var enemy = {x: 400, y: -60 , kind: 1 , spawnTime: 160};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 170};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 3 , spawnTime: 200};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 3 , spawnTime: 200};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 4 , spawnTime: 500};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 4 , spawnTime: 500};levelEnemies.push(enemy);
			
			var enemy = {x: 400, y: -60 , kind: 10 , spawnTime: 800};levelEnemies.push(enemy);
			
			
		break;
		
		case 2:
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 50};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 50};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 50};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 100};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 100};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 100};levelEnemies.push(enemy); 
			
			
			
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 200};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 200};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 200};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 250};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 250};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 250};levelEnemies.push(enemy);
			
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 300};levelEnemies.push(enemy); 
			
			
			
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 350};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 350};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 350};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 400};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 400};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 400};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 2 , spawnTime: 500};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 2 , spawnTime: 500};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 2 , spawnTime: 500};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 2 , spawnTime: 550};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 2 , spawnTime: 550};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 2 , spawnTime: 550};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 2 , spawnTime: 600};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 2 , spawnTime: 600};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 2 , spawnTime: 600};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 2 , spawnTime: 650};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 2 , spawnTime: 650};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 2 , spawnTime: 650};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 3 , spawnTime: 700};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 4 , spawnTime: 700};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 3 , spawnTime: 700};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 4 , spawnTime: 750};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 3 , spawnTime: 750};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 4 , spawnTime: 750};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 800};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 4 , spawnTime: 800};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 800};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 850};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 3 , spawnTime: 850};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 850};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 4 , spawnTime: 900};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 900};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 4 , spawnTime: 900};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 3 , spawnTime: 950};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 950};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 4 , spawnTime: 950};levelEnemies.push(enemy);
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 1000};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 1000};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 1000};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 1050};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 1050};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 1050};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 1100};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 1100};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 1100};levelEnemies.push(enemy); 
			
			var enemy = {x: 100, y: -60 , kind: 1 , spawnTime: 1200};levelEnemies.push(enemy); 
			var enemy = {x: 350, y: -60 , kind: 1 , spawnTime: 1200};levelEnemies.push(enemy); 
			var enemy = {x: 600, y: -60 , kind: 1 , spawnTime: 1200};levelEnemies.push(enemy); 
			
			var  enemy = {x: 400, y: -60 , kind: 11 , spawnTime: 1500};levelEnemies.push(enemy);
		break;
		case 3:
		var enemy = {x: 400, y: -60 , kind: 12 , spawnTime: 200};levelEnemies.push(enemy);
		
		break;
	}
}

function spawnEnemies ()
{
	
	for (var i = 0 ; i<levelEnemies.length; i++)
	{
		
		if (enemiesTimer > levelEnemies[i].spawnTime)
		{
			
			enemyManger.add(levelEnemies[i].kind,{x:levelEnemies[i].x,y:levelEnemies[i].y} );
			levelEnemies.splice(i,1);
			i--;
		}
	}
}

function passLevels()
{
	
	switch (currentlevel)
	{
		case 1:
		if (enemyManger.bossDeafeated == "yes")
		{
		//currentlevel++;
		levelState = "passedLevel";
		}
		break;
		
		case 2:
		if (enemyManger.bossDeafeated == "yes")
		{
		//currentlevel++;
		levelState = "passedLevel";
		}
		break;
		
		
		case 3:
		if (enemyManger.bossDeafeated == "yes")
		{
		//currentlevel++;
		levelState = "passedLevel";
		}
		break;
	}
	
}
},{"./Weapons":1,"./bullet_pool":4,"./camera":5,"./enemyManger":16,"./game":18,"./player":20,"./vector":22}],3:[function(require,module,exports){
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

},{"./explosion_particles":17,"./vector":22}],4:[function(require,module,exports){
"use strict";

/**
 * @module BulletPool
 * A class for managing bullets in-game
 * We use a Float32Array to hold our bullet info,
 * as this creates a single memory buffer we can
 * iterate over, minimizing cache misses.
 * Values stored are: positionX, positionY, velocityX,
 * velocityY in that order.
 */
module.exports = exports = BulletPool;

/**
 * @constructor BulletPool
 * Creates a BulletPool of the specified size
 * @param {uint} size the maximum number of bullets to exits concurrently
 */
function BulletPool(maxSize) {
  this.pool = new Float32Array(4 * maxSize);
  this.end = 0;
  this.max = maxSize;
  
  this.bullets = [];
  this.bulletSpeed = 7;
}

/**
 * @function add
 * Adds a new bullet to the end of the BulletPool.
 * If there is no room left, no bullet is created.
 * @param {Vector} position where the bullet begins
 * @param {Vector} velocity the bullet's velocity
*/
BulletPool.prototype.add = function(position, velocity) {
  if(this.end < this.max) {
    this.pool[4*this.end] = position.x;
    this.pool[4*this.end+1] = position.y;
    this.pool[4*this.end+2] = velocity.x;
    this.pool[4*this.end+3] = velocity.y;
    this.end++;
	
	this. bullets.push(position);
  }
}

/**
 * @function update
 * Updates the bullet using its stored velocity, and
 * calls the callback function passing the transformed
 * bullet.  If the callback returns true, the bullet is
 * removed from the pool.
 * Removed bullets are replaced with the last bullet's values
 * and the size of the bullet array is reduced, keeping
 * all live bullets at the front of the array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {function} callback called with the bullet's position,
 * if the return value is true, the bullet is removed from the pool
 */
BulletPool.prototype.update = function(elapsedTime, callback) {
  for(var i = 0; i < this.end; i++){
    // Move the bullet
    this.pool[4*i] += this.pool[4*i+2];
    this.pool[4*i+1] += this.pool[4*i+3];
    // If a callback was supplied, call it
    if(callback && callback({
      x: this.pool[4*i],
      y: this.pool[4*i+1]
    })) {
      // Swap the current and last bullet if we
      // need to remove the current bullet
      this.pool[4*i] = this.pool[4*(this.end-1)];
      this.pool[4*i+1] = this.pool[4*(this.end-1)+1];
      this.pool[4*i+2] = this.pool[4*(this.end-1)+2];
      this.pool[4*i+3] = this.pool[4*(this.end-1)+3];
      // Reduce the total number of bullets by 1
      this.end--;
      // Reduce our iterator by 1 so that we update the
      // freshly swapped bullet.
      i--;
    }
  }
  
  for (var i = 0 ; i < this.bullets.length ; i ++)
  {
	  this.bullets[i].y -= this.bulletSpeed;
	  
	  if (false)
	  {
		  this.bullets.splice(i,1);
		  i--;
	  }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
BulletPool.prototype.render = function(elapsedTime, ctx) {
  // Render the bullets as a single path
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  for(var i = 0; i < this.end; i++) {
    ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
    ctx.arc(this.pool[4*i], this.pool[4*i+1], 2, 0, 2*Math.PI);
  }
  ctx.fill();
  ctx.restore();
}

},{}],5:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/**
 * @module Camera
 * A class representing a simple camera
 */
module.exports = exports = Camera;

/**
 * @constructor Camera
 * Creates a camera
 * @param {Rect} screen the bounds of the screen
 */
function Camera(screen) {
  this.x = 0;
  this.y = 0;
  this.width = screen.width;
  this.height = screen.height;
}

/**
 * @function update
 * Updates the camera based on the supplied target
 * @param {Vector} target what the camera is looking at
 */
Camera.prototype.update = function(target) {
  // TODO: Align camera with player
  
   this.x = target.x - 200;
}

/**
 * @function onscreen
 * Determines if an object is within the camera's gaze
 * @param {Vector} target a point in the world
 * @return true if target is on-screen, false if not
 */
Camera.prototype.onScreen = function(target) {
  return (
     target.x > this.x &&
     target.x < this.x + this.width &&
     target.y > this.y &&
     target.y < this.y + this.height
   );
}

/**
 * @function toScreenCoordinates
 * Translates world coordinates into screen coordinates
 * @param {Vector} worldCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toScreenCoordinates = function(worldCoordinates) {
  return Vector.subtract(worldCoordinates, this);
}

/**
 * @function toWorldCoordinates
 * Translates screen coordinates into world coordinates
 * @param {Vector} screenCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toWorldCoordinates = function(screenCoordinates) {
  return Vector.add(screenCoordinates, this);
}

},{"./vector":22}],6:[function(require,module,exports){
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
module.exports = exports = Enemy;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy( position) {
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
  
  this.health = 1;
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
Enemy.prototype.update = function(elapsedTime) {

  
  
  
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
	  this.position.y += ENEMY_SPEED;
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
		  this.position.x += ENEMY_SPEED;
	  else 
		  this.position.x -= ENEMY_SPEED;
	  break;
	  case "exploding":
	  this.explodingTimer++;
	  //console.log(this.position);
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
Enemy.prototype.render = function(elapasedTime, ctx) {
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
	  ctx.drawImage(this.img, 49, 88, 10, 10, 0, -4, 32, 32)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],7:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const ENEMY_SPEED = 6;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Enemy10;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy10( position) {
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
  this.img.src = 'assets/newshi.shp.000000.png';
  this.width  = 128; 
  this.height = 128;
  
  this.health = 20;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.appearingTimer = 0;
  this.movementTimer = 0;
  this.dir = 1;
  
  this.max = ENEMY_SPEED;
  this.min = -ENEMY_SPEED;
  this.period = 10;
  
  this.tempSpeed = ENEMY_SPEED;
  //this.state = "normal";
  this.state = "appearing";
  
  this.fireRate = 50;
  this.fireTimer = 0;
  this.kind = 10;
  this.fireRange = 128;
  
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy10.prototype.update = function(elapsedTime) {

  
  
  
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
	  case "appearing" :
	  this.appearingTimer++;
	  
	  this.position.y++;
	  if (this.appearingTimer > 120)
	  {
		  
		  this.state = "fighting player";
	  }
	  
	  break;
	  case "normal":
	  //this.position.y += ENEMY_SPEED;
	  this.movementTimer++;
	  if (this.movementTimer > 100 )
	  {
		  this.movementTimer = 0;
		  
	  }
	  
	  if (this.tempSpeed == this.max)
			  this.dir = 1 
	  if (this.tempSpeed == this.min)
			  this.dir = -1;
	  
	  if (this.dir == 1)
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed--;
		  }
		  this.position.x += this.tempSpeed;
	  }
	  else 
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed++;
		  }
		  this.position.x += this.tempSpeed;
	  }
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
Enemy10.prototype.render = function(elapasedTime, ctx) {
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
	  case "appearing":
	  case "fighting player":
	  case "normal":
	  
	  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
	  ctx.drawImage(this.img, 0, 10, 90, 130, 0, 0, this.width, this.height)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy10.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy10.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy10.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
 
 Enemy10.prototype.shotFire = function( )
 {
	 
	 var fire = "no";
	 this.fireTimer++;
	 if (this.fireTimer > this.fireRate)
	 {
		 this.fireTimer = 0;
		 fire = "yes";
		 
		 
	 }
	 return fire;
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],8:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const ENEMY_SPEED = 6;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Enemy11;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy11( position) {
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
  this.img.src = 'assets/newsh5.shp.000000.png';
  this.width  = 180; 
  this.height = 180;
  
  this.health = 20;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.appearingTimer = 0;
  this.movementTimer = 0;
  this.dir = 1;
  
  this.max = ENEMY_SPEED;
  this.min = -ENEMY_SPEED;
  this.period = 10;
  
  this.tempSpeed = ENEMY_SPEED;
  //this.state = "normal";
  this.state = "appearing";
  
  this.fireRate = 50;
  this.fireTimer = 0;
  this.kind = 11;
  this.fireRange = 160;
  
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy11.prototype.update = function(elapsedTime) {

  
  
  
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
	  case "appearing" :
	  this.appearingTimer++;
	  
	  this.position.y++;
	  if (this.appearingTimer > 120)
	  {
		  
		  this.state = "fighting player";
	  }
	  
	  break;
	  case "normal":
	  //this.position.y += ENEMY_SPEED;
	  this.movementTimer++;
	  if (this.movementTimer > 100 )
	  {
		  this.movementTimer = 0;
		  
	  }
	  
	  if (this.tempSpeed == this.max)
			  this.dir = 1 
	  if (this.tempSpeed == this.min)
			  this.dir = -1;
	  
	  if (this.dir == 1)
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed--;
		  }
		  this.position.x += this.tempSpeed;
	  }
	  else 
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed++;
		  }
		  this.position.x += this.tempSpeed;
	  }
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
Enemy11.prototype.render = function(elapasedTime, ctx) {
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
	  case "appearing":
	  case "fighting player":
	  case "normal":
	  
	  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
	  ctx.drawImage(this.img,55, 140, 80, 90, 0, 0, this.width, this.height)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy11.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy11.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy11.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
 
 Enemy11.prototype.shotFire = function( )
 {
	 
	 var fire = "no";
	 this.fireTimer++;
	 if (this.fireTimer > this.fireRate)
	 {
		 this.fireTimer = 0;
		 fire = "yes";
		 
		 
	 }
	 return fire;
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],9:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const ENEMY_SPEED = 6;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Enemy12;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy12( position) {
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
  this.img.src = 'assets/newsho.shp.000000.png';
  this.width  = 350; 
  this.height = 210;
  
  this.health = 40;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.appearingTimer = 0;
  this.movementTimer = 0;
  this.dir = 1;
  
  this.max = ENEMY_SPEED;
  this.min = -ENEMY_SPEED;
  this.period = 10;
  
  this.tempSpeed = ENEMY_SPEED;
  //this.state = "normal";
  this.state = "appearing";
  
  this.fireRate = 50;
  this.fireTimer = 0;
  this.kind = 12;
  this.fireRange = 160;
  
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy12.prototype.update = function(elapsedTime) {

  
  
  
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
	  case "appearing" :
	  this.appearingTimer++;
	  
	  this.position.y++;
	  if (this.appearingTimer > 120)
	  {
		  
		  this.state = "fighting player";
	  }
	  
	  break;
	  case "normal":
	  //this.position.y += ENEMY_SPEED;
	  this.movementTimer++;
	  if (this.movementTimer > 100 )
	  {
		  this.movementTimer = 0;
		  
	  }
	  
	  if (this.tempSpeed == this.max)
			  this.dir = 1 
	  if (this.tempSpeed == this.min)
			  this.dir = -1;
	  
	  if (this.dir == 1)
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed--;
		  }
		  this.position.x += this.tempSpeed;
	  }
	  else 
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed++;
		  }
		  this.position.x += this.tempSpeed;
	  }
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
Enemy12.prototype.render = function(elapasedTime, ctx) {
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
	  case "appearing":
	  case "fighting player":
	  case "normal":
	  
	  //ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
	  ctx.drawImage(this.img,4, 9, 183, 124, 0, 0, this.width, this.height)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy12.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy12.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy12.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
 
 Enemy12.prototype.shotFire = function( )
 {
	 
	 var fire = "no";
	 this.fireTimer++;
	 if (this.fireTimer > this.fireRate)
	 {
		 this.fireTimer = 0;
		 fire = "yes";
		 
		 
	 }
	 return fire;
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],10:[function(require,module,exports){
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
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],11:[function(require,module,exports){
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
  this.img.src = 'assets/newsha.shp.000000.png';
  this.width  = 64; 
  this.height = 64;
  
  this.health = 99;
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
	  if (this.movementTimer > 100 )
	  {
		  this.movementTimer = 0;
		  if (this.dir == -1)
			  this.dir = 1 
		  else 
			  this.dir = -1;
	  }
	  if (this.dir == 1)
		  this.position.x += ENEMY_SPEED;
	  else 
		  this.position.x -= ENEMY_SPEED;
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
	  ctx.drawImage(this.img, 8, 56, 58, 58, 0, -4, 64, 64)
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
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],12:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const ENEMY_SPEED = 6;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Enemy4;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy4( position) {
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
  this.img.src = 'assets/newshhp.000000.png';
  this.width  = 64; 
  this.height = 64;
  
  this.health = 99;
  this.hitTimer = 0;
  this.explodingTimer = 0;
  this.explosionParticles = new ExplosionParticles(400);
  
  this.movementTimer = 0;
  this.dir = 1;
  
  this.max = ENEMY_SPEED;
  this.min = -ENEMY_SPEED;
  this.period = 10;
  
  this.tempSpeed = ENEMY_SPEED;
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
Enemy4.prototype.update = function(elapsedTime) {

  
  
  
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
	  if (this.movementTimer > 100 )
	  {
		  this.movementTimer = 0;
		  
	  }
	  
	  if (this.tempSpeed == this.max)
			  this.dir = 1 
	  if (this.tempSpeed == this.min)
			  this.dir = -1;
	  
	  if (this.dir == 1)
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed--;
		  }
		  this.position.x += this.tempSpeed;
	  }
	  else 
	  {
		  if (this.movementTimer % this.period == 0)
		  {
			  this.tempSpeed++;
		  }
		  this.position.x += this.tempSpeed;
	  }
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
Enemy4.prototype.render = function(elapasedTime, ctx) {
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
	  ctx.drawImage(this.img, 0, 58, 48, 53, 0, -4, 64, 64)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Enemy4.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 Enemy4.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 Enemy4.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],13:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const EnemyFire1_SPEED = 3;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = EnemyFire1;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function EnemyFire1( position) {
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
  this.img.src = 'assets/newshh.shp.000000.png';
  this.width  = 32; 
  this.height = 64;
  
  this.health = 50;
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
EnemyFire1.prototype.update = function(elapsedTime) {

  
  
  
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
  
  //this.position.x += EnemyFire1_SPEED;
  switch (this.state)
  {
	  case "normal":
	  this.position.y += EnemyFire1_SPEED;
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
		  this.position.x += EnemyFire1_SPEED;
	  else 
		  this.position.x -= EnemyFire1_SPEED;
	  break;
	  case "exploding":
	  this.explodingTimer++;
	  //console.log(this.position);
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
EnemyFire1.prototype.render = function(elapasedTime, ctx) {
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
	  ctx.drawImage(this.img, 4, 60, 17, 50, 0, -4, 32, 64)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
EnemyFire1.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 EnemyFire1.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 EnemyFire1.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],14:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const EnemyFire2_SPEED = 3;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = EnemyFire2;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function EnemyFire2( position) {
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
  this.img.src = 'assets/newsh5.shp.000000.png';
  this.width  = 32; 
  this.height = 32;
  
  this.health = 50;
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
EnemyFire2.prototype.update = function(elapsedTime) {

  
  
  
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
  
  //this.position.x += EnemyFire2_SPEED;
  switch (this.state)
  {
	  case "normal":
	  this.position.y += EnemyFire2_SPEED;
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
		  this.position.x += EnemyFire2_SPEED;
	  else 
		  this.position.x -= EnemyFire2_SPEED;
	  break;
	  case "exploding":
	  this.explodingTimer++;
	  //console.log(this.position);
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
EnemyFire2.prototype.render = function(elapasedTime, ctx) {
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
	  ctx.drawImage(this.img, 37, 197, 24, 25, 0, -4, 32, 32)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
EnemyFire2.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 EnemyFire2.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 EnemyFire2.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],15:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');
const ExplosionParticles = require('./explosion_particles');

const Bomb = require('./bomb');

//const Bomb = require('./missile');

/* Constants */
const EnemyFire3_SPEED = 8;
const BULLET_SPEED = 9;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = EnemyFire3;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function EnemyFire3( position) {
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
  this.img.src = 'assets/newsh5.shp.000000.png';
  this.width  = 32; 
  this.height = 64;
  
  this.health = 50;
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
EnemyFire3.prototype.update = function(elapsedTime) {

  
  
  
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
  
  //this.position.x += EnemyFire3_SPEED;
  switch (this.state)
  {
	  case "normal":
	  this.position.y += EnemyFire3_SPEED;
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
		  this.position.x += 0;//EnemyFire3_SPEED;
	  else 
		  this.position.x -= 0//EnemyFire3_SPEED;
	  break;
	  case "exploding":
	  this.explodingTimer++;
	  //console.log(this.position);
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
EnemyFire3.prototype.render = function(elapasedTime, ctx) {
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
	  ctx.drawImage(this.img, 146, 139, 19, 58, 0, -4, 32, 64)
  }
  
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
EnemyFire3.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:0, y:0});
  var velocity = {x:0 , y: -BULLET_SPEED}//Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */


 
 EnemyFire3.prototype.hurt = function( )
 {
	 
	 this.health--;
	 if (this.health < 1)
		 this.state = "exploding";
 }
 
 EnemyFire3.prototype.drop  = function( )
 {
	 var drop = {x:0 ,y:0, drop: "nothing"};
	 var i = Math.floor(Math.random()*100)%5;
	 
	 if (i<3)
		 drop = {x:this.position.x ,y:this.position.y, drop:"Missile"};
	 
	 return drop 
 }
},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],16:[function(require,module,exports){
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




},{"./enemy":6,"./enemy10":7,"./enemy11":8,"./enemy12":9,"./enemy2":10,"./enemy3":11,"./enemy4":12,"./enemyFire1":13,"./enemyFire2":14,"./enemyFire3":15}],17:[function(require,module,exports){
"use strict";

/**
 * @module SmokeParticles
 * A class for managing a particle engine that
 * emulates a smoke trail
 */
module.exports = exports = ExplosionParticles;

/**
 * @constructor SmokeParticles
 * Creates a SmokeParticles engine of the specified size
 * @param {uint} size the maximum number of particles to exist concurrently
 */
function ExplosionParticles(maxSize) {
  this.pool = new Float32Array(3 * maxSize);
  this.start = 0;
  this.end = 0;
  this.wrapped = false;
  this.max = maxSize;
  this.radius = 10;
  this.randomSize = "no";
  this.kind = 1;
}

/**
 * @function emit
 * Adds a new particle at the given position
 * @param {Vector} position
*/
ExplosionParticles.prototype.emit = function(position) {
	
	var num1 = 0;
	var num2 = 0;
	switch(this.kind)
	{
		case 1:
		num1 = 12;
		num2 = 24;
		break;
		
		case 2:
		num1 = 50;
		num2 = 400;
		break;
		
	}
  if(this.end != this.max) {
    this.pool[3*this.end] = position.x-num1 + Math.floor(Math.random()*100)%num2;
    this.pool[3*this.end+1] = position.y+num1 - Math.floor(Math.random()*100)%num2;;
    this.pool[3*this.end+2] = 0.0;
    this.end++;
  } else {
    this.pool[3] = position.x;
    this.pool[4] = position.y;
    this.pool[5] = 0.0;
    this.end = 1;
  }
}

/**
 * @function update
 * Updates the particles
 * @param {DOMHighResTimeStamp} elapsedTime
 */
ExplosionParticles.prototype.update = function(elapsedTime) {
  function updateParticle(i) {
    this.pool[3*i+2] += elapsedTime;
    if(this.pool[3*i+2] > 2000) this.start = i;
  }
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      updateParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      updateParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      updateParticle.call(this, i);
    }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
ExplosionParticles.prototype.render = function(elapsedTime, ctx) {
  function renderParticle(i){
    var alpha = 1 - (this.pool[3*i+2] / 1000);
	if (this.randomSize=="yes")
	{
		var radius = 0.1 * this.pool[3*i+2];
		radius += Math.floor(Math.random()*100)%this.radius;
    if(radius > 3+this.radius) radius = 3+this.radius;
    ctx.beginPath();
    ctx.arc(
      this.pool[3*i],   // X position
      this.pool[3*i+1], // y position
      radius, // radius
      0,
      2*Math.PI
    );
	}
	else {
		var radius = 0.1 * this.pool[3*i+2];
    if(radius > 5) radius = 5;
    ctx.beginPath();
    ctx.arc(
      this.pool[3*i],   // X position
      this.pool[3*i+1], // y position
      radius, // radius
      0,
      2*Math.PI
    );
	}
    
    ctx.fillStyle = 'rgba(255, 94, 0,' + alpha + ')';
    ctx.fill();
  }

  // Render the particles individually
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      renderParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      renderParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      renderParticle.call(this, i);
    }
  }
}

},{}],18:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],19:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const SmokeParticles = require('./smoke_particles');
const SmokeParticles = require('./smoke_particles');

/* Constants */
const MISSILE_SPEED = 8;

/**
 * @module Missile
 * A class representing a player's missile
 */
module.exports = exports = Missile;

/**
 * @constructor Missile
 * Creates a missile
 * @param {Vector} position the position of the missile
 * @param {Object} target the target of the missile
 */
function Missile(position, target) {
  this.position = {x: position.x, y:position.y}
  this.target = target;
  this.angle = 180;
  this.img = new Image()
  this.img.src = 'assets/helicopter.png';
  this.smokeParticles = new SmokeParticles(400);
  
  this.width = 8;
  this.height = 16;
}

/**
 * @function update
 * Updates the missile, steering it towards a locked
 * target or straight ahead
 * @param {DOMHighResTimeStamp} elapedTime
 */
Missile.prototype.update = function(elapsedTime) {

  // set the velocity
  var velocity = {x: 0, y: -MISSILE_SPEED}
  if(this.target) {
    var direction = Vector.subtract(this.position, this.target);
    velocity = Vector.scale(Vector.normalize(direction), MISSILE_SPEED);
  }

  // determine missile angle
  this.angle = Math.atan2(velocity.y, velocity.x);

  // move the missile
  this.position.x += velocity.x;
  this.position.y += velocity.y;

  // emit smoke
  this.smokeParticles.emit(this.position);

  // update smoke
  this.smokeParticles.update(elapsedTime);
}

/**
 * @function render
 * Renders the missile in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Missile.prototype.render = function(elapsedTime, ctx) {
  // Draw Missile
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(this.angle);
  ctx.drawImage(this.img, 76, 56, 16, 8, 0, -4, 16, 8);
  ctx.restore();
  // Draw Smoke
  this.smokeParticles.render(elapsedTime, ctx);
}

},{"./smoke_particles":21,"./vector":22}],20:[function(require,module,exports){
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

},{"./bomb":3,"./explosion_particles":17,"./missile":19,"./vector":22}],21:[function(require,module,exports){
"use strict";

/**
 * @module SmokeParticles
 * A class for managing a particle engine that
 * emulates a smoke trail
 */
module.exports = exports = SmokeParticles;

/**
 * @constructor SmokeParticles
 * Creates a SmokeParticles engine of the specified size
 * @param {uint} size the maximum number of particles to exist concurrently
 */
function SmokeParticles(maxSize) {
  this.pool = new Float32Array(3 * maxSize);
  this.start = 0;
  this.end = 0;
  this.wrapped = false;
  this.max = maxSize;
}

/**
 * @function emit
 * Adds a new particle at the given position
 * @param {Vector} position
*/
SmokeParticles.prototype.emit = function(position) {
  if(this.end != this.max) {
    this.pool[3*this.end] = position.x;
    this.pool[3*this.end+1] = position.y;
    this.pool[3*this.end+2] = 0.0;
    this.end++;
  } else {
    this.pool[3] = position.x;
    this.pool[4] = position.y;
    this.pool[5] = 0.0;
    this.end = 1;
  }
}

/**
 * @function update
 * Updates the particles
 * @param {DOMHighResTimeStamp} elapsedTime
 */
SmokeParticles.prototype.update = function(elapsedTime) {
  function updateParticle(i) {
    this.pool[3*i+2] += elapsedTime;
    if(this.pool[3*i+2] > 2000) this.start = i;
  }
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      updateParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      updateParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      updateParticle.call(this, i);
    }
  }
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
SmokeParticles.prototype.render = function(elapsedTime, ctx) {
  function renderParticle(i){
    var alpha = 1 - (this.pool[3*i+2] / 1000);
    var radius = 0.1 * this.pool[3*i+2];
    if(radius > 5) radius = 5;
    ctx.beginPath();
    ctx.arc(
      this.pool[3*i],   // X position
      this.pool[3*i+1], // y position
      radius, // radius
      0,
      2*Math.PI
    );
    ctx.fillStyle = 'rgba(160, 160, 160,' + alpha + ')';
    ctx.fill();
  }

  // Render the particles individually
  var i;
  if(this.wrapped) {
    for(i = 0; i < this.end; i++){
      renderParticle.call(this, i);
    }
    for(i = this.start; i < this.max; i++){
      renderParticle.call(this, i);
    }
  } else {
    for(i = this.start; i < this.end; i++) {
      renderParticle.call(this, i);
    }
  }
}

},{}],22:[function(require,module,exports){
"use strict";

/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

/**
 * @function add
 * Computes the sum of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed sum
*/
function add(a, b) {
 return {x: a.x + b.x, y: a.y + b.y};
}

/**
 * @function subtract
 * Computes the difference of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed difference
 */
function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[2]);
