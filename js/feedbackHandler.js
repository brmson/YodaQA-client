/**
 * Created by Petr Marek on 21.7.2015.
 */

var feedback_endpoints = {
    'movies': {
        'BASE_URL': 'https://docs.google.com/forms/d/1Vra6SgNnso6Nn45adZNd0mVWtTMe5_W4QABhlYxfP8I/formResponse?',
        'FIELDS_IDS': ["entry.557679011", "entry.668964305", "entry.315539511", "entry.807998585", "entry.1331990072",
            "entry.540581579", "entry.799866241", "entry.1492550795", "entry.1983407746"],
        'SUBMIT_REF': '&submit=Submit',
        'FORM_URL': 'https://docs.google.com/spreadsheets/d/1FELqTPH6EUws5l_qR14igg1aomsKJ8V7iQEKJ5VEefM/edit?usp=sharing'
    },
    'live': {
        'BASE_URL': 'https://docs.google.com/forms/d/1_BYRxEZlej9gDgkUsXFw_IcdYvytSYyT1KZTHVi7kQ4/formResponse?',
        'FIELDS_IDS': ["entry.2044281262", "entry.13984642", "entry.728405979", "entry.1756526559", "entry.1872170637",
            "entry.1059431403", "entry.1228282374", "entry.17475393", "entry.2052512670"],
        'SUBMIT_REF': '&submit=Submit',
        'FORM_URL': 'https://docs.google.com/spreadsheets/d/16ynWvmgh3S5byEzgizDp53K9pN7jLoORgauFnHpnzMk/edit'
    }
};

var CORRECT_A = true;
var INCORRECT_A = false;


var correctAnswerFieldNumber = new Object();

var feedbackButtons=[];


var feedback_endpoint = feedback_endpoints['live'];
function setFeedbackEndpoint(name) {
    feedback_endpoint = feedback_endpoints[name];
}


$(document).on('pageshow', '#mainPage', function (e, data) {
    if (localStorage.getItem("previousQuestionActive") == "true") {
        $('#search').val(localStorage.getItem("previousQuestion"));
        $('#search').focus();
        localStorage.setItem("previousQuestionActive", "false");
    }
});

//click on submit button
$(document).on('click', '.form-submit', function () {
    var questionId = event.target.id;
    var email = $('#email' + questionId).val();
    var previousQuestion = $('#search').val();
    if (supports_html5_storage()) {
        localStorage.setItem("email", email);
    }
    if (supports_html5_storage()) {
        localStorage.setItem("previousQuestion", previousQuestion);
        localStorage.setItem("previousQuestionActive", "true");
    }
    sendAndReload(email,questionId);
});

//click on more correct button
$(document).on('click', '.moreCorrectAnswers', function () {
    var questionID = event.target.id;
    var toAppend = $('<label for="ea' + (correctAnswerFieldNumber[questionID] + 1) + '_' + questionID + '" id="eaLabel' + (correctAnswerFieldNumber[questionID] + 1) + '">Correct answer:</label><input id="ea' +
        (correctAnswerFieldNumber[questionID] + 1) + '_' + questionID + '" placeholder="Correct answer" name="ea' + (correctAnswerFieldNumber[questionID] + 1) + '">');
    $("#ea" + correctAnswerFieldNumber[questionID] + "_" + questionID).parent().after(toAppend);
    $('#ea' + (correctAnswerFieldNumber[questionID] + 1) + "_" + questionID).textinput();
    $("#moreCorrectAnswerContainer" + questionID).css("position", "relative");
    $("#moreCorrectAnswerContainer" + questionID).css("top", 37 * correctAnswerFieldNumber[questionID]);
    correctAnswerFieldNumber[questionID] = correctAnswerFieldNumber[questionID] + 1;
});

//send if answer was correct
function sendAndReload(email,questionID) {
    var question = $('#cardQuestion'+questionID).text();
    var ea = getCorrectAnswers(questionID);
    ea = addFeedbackFromInputFields(ea,questionID);
    if (ea[0] != "") {
        sendFeedbackAndReload(email, question, ea[0], ea[1], ea[2], ea[3], ea[4], ea[5], ea[6]);
        hideFeedback(questionID);
    } else {
        alert("Mark correct answers please.")
    }
}

