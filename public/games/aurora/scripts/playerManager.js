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
            // console.log(player);
            console.log('players');
            // console.log(self.players);
        });

        netPlayer.addEventListener('move', function (data) {
            // console.log('move: ' + JSON.stringify(data));
            var player = self.players[netPlayer.id];
            if (!player) return;

            var sprite = player.sprite;
            sprite.body.velocity.x = data.x * data.speed * Settings.SPEED;
            sprite.body.velocity.y = data.y * data.speed * Settings.SPEED;
        });

        netPlayer.addEventListener('stop', function (data) {
            // console.log('stop: ' + JSON.stringify(data));
            var player = self.players[netPlayer.id];
            if (!player) return;

            var sprite = player.sprite;
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
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

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.x = 0.5;
        sprite.body.bounce.y = 0.5;
        sprite.body.minBounceVelocity = 0;
        sprite.body.linearDamping = 1;
        sprite.body.mass = 1000;
    }

    PlayerManager.prototype.update = function() {
        game.physics.arcade.collide(this.sprites);

        for (var p in this.players) {
            var p1 = this.players[p],
                p2 = this.players[p1.pair];

            if (!p1.merged && game.physics.arcade.distanceBetween(p1.sprite, p2.sprite) < Settings.DIST) {
                p1.merged = p2.merged = true;

                var merge = game.add.tween(p2.sprite);
                merge.to({ 'x': p1.sprite.x, 'y': p1.sprite.y }, 200, Phaser.Easing.Quadratic.In);

                var scale = game.add.tween(p2.sprite.scale).to({x: 2, y: 2}, 100, Phaser.Easing.Quadratic.Out);

                (function (playerToRemove, playerToMergeWith) {
                    scale.onComplete.add(function () {
                        playerToRemove.sprite.kill();
                        playerToRemove.sprite = playerToMergeWith.sprite;
                    });
                }(p2, p1));

                merge.chain(scale);
                merge.start();
            }
        }

    };

    return PlayerManager;

});

