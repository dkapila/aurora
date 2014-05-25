"use strict";

var main = function(GameClient, Misc, MobileHacks) {
    var g_client;

    var globals = {
        debug: false,
    };

    Misc.applyUrlSettings(globals);
    MobileHacks.fixHeightHack();    

    var Game = (function () {
      function Game () {
      }

      Game.prototype.addListner = function (listner, callback) {
          g_client.addEventListener(listner, callback);
      } 

      Game.prototype.end = function () {
          var winnerBackgroundColor = data.color.toString(16);
          $('body').css("backgroundColor", "#" + winnerBackgroundColor);
          $('body').css('background-image', 'none');
          $("#outerGamePad").hide();
          $("#victoryPannel").show();      
          var sound = new Sound();
          sound.startSound("assets/horse.ogg");
      }

      Game.prototype.start = function () {
        g_client = new GameClient({
            gameId: "aurora",
        });

        this.addListner ('connect', function () {
          $("#loadingPannel").fadeOut();
          $("#gamePadWheel").fadeIn();
          console.log ("player connected");
        });

        this.addListner('winner', this.end);
      }
      return Game;
    })();

    var game = new Game();
    game.start();

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
            $("#outerGamePad").on( "vmouseup", function () {
                $('.arrowHover').each(function () {$(this).hide()});
                g_client.sendCmd('stop', { speed: 0 });
            });
        }

        GameControls.prototype.attachGameControls = function () {
            this.attachUpEvent();
            this.attachDownEvent();
            this.attachLeftEvent();
            this.attachRightEvent();
            this.attachStopEvent();
        };
        return GameControls;
    })();

    var gameControls = new GameControls();
    gameControls.attachGameControls();
};

// Start the main app logic.
requirejs(
  [ '../libs/shared/gameclient',
  '../libs/misc',
  '../libs/mobilehacks',
  ],
  main
  );