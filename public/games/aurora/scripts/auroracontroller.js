"use strict";

var main = function(GameClient, Misc, MobileHacks) {
  var g_client;

  var globals = {
    debug: false,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  function $(id) {
    return document.getElementById(id);
  }

  g_client = new GameClient({
    gameId: "aurora",
  });

  g_client.addEventListener('connect', function() {
      console.log('Player connected!');
  });

  // Insert your controller specific code here.
  console.log("INIT CONTROLLER");

};

// Start the main app logic.
requirejs(
  [ '../libs/shared/gameclient',
    '../libs/misc',
    '../libs/mobilehacks',
  ],
  main
);