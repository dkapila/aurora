"use strict";

define(['./settings'], function (Settings) {

    var game,
        winnerText,
        emitter,
        clouds = [];

    var Effects = function (g) {
        game = g;
    }

    Effects.prototype.createClouds = function() {
        for (var i = 1; i <= 3; i++) {
            (function (n) {
                var sprite = game.add.sprite(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'spritesheet', 'cloud000' + n + '-idle.png')
                var destX = -sprite.width;
                var destY = sprite.y;
                var tween = game.add.tween(sprite).to({ 'x': destX, 'y': destY}, game.rnd.integerInRange(20000, 30000), Phaser.Easing.Linear.None, true).loop();
                tween.onComplete.add(function () {
                    sprite.x = game.world.width + sprite.width;
                });
                clouds.push(sprite);
            }(i));
        }
    };

    Effects.prototype.winners = function(p1, p2) {

        // TEXT
        var offsetY = 100;
        winnerText = game.add.text(game.world.centerX, offsetY, "WINNERS!");
        winnerText.anchor.set(0.5);
        winnerText.align = 'center';

        winnerText.font = 'Arial';
        winnerText.fontWeight = 'bold';
        winnerText.fontSize = 70;
        winnerText.fill = '#ffffff';

        // move winner to the middle, disable control by removing listeners
        if (!p1 && !p2) return;
        var winnerSprite = p1.sprite || p2.sprite;
        if (!winnerSprite) return;

        winnerSprite.animations.play('idle');
        winnerSprite.body.velocity.x = 0;
        winnerSprite.body.velocity.y = 0;
        game.add.tween(winnerSprite).to({ 'x': game.world.centerX, 'y': game.world.centerY }, 1000, Phaser.Easing.Cubic.Out, true, 1000);
        game.add.tween(winnerSprite.scale).to({ 'x': 3, 'y': 3 }, 1000, Phaser.Easing.Cubic.In, true, 1000);

    };

    Effects.prototype.update = function() {
    };

    return Effects;

});

