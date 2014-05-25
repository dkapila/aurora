function Sound () {
  this.arraybuffer = null;
    try {
      window.context = new webkitAudioContext();
    }
    catch(e) {
    } 
};

Sound.prototype.playSound = function (audioBuffer) {
    var source = null;
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
}

Sound.prototype.startSound = function (url) {
    var myAudioBuffer = null;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        myAudioBuffer = buffer;
          (new Sound).playSound(myAudioBuffer);
      });
    }
    request.send();
}

Sound.prototype.stopSound = function () {
    if (source) {
      source.stop();
    } 
}