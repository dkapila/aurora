"use strict";

define(['./settings', './map'], function (Settings, Map) {

    var game,
        map,
        vfx,
        sound,
        nbText;

    var spawns = [
        [100, 100],
        // [50, Settings.HEIGHT - 50],
        // [Settings.WIDTH, 50],
        [Settings.WIDTH - 100, Settings.HEIGHT - 100]
    ];

    var PlayerManager = function (g, effects, s) {
        game = g;
        vfx = effects;
        sound = s;
        map = this.map = new Map(game);
        this.queue = [];
        this.players = {};
    }

    PlayerManager.prototype.createText = function() {
        nbText = game.add.text(50, 50, 0);
        nbText.anchor.set(0.5);
        nbText.align = 'center';

        nbText.font = 'Arial';
        nbText.fontWeight = 'bold';
        nbText.fontSize = 50;
        nbText.fill = '#ffffff';
    };

    PlayerManager.prototype.add = function(netPlayer) {
        var self = this,
            id = netPlayer.id;

        this.queue.push(netPlayer);

        console.log('player connected');

        netPlayer.addEventListener('disconnect', function () {
            console.log('player disconnected');
            var index = self.queue.indexOf(netPlayer);
            if (index > -1) {
                self.queue.splice(index, 1);
            }
            netPlayer.removeAllListeners();
            var player = self.players[netPlayer.id];
            console.log(self.players);
            if (!player) return;

            player.left = true;
            if (self.players[player.pair].left) {
                console.log('REMOVING PLAYERS ' + netPlayer.id + ' AND ' + player.pair);
                // remove the 2 sprites
                player.sprite.destroy();
                self.players[player.pair].sprite.destroy();
                delete self.players[netPlayer.id];
                delete self.players[player.pair];
            }
        });

        netPlayer.addEventListener('move', function (data) {
            if (AUR.state !== 'PLAY') return;
            // console.log('move: ' + JSON.stringify(data));
            var player = self.players[netPlayer.id];
            if (!player || player.winner) return;

            var sprite = player.sprite;
            sprite.body.velocity.x = data.x * data.speed * Settings.SPEED;
            sprite.body.velocity.y = data.y * data.speed * Settings.SPEED;
            sprite.animations.play('run');
        });

        netPlayer.addEventListener('stop', function (data) {
            if (AUR.state !== 'PLAY') return;

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

        this.setupPlayer(p1, p2, tint, spawns[0]);
        this.setupPlayer(p2, p1, tint, spawns[1]);

        // console.log(this.players);
    };

    PlayerManager.prototype.createGroup = function() {
        this.sprites = game.add.group();
    };

    PlayerManager.prototype.togglePlayers = function(enable) {
        this.sprites.setAll('alpha', enable ? 1 : 0);
    };

    PlayerManager.prototype.setupPlayer = function (p1, p2, tint, pos) {
        if (!this.sprites) return;

        // var sprite = this.sprites.create(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'spritesheet', 'player0001-idle.png');
        var sprite = this.sprites.create(game.rnd.integerInRange(pos[0] - 50, pos[0] + 50), game.rnd.integerInRange(pos[1] - 50, pos[1] + 50), 'spritesheet', 'player0001-idle.png');

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

        sprite.pid = p1.id;

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.x = 0.75;
        sprite.scale.y = 0.75;

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
        var n = Object.keys(this.players).length,
            scale = Math.max(0.5, (20 - n / 2) / 20);

        this.togglePlayers(AUR.state === 'PLAY' || AUR.state === 'END');

        nbText.setText(Object.keys(this.players).length + this.queue.length);

        game.physics.arcade.collide(this.sprites, this.sprites, function (first, second) {
            var p = this.players[first.pid];
            if (p && p.pair != second.pid) sound.play('hit0' + game.rnd.integerInRange(2, 4));
        }, null, this);

        if (AUR.state != 'PLAY') return;

        for (var p in this.players) {
            var p1 = this.players[p],
                p2 = this.players[p1.pair];

            if (!p2) continue;

            if (!p1.merged && game.physics.arcade.distanceBetween(p1.sprite, p2.sprite) < Settings.MERGE_DIST) {
                p1.merged = p2.merged = true;

                sound.play('merge01');

                var merge = game.add.tween(p2.sprite);
                merge.to({ 'x': p1.sprite.x, 'y': p1.sprite.y }, 200, Phaser.Easing.Quadratic.In);

                var scale = game.add.tween(p2.sprite.scale).to({x: 1.5, y: 1.5}, 100, Phaser.Easing.Quadratic.Out);

                (function (playerToRemove, playerToMergeWith) {
                    scale.onComplete.add(function () {
                        playerToRemove.sprite.destroy();
                        playerToRemove.sprite = playerToMergeWith.sprite;
                        playerToMergeWith.sprite.scale.x = 1.2;
                        playerToMergeWith.sprite.scale.y = 1.2;
                    });
                }(p2, p1));

                merge.chain(scale);
                merge.start();

                map.generateExit();
            }

        }

        var winners = map.checkForWinners(this.players);

        if (winners.p1 || winners.p2) {
            AUR.state = 'END';
            vfx.winners(winners.p1, winners.p2);
            this.sprites.setAll('body.velocity.x', 0);
            this.sprites.setAll('body.velocity.y', 0);
        }

    };

    PlayerManager.prototype.debug = function() {
        for (var p in this.players) {
            game.debug.body(this.players[p].sprite);
        }

    };

    return PlayerManager;

});

