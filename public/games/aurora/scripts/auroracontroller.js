"use strict";

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

        this.addListner('disconnect', function () {
            alert ("You cannot connect. Please try next game :)");
        });
      }
      return Game;
    })();

    var GameControls = (function () {
        function GameControls() {
          var currentAction = null;
        }

        GameControls.prototype.attachUpEvent = function () {
          var _self = this;
            $("#up").on( "touchstart vmousedown", function () {
                $("#upPressed").show();
                g_client.sendCmd('move', { x: 0, y: -1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.currentAction = "up";
            });
        };

        GameControls.prototype.attachDownEvent = function () {
            var _self = this;
            $("#down").on( "touchstart vmousedown", function () {
                $("#downPressed").show();
                g_client.sendCmd('move', {x: 0, y: 1, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.currentAction = "down";
            });
        };

        GameControls.prototype.attachLeftEvent = function () {
            var _self = this;
            $("#left").on( "touchstart vmousedown", function () {
                $("#leftPressed").show();
                g_client.sendCmd('move', {x: -1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.currentAction = "left";
            });
        };

        GameControls.prototype.attachRightEvent = function () {
            var _self = this;
            $("#right").on( "touchstart vmousedown", function () {
                $("#rightPressed").show();
                g_client.sendCmd('move', {x: 1, y: 0, speed: 5 });
                _self.sound.startSound("assets/button.mp3");

                _self.currentAction = "right";
            });
        };

        GameControls.prototype.attachStopEvent = function () {
            var _self = this;
            $("#outerGamePad").on( "touchend vmouseup", function (event) {
                $("#" + event.target.id + "Pressed").hide();
                if (event.target.id.slice(-7) === "Pressed") {
                    $("#" + event.target.id).hide();
                }

                if (_self.currentAction === event.target.id.slice(-7) ||
                  _self.currentAction === event.target.id) {
                  g_client.sendCmd('stop', { speed: 0 });
                  _self.currentAction = "";
                }

                if (!($("#upPressed").is(':hidden'))) {
                  g_client.sendCmd('move', { x: 0, y: -1, speed: 5 });
                  _self.currentAction = "up";
                }

                if (!($("#downPressed").is(':hidden'))) {
                  g_client.sendCmd('move', { x: 0, y: 1, speed: 5 });
                  _self.currentAction = "down";
                }

                if (!($("#leftPressed").is(':hidden'))) {
                  g_client.sendCmd('move', { x: -1, y: 0, speed: 5 });
                  _self.currentAction = "left";
                }

                if (!($("#rightPressed").is(':hidden'))) {
                  g_client.sendCmd('move', { x: 1, y: 0, speed: 5 });
                  _self.currentAction = "right";
                }
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