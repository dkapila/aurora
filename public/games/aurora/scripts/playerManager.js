"use strict";

define(function () {

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
	    });

		netPlayer.addEventListener('stop', function (data) {
	    	console.log('stop: ' + JSON.stringify(data));
	    });

    	if (this.queue.length < 2) {
    		return;
    	}

    	var p1 = this.queue.shift(),
    		p2 = this.queue.shift();

    	this.players[p1.id] = {
	    	'sprite': game.add.sprite(game.rnd.integerInRange(0, game.world.centerX), game.rnd.integerInRange(0, game.world.centerY), 'red'),
	    	'pair': p2.id
    	};

    	this.players[p2.id] = {
	    	'sprite': game.add.sprite(game.rnd.integerInRange(0, game.world.centerX), game.rnd.integerInRange(0, game.world.centerY), 'blue'),
	    	'pair': p1.id
    	};

    	console.log(this.players);
    };

    return PlayerManager;

});

