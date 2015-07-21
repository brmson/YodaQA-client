/**
 * Created by Petr Marek on 21.7.2015.
 */

var BASE_URL = 'https://docs.google.com/forms/d/1Vra6SgNnso6Nn45adZNd0mVWtTMe5_W4QABhlYxfP8I/formResponse?';
var FIELDS_IDS=["entry.557679011","entry.668964305","entry.315539511","entry.807998585","entry.1331990072",
    "entry.540581579","entry.799866241","entry.1492550795"];
var SUBMIT_REF = '&submit=Submit';

var correct;

//click on submit button
$(document).on('click', '#form-submit', function () {
    if (isValidEmailAddress($('#email').val())) {
        var email = $('#email').val();
        if (supports_html5_storage()) {
            localStorage.setItem("email", email);
        }
        if (correct) {
            sendWithCorrect(email);
        } else {
            sendWithIncorrect(email);
        }
    }
    else {
        alert("Wrong email address");
    }
});

//send if answer was correct
function sendWithCorrect(email) {
    var question = $('#search').val();
    var ea1 = $('#answerText1').text();
    if (ea1 != "") {
        if (question != "") {
            sendFeedback(email, question, ea1, "", "", "", "", "");
            $('#feedbackThank').css('display', "inline");
            $('#feedbackSubmit').css('display', "none");
            $('#feedbackEmail').css('display', "none");
            $('#feedbackAnswers').css('display', "none");
            $('#feedbackButtons').css('display', "none");
        } else {
            alert("Please don't delete question from search");
        }
    } else {
        alert("Something goes wrong, there is no answer");
    }
}

//send if answer was incorrect
function sendWithIncorrect(email) {
    var ea=[];
    ea[0] = $('#ea1').val();
    ea[1] = $('#ea2').val();
    ea[2] = $('#ea3').val();
    ea[3] = $('#ea4').val();
    ea[4] = $('#ea5').val();
    ea[5] = $('#ea6').val();
    var question = $('#search').val();
    if (question != "") {
        if (ea[0] == "" && ea[1] == "" && ea[2] == "" && ea[3] == "" && ea[4] == "" && ea[5] == "") {
            alert("Please fill expected answer");
        } else {
            sendFeedback(email, question, ea[0], ea[1], ea[2], ea[3], ea[4], ea[5]);
            $('#feedbackThank').css('display', "inline");
            $('#feedbackSubmit').css('display', "none");
            $('#feedbackEmail').css('display', "none");
            $('#feedbackAnswers').css('display', "none");
            $('#feedbackButtons').css('display', "none");
        }
    } else {
        alert("Please don't delete question from search");
    }
}

//click on correct button
$(document).on('click', '#correctButton', function () {
    correct = true;
    $('#feedbackSubmit').css('display', "inline");
    $('#feedbackEmail').css('display', "inline");
    $('#feedbackButtons').css('display', "none");
    if (supports_html5_storage()) {
        var email = localStorage.getItem("email");
        $('#email').val(email);
    }
});

//click on incorrect button
$(document).on('click', '#incorrectButton', function () {
    correct = false;
    $('#feedbackSubmit').css('display', "inline");
    $('#feedbackEmail').css('display', "inline");
    $('#feedbackAnswers').css('display', "inline");
    $('#feedbackButtons').css('display', "none");
    if (supports_html5_storage()) {
        var email = localStorage.getItem("email");
        $('#email').val(email);
    }
});

//checks if browser supports html5 storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

//sends feedback to google form
function sendFeedback(email, question, ea1, ea2, ea3, ea4, ea5, ea6) {
    var LEmail=FIELDS_IDS[0];
    var LQuestion=FIELDS_IDS[1];
    var LEa=[];
    LEa[0]=FIELDS_IDS[2];
    LEa[1]=FIELDS_IDS[3];
    LEa[2]=FIELDS_IDS[4];
    LEa[3]=FIELDS_IDS[5];
    LEa[4]=FIELDS_IDS[6];
    LEa[5]=FIELDS_IDS[7];

    var VEmail = encodeURIComponent(email);
    var VQuestion = encodeURIComponent(question);
    var VEa=[];
    VEa[0] = encodeURIComponent(ea1);
    VEa[1] = encodeURIComponent(ea2);
    VEa[2] = encodeURIComponent(ea3);
    VEa[3] = encodeURIComponent(ea4);
    VEa[4] = encodeURIComponent(ea5);
    VEa[5] = encodeURIComponent(ea6);

    var submitURL = (BASE_URL +
                    LEmail + "=" + VEmail + "&" +
                    LQuestion + "=" + VQuestion+ "&" +
                    LEa[0] + "=" + VEa[0]+ "&" +
                    LEa[1] + "=" + VEa[1]+ "&" +
                    LEa[2] + "=" + VEa[2]+ "&" +
                    LEa[3] + "=" + VEa[3]+ "&" +
                    LEa[4] + "=" + VEa[4]+ "&" +
                    LEa[5] + "=" + VEa[5] +
                    SUBMIT_REF);
    $.post(submitURL);
}

//check valid email address
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

//restores feedback to default state
function restoreFeedback(){
    $('#ea1').val("");
    $('#ea2').val("");
    $('#ea3').val("");
    $('#ea4').val("");
    $('#ea5').val("");
    $('#ea6').val("");
    $('#feedbackThank').css('display', "none");
    $('#feedbackButtons').css('display', "inline");
}