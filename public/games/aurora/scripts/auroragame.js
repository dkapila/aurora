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
        playerManager.add(netPlayer);
    });

    GameSupport.init(server, globals);

    function preload () {
        game.load.image('playfield', 'assets/img/playfield.png');
        game.load.image('red', 'assets/img/red.png');
        game.load.image('blue', 'assets/img/blue.png');
        game.load.image('exit', 'assets/img/exit.png');
    }

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.image(0, 0, 'playfield');
        playerManager.createGroup();

    }

    function update () {
        playerManager.update();
    }

});