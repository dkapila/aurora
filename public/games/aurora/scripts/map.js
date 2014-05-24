"use strict";

define(['./settings'], function (Settings) {

    var game;

    function positionExit(max) {
        if (game.rnd.frac() > 0.5 ){
            return game.rnd.integerInRange(0, Settings.MARGIN);
        } else {
            return game.rnd.integerInRange(max - Settings.MARGIN, max);
        }
    }

    var Map = function (g) {
        game = g;
    }

    Map.prototype.generateExit = function() {
        if (this.exit) return;
        this.exit = game.add.sprite(positionExit(game.world.width), positionExit(game.world.height), 'exit');
        console.log('position:', this.exit.x, this.exit.y);
    };

    return Map;

});

