"use strict";

var AUR = AUR || {};

requirejs([
    '../libs/shared/gameserver',
    '../libs/gamesupport',
    '../libs/misc',
    './playerManager',
    './effects',
    './settings'
], function (GameServer, GameSupport, Misc, PlayerManager, Effects, Settings) {

    var game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, 'phaser-example', {preload: preload, create: create, update: update, render: render}),
        vfx = new Effects(game),
        playerManager = new PlayerManager(game, vfx),
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
        playerManager.add(netPlayer);
    });

    GameSupport.init(server, globals);

    function preload () {
        game.stage.disableVisibilityChange = true;

        game.load.image('playfield', 'assets/img/playfield.png');
        game.load.image('white', 'assets/img/white.png');
        game.load.image('red', 'assets/img/red.png');
        game.load.image('blue', 'assets/img/blue.png');
        game.load.image('exit', 'assets/img/exit.png');
        game.load.image('startButton', 'assets/img/guiStartButton.png');
        game.load.atlas('spritesheet', 'assets/img/spritesheet.png', 'assets/img/spritesheet.json');
    }

    function create () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.image(0, 0, 'playfield');
        playerManager.createGroup();
        playerManager.createText();
        vfx.createClouds();

        var startButton = game.add.sprite(game.world.centerX, game.world.centerY, 'startButton');
        startButton.anchor.set(0.5);
        startButton.scale.set(1.5);
        startButton.inputEnabled = true;
        startButton.events.onInputUp.add(function () {
            var startTween = game.add.tween(startButton).to({ 'alpha': 0 }, 400, Phaser.Easing.Quadratic.Out, true);
            startTween.onComplete.add(function () {
                AUR.state = 'PLAY';
                game.scale.startFullScreen();
            });
        });


    }

    function update () {
        playerManager.update();
    }

    function render() {
        // playerManager.debug();
    }

});