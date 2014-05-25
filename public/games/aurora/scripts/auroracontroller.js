"use strict";

var main = function(GameClient, Misc, MobileHacks) {
    var g_client;
    var Game = (function () {
      function Game (gameControls, sound) {
        this.gameControls = gameControls;
        this.gameControls.sound = sound;
        this.speechRecognition = null;
      }

      Game.prototype.initialize = function () {
          this.gameControls.attachGameControls();
          var globals = {
              debug: false,
          };

          Misc.applyUrlSettings(globals);
          MobileHacks.fixHeightHack();        
      }

      Game.prototype.addListner = function (listner, callback) {
          g_client.addEventListener(listner, callback);
      } 

      Game.prototype.end = function (data) {
          var winnerBackgroundColor = data.color.toString(16);
          $('body').css("backgroundColor", "#" + winnerBackgroundColor);
          $('body').css('background-image', 'none');
          $("#outerGamePad").hide();
          $("#victoryPannel").show();
          sound.startSound("assets/winning.mp3", true);
      }

      Game.prototype.start = function () {
        this.initialize();

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

    var GameControls = (function () {
        function GameControls() {
        }

        GameControls.prototype.attachUpEvent = function () {
          var _self = this;
            $("#up").on( "vmousedown", function () {
                $("#upPressed").show();
                g_client.sendCmd('move', { x: 0, y: -1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");
            });
        };

        GameControls.prototype.attachDownEvent = function () {
            var _self = this;
            $("#down").on( "vmousedown", function () {
                $("#downPressed").show();
                g_client.sendCmd('move', {x: 0, y: 1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");
            });
        };

        GameControls.prototype.attachLeftEvent = function () {
            var _self = this;
            $("#left").on( "vmousedown", function () {
                $("#leftPressed").show();
                g_client.sendCmd('move', {x: -1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");
            });
        };

        GameControls.prototype.attachRightEvent = function () {
            var _self = this;
            $("#right").on( "vmousedown", function () {
                $("#rightPressed").show();
                g_client.sendCmd('move', {x: 1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");
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

    var game = new Game(new GameControls(), new Sound());
    game.start();
};

// Start the main app logic.
requirejs(
  [ '../libs/shared/gameclient',
  '../libs/misc',
  '../libs/mobilehacks',
  ],
  main
  );