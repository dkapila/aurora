"use strict";

define(['./settings', './map'], function (Settings, Map) {

    var game,
        map,
        vfx;

    var PlayerManager = function (g, effects) {
        game = g;
        vfx = effects;
        map = this.map = new Map(game);
        this.queue = [];
        this.players = {};

    }

    PlayerManager.prototype.add = function(netPlayer) {
        var self = this,
            id = netPlayer.id;

        this.queue.push(netPlayer);

        console.log('player connected');

        netPlayer.addEventListener('disconnect', function () {
            var index = self.queue.indexOf(netPlayer);
            if (index > -1) {
                self.queue.splice(index, 1);
            }
            netPlayer.removeAllListeners();
            var player = self.players[id];
            console.log(self.players);
            if (!player) return;

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
            if (!player || player.winner) return;

            var sprite = player.sprite;
            sprite.body.velocity.x = data.x * data.speed * Settings.SPEED;
            sprite.body.velocity.y = data.y * data.speed * Settings.SPEED;
            sprite.animations.play('run');
        });

        netPlayer.addEventListener('stop', function (data) {
            // console.log('stop: ' + JSON.stringify(data));
            var player = self.players[netPlayer.id];
            if (!player) return;

            var sprite = player.sprite;
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            sprite.animations.play('idle');
        });

        if (this.queue.length < 2) {
            return;
        }

        var p1 = this.queue.shift(),
            p2 = this.queue.shift(),
            tint = game.rnd.integerInRange(Settings.COLOR_RANGE.START, Settings.COLOR_RANGE.END);

        this.setupPlayer(p1, p2, 'player', tint);
        this.setupPlayer(p2, p1, 'player', tint);

        // console.log(this.players);
    };

    PlayerManager.prototype.createGroup = function() {
        this.sprites = game.add.group();
    };

    PlayerManager.prototype.setupPlayer = function (p1, p2, sprite, tint) {
        if (!this.sprites) return;

        var sprite = this.sprites.create(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'spritesheet', 'player0001-idle.png');

        // animation
        sprite.animations.add('idle', Phaser.Animation.generateFrameNames('player', 1, 4, '-idle.png', 4), 7, true);
        sprite.animations.add('run', Phaser.Animation.generateFrameNames('player', 1, 4, '-run.png', 4), 7, true);
        sprite.animations.play('idle');

        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;

        this.players[p1.id] = {
            'sprite': sprite,
            'pair': p2.id,
            'conn': p1
        };

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.body.setSize(46, 116 / 2, 0, 116 / 4);
        sprite.body.collideWorldBounds = true;
        sprite.body.bounce.x = 0.5;
        sprite.body.bounce.y = 0.5;
        sprite.body.minBounceVelocity = 0;
        sprite.body.linearDamping = 1;
        sprite.body.mass = 1000;
        sprite.tint = tint;
        sprite.z = 5;
    }

    PlayerManager.prototype.update = function() {
        game.physics.arcade.collide(this.sprites);

        for (var p in this.players) {
            var p1 = this.players[p],
                p2 = this.players[p1.pair];

            if (!p2) continue;

            if (!p1.merged && game.physics.arcade.distanceBetween(p1.sprite, p2.sprite) < Settings.MERGE_DIST) {
                p1.merged = p2.merged = true;

                var merge = game.add.tween(p2.sprite);
                merge.to({ 'x': p1.sprite.x, 'y': p1.sprite.y }, 200, Phaser.Easing.Quadratic.In);

                var scale = game.add.tween(p2.sprite.scale).to({x: 2, y: 2}, 100, Phaser.Easing.Quadratic.Out);

                (function (playerToRemove, playerToMergeWith) {
                    scale.onComplete.add(function () {
                        playerToRemove.sprite.kill();
                        playerToRemove.sprite = playerToMergeWith.sprite;
                        playerToMergeWith.sprite.scale.x = 1.5;
                        playerToMergeWith.sprite.scale.y = 1.5;
                    });
                }(p2, p1));

                merge.chain(scale);
                merge.start();

                map.generateExit();
            }
        }

        var winners = map.checkForWinners(this.players);

        if (winners.p1 || winners.p2) {
            vfx.winners(p1, p2);
            console.log('WINNERS!');
        }

    };

    PlayerManager.prototype.debug = function() {
        for (var p in this.players) {
            game.debug.body(this.players[p].sprite);
        }

    };

    return PlayerManager;

});

