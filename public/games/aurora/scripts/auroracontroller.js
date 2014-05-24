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

    g_client.addEventListener('winner', function (data) {
        var winnerBackgroundColor = data.color.toString(16);
        $('body').css("backgroundColor", "#" + winnerBackgroundColor);
        $('body').css('background-image', 'none');
        document.getElementById("audioControl").play();
        console.log ('You won'  + data);
    });

  // Insert your controller specific code here.
    console.log("INIT CONTROLLER");


    var GameControls = (function () {
        function GameControls() {
        }

        GameControls.prototype.attachUpEvent = function () {
            $("#up").on( "vmousedown", function () {
                $("#upPressed").show();
                g_client.sendCmd('move', { x: 0, y: -1, speed: 5 });
            });
        };

        GameControls.prototype.attachDownEvent = function () {
            $("#down").on( "vmousedown", function () {
                $("#downPressed").show();
                g_client.sendCmd('move', {x: 0, y: 1, speed: 5 });
            });
        };

        GameControls.prototype.attachLeftEvent = function () {
            $("#left").on( "vmousedown", function () {
                $("#leftPressed").show();
                g_client.sendCmd('move', {x: -1, y: 0, speed: 5 });
            });
        };

        GameControls.prototype.attachRightEvent = function () {
            $("#right").on( "vmousedown", function () {
                $("#rightPressed").show();
                g_client.sendCmd('move', {x: 1, y: 0, speed: 5 });
            });
        };

        GameControls.prototype.attachStopEvent = function () {
            $("#upPressed, #downPressed, #rightPressed, #leftPressed").on( "vmouseup", function () {
                $('.arrowHover').each(function () {$(this).hide()});
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