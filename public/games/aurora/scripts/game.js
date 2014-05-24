"use strict";

define(function() {

    var game = AUR.game;

    AUR.Game = function () {

    }

    AUR.Game.prototype.preload = function () {
        game.load.image('red', 'assets/img/red.png');
        game.load.image('blue', 'assets/img/blue.png');
    }

    AUR.Game.prototype.create = function () {
        this.red = game.add.sprite(game.world.centerX, game.world.centerY, 'red');
        this.red.anchor.setTo(0.5, 0.5);
        this.red.alpha = 0;

        game.stage.backgroundColor = 0x2d2d2d;

        //  Here we'll chain 4 different tweens together and play through them all in a loop
        var tween = game.add.tween(this.red).to({ x: 600 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
        .to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 100 }, 1000, Phaser.Easing.Linear.None)
        .loop()
        .start();


        game.add.tween(this.red).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    }

    AUR.Game.prototype.update = function () {

    }

});

