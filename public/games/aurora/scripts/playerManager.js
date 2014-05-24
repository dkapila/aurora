"use strict";

define(['./settings'], function (Settings) {

	var game;

    var PlayerManager = function (g) {
    	game = g;
        this.queue = [];
        this.players = {};

    }

    PlayerManager.prototype.add = function(netPlayer) {
    	var self = this,
    		id = netPlayer.id;

    	this.queue.push(netPlayer);

        console.log('player connected');

    	netPlayer.addEventListener('disconnect', function () {
    		netPlayer.removeAllListeners();
    		var player = self.players[id];
    		player.left = true;
    		if (self.players[player.pair].left) {
    			console.log('REMOVING PLAYERS ' + player.id + ' AND ' + player.pair);
    			// remove the 2 sprites
    			player.sprite.kill();
    			self.players[player.pair].sprite.kill();
    			delete self.players[player.id];
    			delete self.players[player.pair];
    		}
	        console.log('player disconnected');
	        console.log(player);
	        console.log('players');
	        console.log(self.players);
	    });

	    netPlayer.addEventListener('move', function (data) {
	    	console.log('move: ' + JSON.stringify(data));
	    	var sprite = self.players[netPlayer.id].sprite;
	    	sprite.body.velocity.x = data.x * data.speed * Settings.SPEED;
	    	sprite.body.velocity.y = data.y * data.speed * Settings.SPEED;
	    });

		netPlayer.addEventListener('stop', function (data) {
	    	console.log('stop: ' + JSON.stringify(data));
	    });

    	if (this.queue.length < 2) {
    		return;
    	}

    	var p1 = this.queue.shift(),
    		p2 = this.queue.shift();

    	this.setupPlayer(p1, p2, 'red');
    	this.setupPlayer(p2, p1, 'blue');

    	console.log(this.players);
    };

    PlayerManager.prototype.createGroup = function() {
    	this.sprites = game.add.group();
    };

    PlayerManager.prototype.setupPlayer = function (p1, p2, sprite) {
    	var sprite = this.sprites.create(game.rnd.integerInRange(0, game.world.centerX), game.rnd.integerInRange(0, game.world.centerY), sprite);
		game.physics.enable(sprite, Phaser.Physics.ARCADE);
		sprite.body.collideWorldBounds = true;
		console.log(sprite.body);

    	this.players[p1.id] = {
	    	'sprite': sprite,
	    	'pair': p2.id
    	};

    	sprite.body.collideWorldBounds = true;
		sprite.body.bounce.x = 0.5;
		sprite.body.bounce.y = 0.5;
		sprite.body.minBounceVelocity = 0;
		sprite.body.mass = 100;
	}

	PlayerManager.prototype.update = function() {
		game.physics.arcade.collide(this.sprites);
	};

    return PlayerManager;

});

