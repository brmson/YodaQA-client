/**
 * Created by Petr Marek on 3.7.2015.
 */

var qid;  // id of the last posed question
var gen_sources, gen_answers;  // when this number changes, re-render

$(function() {
    $("#ask").ajaxForm({
        success: function(response) {
            setTimeout(function() { loadQuestion(response) }, 500);
        }});

    //getToAnswerJson(); setInterval(getToAnswerJson, 3100);
    //getInProgressJson(); setInterval(getInProgressJson, 3000);
    //getAnsweredJson(); setInterval(getAnsweredJson, 2900);
});

function loadQuestion(q) {
    /*$("#metadata_area").empty();
    $("#answers_area").empty();
    $("#spinner").show();*/
    qid = q;
    alert("It works!");
    gen_sources = 0;
    gen_answers = 0;
    //getQuestionJson();
}

/* Retrieve, process and display json question information. */
function getQuestionJson() {
    $.get("/q/"+qid, function(r) {
        $('input[name="text"]').val(r.text);

        if (r.summary) {
            /* Show the question summary. */
            container = $("#summary");
            if (!container.length) {
                container = $('<div id="summary"></div>');
                $("#metadata_area").prepend(container);
                showSummary(container, r.summary);
            }
        }

        if (r.sources.length && gen_sources != r.gen_sources) {
            /* Show the answer sources. */
            container = $("#sources");
            if (!container.length) {
                container = $('<div id="sources"></div>');
                $("#metadata_area").prepend(container);
            }
            showSources(container, r.sources);
            gen_sources = r.gen_sources;
        }

        if (r.answers && gen_answers != r.gen_answers) {
            /* Show the list of answers. */
            container = $("#answers");
            if (!container.length) {
                container = $('<table id="answers"></table>');
                $("#answers_area").prepend(container);
            }
            showAnswers(container, r.answers);
            gen_answers = r.gen_answers;
        }

        if (r.finished) {
            $("#spinner").hide();
        } else {
            // keep watching
            setTimeout(getQuestionJson, 500);
        }
    });
}