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