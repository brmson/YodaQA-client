/**
 * Created by Petr Marek on 3.7.2015.
 */


var DEFAULT_ADDRESS = "http://qa.ailao.eu/"; //default address of endpoint
var CONNECTION_ADDRESS; //address of endpoint
var DIRECTLY_SHOWED_QUESTIONS = 3; // Number of questions above drop down menu
var showFeedbackDefault = true;


var qidQueue = []; // queue of posed questions
var isShowingAnswer=false;
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
            $('#verticalCenter').animate({marginTop: '0px'}, 'slow');
            //switchToSearchAfterAnswer();
            saveUserID(JSON.parse(response).userID);
            putUserIDToForm();
            setTimeout(function () {
                loadQuestion(JSON.parse(response).id, true)
            }, 500);
        }
    });

    getToAnswerJson();
    setInterval(getToAnswerJson, 3100);

    getInProgressJson();
    setInterval(getInProgressJson, 3000);

    getAnsweredJson();
    setInterval(getAnsweredJson, 2900);
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
    var qID = getParameterByName("qID", window.location.href);
    // If qID is present and we are on main page, show answer
    var arr = window.location.href.split('#');
    if (qID != null && (arr[1] == "mainPage" || arr[1] == null)) {
        loadQuestion(qID, true);
        $('#verticalCenter').css('margin-top', 0);
        switchToSearchAfterAnswer();
    }
    //if there is no qID clear show search area to center and clear results
    else {
        //if page is not loaded, don't position anything (page is loaded only during back navigation)
        if ($('[data-role=header]').height() != null) {
            $('#verticalCenter').css('opacity', 0.0);
            $('#verticalCenter').animate({opacity: '1.0'}, 100);
            $('#verticalCenter').css('margin-top', ($(window).height()/2  - ($('#verticalCenter').outerHeight())/1.5));
        }
        clearResult();
        qidQueue=[];
    }
}

function switchToSearchAfterAnswer(){
    $('.searchButtons').empty();
    $('#searchBlock').css("width","83%");
    $('#askBlock').css("width","10%");
    $('#askBlock').css("display","inline");
    $('#blurb').css("display","none");
    $('#mainPage .mainHeader').removeClass("mainHeaderLone");
}

/* Centers search area if there is no answers */
$(document).on('pageshow', '#mainPage', function (e, data) {
    if (!isShowingAnswer) {
        $('#verticalCenter').animate({opacity: '1.0'}, 100);
        $('#verticalCenter').css('margin-top', ($(window).height()/2- ($('#verticalCenter').outerHeight())/1.5));
    } else {
        $('#verticalCenter').css('opacity', 1.0);
    }
    $('input[name="text"]').val(questionText);
    putUserIDToForm();
});

/* Centers search area on page resize */
$(window).resize(function () {
    if (!isShowingAnswer) {
        $('#verticalCenter').css('margin-top', ($(window).height()/2 - ($('#verticalCenter').outerHeight())/1.5) );
    }
});

function gotoMainPage(){
    location.reload();
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
        if (endpoint == "http://qa.ailao.eu:4000/") {
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
    getAnsweredJson();
}

/* Gets question information and shows it
 *  Reload determines if (true) page will be reloaded or (false) only url will be changed without reload
 */
function loadQuestion(q) {
    isShowingAnswer=true;
    qidQueue.push(q);
    gen_sources = 0;
    gen_answers = 0;
    addNewCard(q);
    addQuestion(q, $('input[name="text"]').val());
    getQuestionJson();
}

function toggleFeedback() {
    showFeedbackBool = !showFeedbackBool;
    loadQuestion(getParameterByName("qID", window.location.href), true);
}

/* Creates URL with parameters */
function createURL(qid) {
    var appersand = false;
    var url = "?";
    if (qid != null) {
        url += "qID=" + qid;
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
function getQuestionJson() {
    if (CONNECTION_ADDRESS != null) {
        var parameters="q/" + qidQueue[0];
        var uID=getUserID();
        if (uID!="" && uID!="undefined"){
            parameters+="/" + uID;
        }
        $.get(CONNECTION_ADDRESS + parameters, function(r){ showAnswerToQuestion (r)});
    }
}

/* Capitalize first letter */
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


function saveUserID(userID){
    var cookieName="userID";
    if (!cookieExists(cookieName)){
        setCookie(cookieName,userID,365);
    }
}

function getUserID(){
    return getCookie("userID");
}

function putUserIDToForm(){
    var uID=getUserID();
    if (uID!="" && uID!="undefined"){
        $("#userID").val(uID);
    }
}