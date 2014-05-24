"use strict";

define(['./settings'], function (Settings) {

    var game;

    function positionExit() {
        if (game.rnd.frac() > 0.5 ){
            return game.rnd.integerInRange(0, Settings.MARGIN);
        } else {
            return game.rnd.integerInRange(game.world.width - Settings.MARGIN, game.world.width);
        }
    }

    var Map = function (g) {
        game = g;
    }

    Map.prototype.generateExit = function() {
        if (this.exit) return;
        this.exit = game.add.sprite(positionExit(), positionExit(), 'mushroom');
    };

    return Map;

});

