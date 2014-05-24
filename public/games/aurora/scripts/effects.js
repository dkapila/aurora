"use strict";

define(['./settings'], function (Settings) {

    var game,
        winnerText,
        winnerTextReflect;

    var Effects = function (g) {
        game = g;
    }

    Effects.prototype.winners = function(p1, p2) {

        // TEXT
        var offsetY = 100;
        winnerText = game.add.text(game.world.centerX, offsetY, "- WINNERS -");
        winnerText.anchor.set(0.5);
        winnerText.align = 'center';

        winnerText.font = 'Arial';
        winnerText.fontWeight = 'bold';
        winnerText.fontSize = 70;
        winnerText.fill = '#ffffff';

        winnerTextReflect = game.add.text(game.world.centerX, offsetY + 50, "- WINNERS -");

        winnerTextReflect.anchor.set(0.5);
        winnerTextReflect.align = 'center';
        winnerTextReflect.scale.y = -1;

        winnerTextReflect.font = 'Arial';
        winnerTextReflect.fontWeight = 'bold';
        winnerTextReflect.fontSize = 70;

        var grd = winnerTextReflect.context.createLinearGradient(0, 0, 0, winnerText.canvas.height);

        grd.addColorStop(0, 'rgba(255,255,255,0)');
        grd.addColorStop(1, 'rgba(255,255,255,0.38)');

        winnerTextReflect.fill = grd;

        // move winner to the middle, disable control by removing listeners
        if (!p1 && !p2) return;
        var winnerSprite = p1.sprite || p2.sprite;
        if (!winnerSprite) return;

        winnerSprite.animations.play('idle');
        winnerSprite.body.velocity.x = 0;
        winnerSprite.body.velocity.y = 0;
        game.add.tween(winnerSprite).to({ 'x': game.world.centerX, 'y': game.world.centerY }, 1000, Phaser.Easing.Cubic.Out, true, 0);
        game.add.tween(winnerSprite.scale).to({ 'x': 3, 'y': 3 }, 1000, Phaser.Easing.Cubic.In, true, 0);

    };

    return Effects;

});

