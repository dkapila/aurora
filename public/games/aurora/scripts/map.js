"use strict";

define(['./settings'], function (Settings) {

    var game;

    function positionExit(max) {
        if (game.rnd.frac() > 0.5 ){
            return game.rnd.integerInRange(0, Settings.MARGIN);
        } else {
            return game.rnd.integerInRange(max - Settings.MARGIN, max - 10);
        }
    }

    var Map = function (g) {
        game = g;
    }

    Map.prototype.generateExit = function() {
        if (this.exit) return;
        this.exit = game.add.sprite(positionExit(game.world.width), positionExit(game.world.height), 'exit');
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

