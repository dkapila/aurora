"use strict";

var AUR = AUR || {};

requirejs([
    '../libs/shared/gameserver',
    '../libs/gamesupport',
    '../libs/misc',
    './playerManager'
], function (GameServer, GameSupport, Misc, PlayerManager) {

    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', {preload: preload, create: create, update: update}),
        playerManager = new PlayerManager(game),
        red;

    var globals = {
        port: 8080,
        haveServer: true,
        debug: false,
    };

    Misc.applyUrlSettings(globals);

    // server
    var server = new GameServer({
        gameId: "aurora",
    });

    // listeners
    server.addEventListener('playerconnect', function (netPlayer) {
        console.log('player connected');
        playerManager.add(netPlayer);
    });

    GameSupport.init(server, globals);

    function preload () {
        game.load.image('red', 'assets/img/red.png');
        game.load.image('blue', 'assets/img/blue.png');
        console.log('preload');
        console.log(game.world);
    }

    function create () {
        red = game.add.sprite(game.world.centerX, game.world.centerY, 'red');
        red.anchor.setTo(0.5, 0.5);
        red.alpha = 0;

        game.stage.backgroundColor = 0x2d2d2d;

        var tween = game.add.tween(red).to({ x: 600 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
        .to({ x: 100 }, 2000, Phaser.Easing.Linear.None)
        .to({ y: 100 }, 1000, Phaser.Easing.Linear.None)
        .loop()
        .start();

        game.add.tween(red).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

    function update () {

    }

});