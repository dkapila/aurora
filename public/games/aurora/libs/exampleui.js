"use strict";

define([
    './shared/io',
    './misc'
  ], function(IO, Misc) {

  var $ = function(id) {
    return document.getElementById(id);
  };

  var setupStandardControllerUI = function(client, options) {
    var menu = $("hft-menu");
    var settings = $("hft-settings");
    var disconnected = $("hft-disconnected");

    menu.addEventListener('click', function() {
      settings.style.display = "block";
    }, false);

    // This is not currently needed. The idea
    // was to show something else like "connecting"
    // until the user connected but that's mostly
    // pointless.
    client.addEventListener('connect', function() {
      disconnected.style.display = "none";
      if (options.connectFn) {
        options.connectFn();
      }
    });

    client.addEventListener('disconnect', function() {
      disconnected.style.display = "block";
      if (options.disconnectFn) {
        options.disconnectFn();
      }

      //
      var checkForGame = function() {
        IO.sendJSON(window.location.href, {cmd: 'listRunningGames'}, function (obj, exception) {
          if (exception) {
            // the server is down. Try again?. I'm not sure what to do here. Currently the display
            // will say "restart"/"main menu" but neither have a point if the server is down.
            // Maybe there should be no options?
            setTimeout(checkForGame, 1000);
            return;
          }

          // Is the game running
          for (var ii = 0; ii < obj.length; ++ii) {
            var game = obj[ii];
            if (game.gameId == client.getGameId()) {
              // Yes! Reload
              window.location.reload();
              return;
            }
          }

          // Are any games running? If 1 game, go to it.
          if (obj.length == 1 && obj[0].controllerUrl) {
            window.location.href = obj[0].controllerUrl;
            return;
          }
          // If 2+ games, go to the menu.
          if (obj.length > 1) {
            // Go to main menu
            window.location.href = "/";
            return;
          }

          // Note: If we knew the path each game and there was only 1 game running
          // we could jump directly to that game. Right now gameIds don't correspond
          // to their URL.

          setTimeout(checkForGame, 1000);
        });
      };

      // Give the game a moment to restart and connect to the relayserver
      setTimeout(checkForGame, 1000);
    });

    if (options.debug) {
      statusNode = document.createTextNode("");
      $("hft-status").appendChild(statusNode);
      var debugCSS = Misc.findCSSStyleRule("#hft-debug");
      debugCSS.style.display = "block";
    }
  };

  return {
    setupStandardControllerUI: setupStandardControllerUI,
  };
});



