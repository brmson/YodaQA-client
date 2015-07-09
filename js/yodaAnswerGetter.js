/**
 * Created by Petr Marek on 3.7.2015.
 */

var qid;  // id of the last posed question
var gen_sources, gen_answers;  // when this number changes, re-render
var answers;

$(function () {
    $("#ask").ajaxForm({
        success: function (response) {
            setTimeout(function () {
                loadQuestion(response)
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


/* Gets question information and shows it */
function loadQuestion(q) {
    //$("#metadata_area").empty();
    $("#answers_area").empty();
    //$("#spinner").show();
    qid = q;
    gen_sources = 0;
    gen_answers = 0;
    getQuestionJson();
}

/* Gets and shows answered questions in list */
function getAnsweredJson() {
    $.get("http://live.ailao.eu/q/?answered", function (r) {
        showQuestionList($("#answered_area"), "answered", "Answered questions", r);
    });
}

/* Gets and shows answers in progress in list */
function getInProgressJson() {
    $.get("http://live.ailao.eu/q/?inProgress", function (r) {
        showQuestionList($("#inProgress_area"), "inProgress", "In progress", r);
    });
}

/* Gets and shows answers in processing in list*/
function getToAnswerJson() {
    $.get("http://live.ailao.eu/q/?toAnswer", function (r) {
        showQuestionList($("#toAnswer_area"), "toAnswer", "Question queue", r);
    });
}

/* Create a titled listing of questions. */
function showQuestionList(area, listContainerID, title, list) {
    area.empty();
    if (list.length != 0) {
        area.append('<br>');
        area.append('<h2>' + title + '</h2>');
    }
    var listContainer = createList(area, listContainerID);
    list.forEach(function (q) {
        listContainer.append('<li><a href="javascript:showAnsweredQuestion(' + q.id + ')">' + q.text + '</a></li>');
    });
    $("#" + listContainerID).listview().listview("refresh");
}

/* Shows answers to selected questions and jumps to main page */
function showAnsweredQuestion(qId){
    loadQuestion(qId);
    window.location.href = "#mainPage";
}

/* Retrieve, process and display json question information. */
function getQuestionJson() {
    $.get("http://live.ailao.eu/q/" + qid, function (r) {
        $('input[name="text"]').val(r.text);

        //shows answers
        if (r.answers && gen_answers != r.gen_answers) {
            var container = createList("#answers_area", "answers");
            showAnswers(container, r.answers);
            gen_answers = r.gen_answers;
        }

        if (r.finished) {
            //$("#spinner").hide();
        } else {
            // keep watching
            setTimeout(getQuestionJson, 500);
        }
    });
}

/* Creates and returns new list with containerID in area element*/
function createList(area, containerID) {
    container = $("#" + containerID);
    if (!container.length) {
        container = $('<ul data-role="listview" data-inset="true" id="' + containerID + '"></ul>');
        $(area).append(container);
    }
    return container;
}


/* Create a table with answers. */
function showAnswers(container, answers) {
    container.empty();
    var i = 1;
    answers.forEach(function (a) {
        // FIXME: also deal with < > &
        text = a.text.replace(/"/g, "&#34;");
        container.append('<li id=' + i + ' class="answer"><a href="#answer-description" class="answer">' + text +
            '<span class="ui-li-count" style="color: '+score_color(a.confidence)+';">' +
            (a.confidence * 100).toFixed(1) + '%</span></a></li>');
        $("#answers").listview().listview("refresh");
        i++;
    });
}

/* Returns color for score */
function score_color(score) {
    var green = Math.round(200 * score + 25);
    var red = Math.round(200 * (1-score) + 25);
    return 'rgb('+red+','+green+',0)';
}

function showAnswerDetails() {
    showAnswerInDetails();
    showSummaryInDetails();
    showSourcesInDetails();
}

function showAnswerInDetails() {
    var answerContainer = $("#answer");
    answerContainer.empty();
    answerContainer.append("<H1>Answer</H1>");
}

function showSummaryInDetails() {
    var summaryContainer = $("#summary");
    summaryContainer.empty();
    summaryContainer.append("<H2>Summary</H2>");
}

function showSourcesInDetails() {
    var sourcesContainer = $("#sources");
    sourcesContainer.empty();
    sourcesContainer.append("<H2>Sources</H2>")
}

$(document).on("pagecreate", "#mainPage", function () {
    $(".answer").on("tap", function () {
        alert("It works");
        /*alert(this.id);
         showAnswerDetails();*/
    });
});