function addFeedbackFromInputFields(ea,questionID) {
    var inputFieldPosition = 1;
    for (var i = 0; i < ea.length; i++) {
        if (ea[i] == null || ea[i] == "") {
            for (inputFieldPosition; ; inputFieldPosition++) {
                if ($("#ea" + inputFieldPosition+"_"+questionID).length) {
                    if ($("#ea" + inputFieldPosition+"_"+questionID).val() != "") {
                        ea[i] = $("#ea" + inputFieldPosition+"_"+questionID).val();
                        inputFieldPosition++;
                        break;
                    } else {
                        continue;
                    }
                }
                break;
            }
        }
        if (i == 6 && ea[i] != "") {
            for (inputFieldPosition; ; inputFieldPosition++) {
                if ($("#ea" + inputFieldPosition+"_"+questionID).length) {
                    if ($("#ea" + inputFieldPosition+"_"+questionID).val() != "") {
                        ea[i] += "|" + $("#ea" + inputFieldPosition+"_"+questionID).val();
                    } else {
                        continue;
                    }
                } else {
                    break;
                }
            }
        }
    }
    return ea;
}


//checks if browser supports html5 storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

//sends feedback to google form
function sendFeedbackAndReload(email, question, ea1, ea2, ea3, ea4, ea5, ea6, mca) {
    var FIELDS_IDS = feedback_endpoint['FIELDS_IDS'];
    var LEmail = FIELDS_IDS[0];
    var LQuestion = FIELDS_IDS[1];
    var LEa = [];
    LEa[0] = FIELDS_IDS[2];
    LEa[1] = FIELDS_IDS[3];
    LEa[2] = FIELDS_IDS[4];
    LEa[3] = FIELDS_IDS[5];
    LEa[4] = FIELDS_IDS[6];
    LEa[5] = FIELDS_IDS[7];

    var LMca = FIELDS_IDS[8];

    var VEmail = encodeURIComponent(email);
    var VQuestion = encodeURIComponent(question);
    var VEa = [];
    VEa[0] = encodeURIComponent(ea1);
    VEa[1] = encodeURIComponent(ea2);
    VEa[2] = encodeURIComponent(ea3);
    VEa[3] = encodeURIComponent(ea4);
    VEa[4] = encodeURIComponent(ea5);
    VEa[5] = encodeURIComponent(ea6);

    var Vmca = encodeURIComponent(mca);

    var submitURL = (feedback_endpoint['BASE_URL'] +
    LEmail + "=" + VEmail + "&" +
    LQuestion + "=" + VQuestion + "&" +
    LEa[0] + "=" + VEa[0] + "&" +
    LEa[1] + "=" + VEa[1] + "&" +
    LEa[2] + "=" + VEa[2] + "&" +
    LEa[3] + "=" + VEa[3] + "&" +
    LEa[4] + "=" + VEa[4] + "&" +
    LEa[5] + "=" + VEa[5] + "&" +
    LMca + "=" + Vmca +
    feedback_endpoint['SUBMIT_REF']);

    $.post(submitURL).always(function () {
     window.location.href = createURL(null);
     });
}

//restores feedback to default state
function showFeedback(numberOfAnswers, questionID) {
    correctAnswerFieldNumber[questionID] = 1;
    $('#feedback_area' + questionID).append(createFeedbackForm(questionID)).trigger("create");
    showAnswerFeedbackButton(numberOfAnswers, questionID);
    $('#email'+questionID).parent().css("width", "82%");
    $('#email'+questionID).val(localStorage.getItem("email"));
}

function hideFeedback(questionID){
    $('#feedback_area' + questionID).empty();
    var thank=$('<H1 style="text-align: center;">Thank you!</H1>')
    $('#feedback_area' + questionID).append(thank);
    for(var i=1;i<=feedbackButtons[questionID].length;i++){
        $('#feedbackButtonArea'+i+'_'+questionID).empty();
    }
}

