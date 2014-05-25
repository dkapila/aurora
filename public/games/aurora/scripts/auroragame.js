"use strict";

var AUR = AUR || {};

requirejs([
    '../libs/shared/gameserver',
    '../libs/gamesupport',
    '../libs/misc',
    './playerManager',
    './effects',
    './settings',
    './soundManager'
], function (GameServer, GameSupport, Misc, PlayerManager, Effects, Settings, SoundManager) {

    var game = new Phaser.Game(Settings.WIDTH, Settings.HEIGHT, Phaser.AUTO, 'phaser-example', {preload: preload, create: create, update: update, render: render}),
        sound = new SoundManager(game),
        vfx = new Effects(game, sound),
        playerManager = new PlayerManager(game, vfx, sound),
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

        // audio
        game.load.audio('hit02', ['assets/sound/hit02.mp3']);
        game.load.audio('hit03', ['assets/sound/hit03.mp3']);
        game.load.audio('hit04', ['assets/sound/hit04.mp3']);
        game.load.audio('merge01', ['assets/sound/merge01.mp3']);
        game.load.audio('winning', ['assets/sound/winning.mp3']);
    }

    function create () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.image(0, 0, 'playfield');
        playerManager.createGroup();
        playerManager.createText();
        vfx.createClouds();

        sound.loadSounds('hit02', false);
        sound.loadSounds('hit03', false);
        sound.loadSounds('hit04', false);
        sound.loadSounds('merge01', false);
        sound.loadSounds('winning', true);

        var startButton = game.add.sprite(game.world.centerX, game.world.centerY, 'startButton');
        startButton.anchor.set(0.5);
        startButton.scale.set(1.5);
        startButton.inputEnabled = true;
        startButton.events.onInputUp.add(function () {
            var startTween = game.add.tween(startButton).to({ 'alpha': 0 }, 400, Phaser.Easing.Quadratic.Out, true);
            startTween.onComplete.add(function () {
                AUR.state = 'PLAY';
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