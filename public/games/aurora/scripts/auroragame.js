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
        game.load.image('red', 'assets/img/red.png');
        game.load.image('blue', 'assets/img/blue.png');
    }

    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        playerManager.createGroup();
        console.log(game.physics.arcade);
    }

    function update () {
        playerManager.update();
    }

});