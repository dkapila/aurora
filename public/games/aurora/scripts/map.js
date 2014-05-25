"use strict";

define(['./settings'], function (Settings) {

    var game;
    var spots = [
        [Settings.WIDTH / 2, Settings.MARGIN],
        [Settings.WIDTH / 2, Settings.HEIGHT - Settings.MARGIN],
        [Settings.MARGIN, Settings.HEIGHT / 2],
        [Settings.WIDTH - Settings.MARGIN, Settings.HEIGHT / 2]
    ];

    var Map = function (g) {
        game = g;
    }

    Map.prototype.generateExit = function() {
        if (this.exit) return;
        var spot = game.rnd.pick(spots);
        this.exit = game.add.sprite(spot[0], spot[1], 'spritesheet', 'portal0001-idle.png');
        game.add.tween(this.exit.scale).to({ 'x': 1.5, 'y': 1.5 }, 500, Phaser.Easing.Cubic.In, true, 0, 1000, true);

        this.exit.anchor.x = 0.5;
        this.exit.anchor.y = 0.5;
    };

    Map.prototype.checkForWinners = function(players) {
        for (var p in players) {
            var p1 = players[p],
                p2 = players[p1.pair];

            if (!p1.winner && p1.merged && game.physics.arcade.distanceBetween(p1.sprite, this.exit) < Settings.WIN_DIST) {
                if (p1) {
                    p1.conn.sendCmd('winner', { color: p1.sprite.tint });
                    p1.winner = true;
                }
                if (p2) {
                    p2.conn.sendCmd('winner', { color: p2.sprite.tint });
                    p2.winner = true;
                }
                return {
                    'p1': p1,
                    'p2': p2
                };
            }
        }

        return {};
    };

    return Map;

});

