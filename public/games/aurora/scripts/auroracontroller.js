"use strict";

//disable right click
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}


var main = function(GameClient, Misc, MobileHacks) {
    var g_client;
    var Game = (function () {
      function Game (gameControls, sound) {
        this.sound = sound;
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
          var victoryPannel = document.getElementById("victoryPannel");
          victoryPannel.style.display = "flex";
          new Sound().startSound("assets/winning.mp3", true);
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
          var lastButton = null;
        }

        GameControls.prototype.attachUpEvent = function () {
          var _self = this;
            $("#up").on( "touchstart vmousedown", function () {
                $("#upPressed").show();
                g_client.sendCmd('move', { x: 0, y: -1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.lastButton = $("#up");
            });
        };

        GameControls.prototype.attachDownEvent = function () {
            var _self = this;
            $("#down").on( "touchstart vmousedown", function () {
                $("#downPressed").show();
                g_client.sendCmd('move', {x: 0, y: 1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.lastButton = $("#down");
            });
        };

        GameControls.prototype.attachLeftEvent = function () {
            var _self = this;
            $("#left").on( "touchstart vmousedown", function () {
                $("#leftPressed").show();
                g_client.sendCmd('move', {x: -1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.lastButton = $("#left");
            });
        };

        GameControls.prototype.attachRightEvent = function () {
            var _self = this;
            $("#right").on( "touchstart vmousedown", function () {
                $("#rightPressed").show();
                g_client.sendCmd('move', {x: 1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.lastButton = $("#right");
            });
        };

        GameControls.prototype.attachStopEvent = function () {
          var _self = this;
            $("#outerGamePad").on( "vmouseup", function (event) {

                $("#outerGamePad #" + event.target.id).hide();

                if (_self.lastButton) {
                  if (event.target.id === _self.lastButton.attr('id') || 
                      event.target.id === _self.lastButton.attr('id') + "Pressed") {
                    g_client.sendCmd('stop', { speed: 0 });
                  }
                }
                //$('.arrowHover').each(function () {$(this).hide()});

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