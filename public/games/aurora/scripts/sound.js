function Sound () {
  this.arraybuffer = null;
  if (!window.context) {
      try {
        window.context = new webkitAudioContext();
      }
      catch(e) {
      }     
  }
};

Sound.prototype.playSound = function (audioBuffer, repeat) {
    var source = null;
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.loop = repeat;
    source.start();
}

Sound.prototype.startSound = function (url, repeat) {
    var myAudioBuffer = null;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        myAudioBuffer = buffer;
          (new Sound).playSound(myAudioBuffer, repeat);
      });
    }
    request.send();
}

Sound.prototype.stopSound = function () {
    if (source) {
      source.stop();
    } 
}