"use strict";

var main = function(GameClient, Misc, MobileHacks) {
    var g_client;

    var globals = {
        debug: false,
    };
    Misc.applyUrlSettings(globals);
    MobileHacks.fixHeightHack();

    g_client = new GameClient({
        gameId: "aurora",
    });

    g_client.addEventListener('connect', function() {
      console.log('Player connected!');
    });

    g_client.sendCmd('move', { x: 10, y: 20 });

  // Insert your controller specific code here.
    console.log("INIT CONTROLLER");


    var GameControls = (function () {
        function GameControls() {
        }

        GameControls.prototype.attachUpClick = function () {
            $("#up").click (function () {
                console.log ("up clicked");
                g_client.sendCmd('move', { direction: "up", speed: 5 });
            });
        };

        GameControls.prototype.attachDownClick = function () {
            $("#down").click (function () {
                g_client.sendCmd('move', { direction: "down", speed: 5 });
            });        
        };

        GameControls.prototype.attachLeftClick = function () {
            $("#left").click (function () {
                g_client.sendCmd('move', { direction: "left", speed: 5 });
            });  
        };

        GameControls.prototype.attachRightClick = function () {
            $("#right").click (function () {
                g_client.sendCmd('move', { direction: "right", speed: 5 });
            });   
        };

        GameControls.prototype.start = function () {
            this.attachUpClick();
            this.attachDownClick();
            this.attachLeftClick();
            this.attachRightClick();
        };
        return GameControls;
    })();

    var gameControls = new GameControls();
    gameControls.start();
};

// Start the main app logic.
requirejs(
  [ '../libs/shared/gameclient',
  '../libs/misc',
  '../libs/mobilehacks',
  ],
  main
  );