function createFeedbackForm(questionID) {
    return $(
        '<div class="ui-grid-a" style="margin-bottom: -20px;">' +
        '    <div class="ui-block-a" style="width:79%">' +
        '       <div class="ui-field-contain" id="correctAnswersField">' +
        '           <label for="ea1_' + questionID + '">Correct answer:</label>' +
        '           <input id="ea1_' + questionID + '" placeholder="Correct answer" name="ea1">' +
        '       </div>' +
        '    </div>' +
        '    <div class="ui-block-b" style="width:21%" id="moreCorrectAnswerContainer' + questionID + '">' +
        '       <input type="button" value="Add missing answer" name="moreCorrectAnswers" class="moreCorrectAnswers" id="' + questionID + '" data-inline="true">' +
        '    </div>' +
        '</div>' +
        '<div class="ui-field-contain" style="border-bottom-style: none;">' +
        '    <label for="email" style="width:15.3%">Email (optional):</label>' +
        '    <input id="email' + questionID + '" placeholder="Email (optional)" name="email">' +
        '</div>' +
        '<div id="' + questionID + '" style="margin-top: -3px;width: 99.3%;">' +
        '    <input id="' + questionID + '" class="form-submit" type="button" data-icon="check" data-theme="d" value="Send feedback">' +
        '</div>');
}

//Dissables search ability
function disableSearch() {
    $('#askMeButton').parent().prop('disabled', true).addClass('ui-disabled');
    $('#search').addClass('ui-disabled');
    $('#voice').prop('disabled', true).addClass('ui-disabled');
}

//click function on correct button
function clickActionCorrect(i, questionID) {
    if (feedbackButtons[questionID][i] == INCORRECT_A) {
        feedbackButtons[questionID][i] = CORRECT_A;
        $('#feedbackButtonCorrect' + i + '_' + questionID).addClass("ui-icon-myapp-checked");
        $("#feedbackButtonCorrect" + i + '_' + questionID).removeClass('ui-icon-myapp-unchecked');
    } else {
        feedbackButtons[questionID][i] = INCORRECT_A;
        $('#feedbackButtonCorrect' + i + '_' + questionID).addClass("ui-icon-myapp-unchecked");
        $("#feedbackButtonCorrect" + i + '_' + questionID).removeClass('ui-icon-myapp-checked');
    }
}

// shows feedback buttons near answer
function showAnswerFeedbackButton(numberOfAnswers, questionID) {
    showCardFeedbackButton(questionID);
    feedbackButtons[questionID] = [];
    for (var i = 0; i < numberOfAnswers; i++) {
        createFeedbackButton(i, questionID);
    }
}

function showCardFeedbackButton(questionID){
    var feedbackButtonIncorrect = '<button class="ui-btn ui-mini ui-corner-all ui-btn-inline" id="cardFeedbackButtonIncorrect'+questionID+'" style="width: 85px;text-align: center;">Incorrect</button>';
    var feedbackButtonCorrect = '<button class="ui-btn ui-mini ui-corner-all ui-btn-inline" id="cardFeedbackButtonCorrect'+questionID+'" style="width: 85px;text-align: center;">Correct</button>';

    $("#cardfeedbackButtonArea" + questionID).append(feedbackButtonIncorrect);
    $("#cardfeedbackButtonArea" + questionID).append("<br>");
    $("#cardfeedbackButtonArea" + questionID).append(feedbackButtonCorrect);
    $("#cardfeedbackButtonArea" + questionID).parent().css("overflow", "visible");
}

//creates feedback buttons
function createFeedbackButton(i, questionID) {
    feedbackButtons[questionID][i] = INCORRECT_A;

    var feedbackButtonCorrect = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-unchecked ui-btn-icon-left ui-btn-inline ui-nodisc-icon" id="feedbackButtonCorrect' + i + '_' + questionID + '">Correct</button>';
    $("#feedbackButtonArea" + i + "_" + questionID).append(feedbackButtonCorrect);
    $('#feedbackButtonCorrect' + i + '_' + questionID).on('click', function (e) {
        clickActionCorrect(i, questionID);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    $("#feedbackButtonArea" + i + '_' + questionID).parent().css("overflow", "visible");
}


//returns array of correct answers
function getCorrectAnswers(questionID) {
    var corrects = [];
    var position = 0;
    for (var i = 0; i < feedbackButtons[questionID].length; i++) {
        if (feedbackButtons[questionID][i] == true) {
            if (position < 6) {
                corrects[position] = getAnswer(i,questionID);
                position++;
            } else {
                if (corrects[position] == null) {
                    corrects[position] = getAnswer(i,questionID);
                } else {
                    corrects[position] += "|" + getAnswer(i,questionID);
                }
            }
        }
    }
    if (position < 6) {
        for (var i = position; i < 7; i++) {
            corrects[i] = "";
        }
    }
    return corrects;
}

//gets text of answer on i position
function getAnswer(i,questionID) {
    return $('#answerText' + i+'_'+questionID).text();
}
