/**
 * Created by Petr Marek on 3.7.2015.
 */


var DEFAULT_ADDRESS = "http://qa.ailao.eu:4568/"; //default address of endpoint
var CONNECTION_ADDRESS; //address of endpoint
var DIRECTLY_SHOWED_QUESTIONS = 3; // Number of questions above drop down menu
var showFeedbackDefault = true;


var qidQueue = []; // queue of posed questions
var isShowingAnswer = false;
var gen_sources, gen_answers;  // when this number changes, re-render
var answers;
var endpoint;
var showFeedbackBool;

var numberOfShowedAnswers;

var questionText;

/* Ajax function for retrieving questions and answers */
$(function () {
    $("#ask").ajaxForm({
        success: function (response) {
            $('#search').val('');
            $('#verticalCenter').animate({marginTop: '0px'}, 'slow');
            putDialogIDToForm(JSON.parse(response).dialogID);
            window.location.href = createURL(JSON.parse(response).dialogID,null);
            setTimeout(function () {
                loadQuestion(JSON.parse(response).id, true)
            }, 500);
        }
    });

    getToAnswerJson();
    setInterval(getToAnswerJson, 3100);

    getInProgressJson();
    setInterval(getInProgressJson, 3000);

    getDialogsJson();
    setInterval(getDialogsJson, 2900);
});

/* Handles back navigation */
$(function () {
    // Bind the event.
    $(window).hashchange(hashchanged);
    // Trigger the event (useful on page load).
    hashchanged();
});

/* Url changed, redraw page */
function hashchanged() {
    //load and change endpoint
    endpoint = getParameterByName("e", window.location.href);
    changeEndpoint(endpoint);
    reloadAnswered();

    var showFeedback = getParameterByName("feedback", window.location.href);
    if (showFeedback != null)
        showFeedbackBool = showFeedback.toLowerCase() === 'true';
    else
        showFeedbackBool = showFeedbackDefault;
    var dID = getParameterByName("dID", window.location.href);
    var qID = getParameterByName("qID", window.location.href);
    // If dID is present and we are on main page, show answer
    var arr = window.location.href.split('#');
    if (dID != null && (arr[1] == "mainPage" || arr[1] == null)) {
        loadDialog(dID, true);
        $('#verticalCenter').css('margin-top', 0);
        switchToSearchAfterAnswer();
        openQuestion(arr);
    }else if(qID!=null && (arr[1]=="mainPage" || arr[1] == null)){
        loadQuestion(qID);
    }
    //if there is no dID clear show search area to center and clear results
    else {
        //if page is not loaded, don't position anything (page is loaded only during back navigation)
        if ($('[data-role=header]').height() != null) {
            $('#verticalCenter').css('opacity', 0.0);
            $('#verticalCenter').animate({opacity: '1.0'}, 100);
            $('#verticalCenter').css('margin-top', ($(window).height() / 2 - ($('#verticalCenter').outerHeight()) / 1.5));
        }
        clearResult();
        qidQueue = [];
    }
}

function openQuestion(arr) {
    var qID = getParameterByName("qID", window.location.href);
    if (qID != null && (arr[1] == "mainPage" || arr[1] == null)) {
        setTimeout(function () {
            $("#" + qID).collapsible("expand")
        }, 500);
    }
}

function switchToSearchAfterAnswer() {
    $('.searchButtons').empty();
    $('#searchBlock').css("width", "83%");
    $('#askBlock').css("width", "10%");
    $('#askBlock').css("display", "inline");
    $('#blurb').css("display", "none");
    $('#mainPage .mainHeader').removeClass("mainHeaderLone");
}

/* Centers search area if there is no answers */
$(document).on('pageshow', '#mainPage', function (e, data) {
    if (!isShowingAnswer) {
        $('#verticalCenter').animate({opacity: '1.0'}, 100);
        $('#verticalCenter').css('margin-top', ($(window).height() / 2 - ($('#verticalCenter').outerHeight()) / 1.5));
    } else {
        $('#verticalCenter').css('opacity', 1.0);
    }

    $("#search").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#ask").submit();
        }
    });
});

