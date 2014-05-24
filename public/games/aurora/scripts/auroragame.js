"use strict";

var AUR = AUR || {};
AUR.game = new Phaser.Game(1280, 720, Phaser.AUTO);

var main = function(GameServer, GameSupport, Misc, Init) {
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

};

// Start the main app logic.
requirejs([
    '../libs/shared/gameserver',
    '../libs/gamesupport',
    '../libs/misc',
    './game',
    './init'
], main);