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

    //getToAnswerJson(); setInterval(getToAnswerJson, 3100);
    //getInProgressJson(); setInterval(getInProgressJson, 3000);
    //getAnsweredJson(); setInterval(getAnsweredJson, 2900);
});

function loadQuestion(q) {
    //$("#metadata_area").empty();
    $("#answers_area").empty();
    //$("#spinner").show();
    qid = q;
    gen_sources = 0;
    gen_answers = 0;
    getQuestionJson();
}

/* Retrieve, process and display json question information. */
function getQuestionJson() {
    $.get("http://live.ailao.eu/q/" + qid, function (r) {
        $('input[name="text"]').val(r.text); //Sets search input to question???

        //Shows summary (Answer type table)
        /*if (r.summary) {
         /* Show the question summary. */
        /*container = $("#summary");
         if (!container.length) {
         container = $('<div id="summary"></div>');
         $("#metadata_area").prepend(container);
         showSummary(container, r.summary);
         }
         }*/

        //shows sources of answer
        /*
         if (r.sources.length && gen_sources != r.gen_sources) {
         /* Show the answer sources. */
        /*container = $("#sources");
         if (!container.length) {
         container = $('<div id="sources"></div>');
         $("#metadata_area").prepend(container);
         }
         showSources(container, r.sources);
         gen_sources = r.gen_sources;
         }*/

        //shows answers
        if (r.answers && gen_answers != r.gen_answers) {
            /* Show the list of answers. */
            container = $("#answers");
            if (!container.length) {
                container = $('<ul data-role="listview" data-inset="true" id="answers"></ul>');
                $("#answers_area").prepend(container);
            }
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

/* Create a table with answers. */
function showAnswers(container, answers) {
    container.empty();
    var i = 1;
    answers.forEach(function (a) {
        // FIXME: also deal with < > &
        text = a.text.replace(/"/g, "&#34;");
        container.append('<li id=i class="answer"><a href="#answer-description">' + text + '<span class="ui-li-count">' + (a.confidence * 100).toFixed(1) + '%</span></a></li>'

            /*'<tr><td class="i">' + i + '.</td>'
             + '<td class="text" title="' + text + '">' + text + '</td>'
             + '<td class="scorebar">' + /*score_bar(a.confidence)+*//*'</td>'
             + '<td class="score">' + (a.confidence * 100).toFixed(1) + '%</td></tr>'*/);
        $("#answers").listview().listview("refresh");
        getAnswerDescription(i, answers);
        i++;
    });
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
    $("li").on("tap", function () {
        alert(this.id);
        showAnswerDetails();
    });
});