/* Centers search area on page resize */
$(window).resize(function () {
    if (!isShowingAnswer) {
        $('#verticalCenter').css('margin-top', ($(window).height() / 2 - ($('#verticalCenter').outerHeight()) / 1.5));
    }
});

function reloadMainPage() {
    window.location.href=createURL(null,null);
}

/* Gets parameter by name */
function getParameterByName(name, url) {
    var arr = url.split('#');
    var match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(arr[0]);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/* Clears results of answer during back navigation */
function clearResult() {
    $("#answers_area").empty();
    $("#concept_area").empty();
    $("#answerType_area").empty();
    $("#sources_area").empty();
    $('input[name="text"]').val("");
}

/* Changes endpoint for JSON and form */
function changeEndpoint(endpoint) {
    if (endpoint == null) {
        CONNECTION_ADDRESS = DEFAULT_ADDRESS;
        $("#ask").attr("action", DEFAULT_ADDRESS + "q");
        setFeedbackEndpoint("live");
    } else {
        if (endpoint == "http://qa.ailao.eu:4001/") {
            // XXX: ugly hardcoded
            $(".mainHeaderLink").html("YodaQA Movies");
            $("#blurb").html("Ask question about movies and TV series.<br>We don't have the storylines, but know the <strong>metadata</strong><br>(credits, dates, episodes, awards, ...).");
            setFeedbackEndpoint("movies");
        } else {
            $(".mainHeaderLink").html("YodaQA Custom");
            $("#blurb").html("This is an unofficial YodaQA version.");
        }
        CONNECTION_ADDRESS = endpoint;
        $("#ask").attr("action", endpoint + "q");
    }
}

function reloadAnswered() {
    getToAnswerJson();
    getInProgressJson();
    getDialogsJson();
}

/* Gets question information and shows it
 */
function loadQuestion(q) {
    isShowingAnswer = true;
    gen_sources = 0;
    gen_answers = 0;
    addNewCard(q);
    addQuestion(q, $('input[name="text"]').val());
    getQuestionJson(q);
}

function toggleFeedback() {
    showFeedbackBool = !showFeedbackBool;
    loadQuestion(getParameterByName("dID", window.location.href), true);
}

/* Creates URL with parameters */
function createURL(dID,qID) {
    var appersand = false;
    var url = "?";
    if (dID != null) {
        url += "dID=" + dID;
        appersand = true;
    }
    if (qID != null){
        if (appersand) {
            url += "&";
        }
        url += "qID=" + qID;
        appersand = true;
    }
    if (endpoint != null) {
        if (appersand) {
            url += "&";
        }
        url += "e=" + endpoint;
        appersand = true;
    }
    if (showFeedbackBool != showFeedbackDefault) {
        if (appersand) {
            url += "&";
        }
        url += "feedback=" + showFeedbackBool;
    }
    url += "#mainPage";
    return url;
}

/* Retrieve, process and display json question information. */
function getQuestionJson(qid) {
    if (CONNECTION_ADDRESS != null) {
        var parameters = "q/" + qid;
        var dID = getDialogID();
        if (dID != "" && dID != "undefined") {
            parameters += "/" + dID;
        }else{
            parameters += "/" + "-1";
        }
        $.get(CONNECTION_ADDRESS + parameters, function (r) {
            showAnswerToQuestion(r)
        });
    }
}

function getDialogJson(id) {
    if (CONNECTION_ADDRESS != null) {
        var parameters = "q/" + id;
        $.get(CONNECTION_ADDRESS + parameters, function (r) {
            showDialog(r);
        });
    }
}

function showDialog(dialogJson) {
    for (var i = 0; i < dialogJson.length; i++) {
        loadQuestion(dialogJson[i], true);
    }
}

/* Capitalize first letter */
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function putDialogIDToForm(id) {
    $("#dialogID").val(id);
}

function getDialogID(){
    return $("#dialogID").val();
}