/**
 * Created by Petr Marek on 28.7.2015.
 */
var RECOGNIZER_CONTINUOUS = false;
var RECOGNIZER_LANG = "en-US";
var RECOGNIZER_INTERIM_RESULTS = true;

var recognizer = null;

//Click on voice input button
$(document).on('click', '#voice', function (e) {
    recognize();
});

//start new voice recognition and fires search at its end
function recognize() {
    recognizer = new speechRecognition();
    recognizer.continuous = RECOGNIZER_CONTINUOUS;
    recognizer.lang = RECOGNIZER_LANG;
    recognizer.interimResults = RECOGNIZER_INTERIM_RESULTS;

    //detecting voice
    recognizer.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            $('#search').val((event.results[i])[0].transcript);
            //trigering search
            if (event.results[i].isFinal == true) {
                $("#voice").removeClass("backgroundRed");
                recognizer.stop();
                $('form#ask').submit();
            }
        }
    };

    recognizer.onend = function () {
        recognizer = null;
    };

    //start of recognition
    recognizer.start();
    $("#voice").addClass("backgroundRed");
    $('#search').val("");
}

//detect if voice input is supported by browser
function isVoiceInputSupported() {
    window.speechRecognition = window.speechRecognition || window.webkitSpeechRecognition ||
        window.mozSpeechRecognition || window.webkitSpeechRecognition;
    if (window.speechRecognition == undefined) {
        return false;
    } else {
        return true;
    }
}

//hides voice input button if it is not supported by browser
$(document).on('pageshow', '#mainPage', function (e, data) {
    if (!isVoiceInputSupported()) {
        $("#voice").remove();
        $("#search").parent().css("width", "100%");
    }
});