"use strict";

var main = function(GameServer, GameSupport, Misc) {
  // You can set these from the URL with
  // http://path/gameview.html?settings={name:value,name:value}
  var globals = {
    port: 8080,
    haveServer: true,
    debug: false,
};

Misc.applyUrlSettings(globals);

var server;
if (globals.haveServer) {
    server = new GameServer({
        gameId: "aurora",
    });

    server.addEventListener('playerconnect', createPlayer);
}

GameSupport.init(server, globals);

function createPlayer (netPlayer, name) {
    console.log('created player');
}

var game = new Phaser.Game(1280, 600, Phaser.AUTO, '', { preload: preload, create: create });

function preload () {

    game.load.image('logo', 'assets/img/phaser.png');
}

function create () {

    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);
}

var mainloop = function() {

};

GameSupport.run(globals, mainloop);

};

// Start the main app logic.
requirejs([
    '../libs/shared/gameserver',
    '../libs/gamesupport',
    '../libs/misc'
], main);