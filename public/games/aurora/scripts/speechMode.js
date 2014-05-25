"use strict";

define(['./settings'], function (Settings) {

    var game,
        final_transcript = '',
        two_line = /\n\n/g,
        one_line = /\n/g,
        first_char = /\S/;

    var q;

    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    function capitalize(s) {
        return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }

    var SpeechMode = function (g) {
        game = g;
        if (!('webkitSpeechRecognition' in window)) {
          alert('can not start webkitSpeechRecognition');
        } else {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
        }

        q = this.queue = [];
    }

    SpeechMode.prototype.defineListeners = function() {
        this.recognition.onstart = function() {
            console.log('recognition onstart');
        };

        this.recognition.onerror = function(event) {
            console.error(event.error);
        };

        this.recognition.onend = function() {
            console.log('onend');
        };

        this.recognition.onresult = function(event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    var res = event.results[i][0].transcript;
                    if (res !== '') {
                        q = q.concat(res.split(' ').filter(function (e) { return e.trim() !== ''; }));
                        // console.log(event.results[i][0].transcript);
                    }
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            console.log(q);
            // console.log('final_transcript: ' + linebreak(final_transcript) + ',  interim_transcript: ' + linebreak(interim_transcript));
        };

        this.recognition.lang = 'en-US';
        this.recognition.start();
    };

    return SpeechMode;

});

