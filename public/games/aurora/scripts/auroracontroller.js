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

        GameControls.prototype.attachUpEvent = function () {
            $("#up").on( "vmousedown", function () {
                console.log ("up pressed");
                g_client.sendCmd('move', { direction: "up", speed: 5 });
            });
        };

        GameControls.prototype.attachDownEvent = function () {
            $("#down").on( "vmousedown", function () {
                g_client.sendCmd('move', { direction: "down", speed: 5 });
            });        
        };

        GameControls.prototype.attachLeftEvent = function () {
            $("#left").on( "vmousedown", function () {
                g_client.sendCmd('move', { direction: "left", speed: 5 });
            });  
        };

        GameControls.prototype.attachRightEvent = function () {
            $("#right").on( "vmousedown", function () {
                g_client.sendCmd('move', { direction: "right", speed: 5 });
            });   
        };

        GameControls.prototype.attachStopEvent = function () {
            $("#up, #down, #right, #left").on( "vmouseup", function () {
                console.log ("released");
                g_client.sendCmd('stop', { speed: 0 });
            });               
        }

        GameControls.prototype.start = function () {
            this.attachUpEvent();
            this.attachDownEvent();
            this.attachLeftEvent();
            this.attachRightEvent();
            this.attachStopEvent();
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