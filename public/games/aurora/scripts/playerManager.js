"use strict";

define(function () {

	var game;

    var PlayerManager = function (g) {
    	game = g;
        this.queue = [];
        this.players = {};
    }

    PlayerManager.prototype.add = function(netPlayer) {
    	var self = this;
    	var sprite = game.add.sprite(game.rnd.integerInRange(0, game.world.centerX), game.rnd.integerInRange(0, game.world.centerY), 'red');
    	this.players[netPlayer.id] = {
	    	'sprite': sprite
    	};

    	netPlayer.addEventListener('disconnect', function () {
	        console.log('player disconnected');
	        sprite.kill();
	        delete self.players[netPlayer.id];
	    });

	    netPlayer.addEventListener('move', function (data) {
	    	console.log(data);
	    });

		netPlayer.addEventListener('stop', function (data) {
	    	console.log(data);
	    });

    };

    return PlayerManager;

});

