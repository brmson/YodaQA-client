/**
 * Created by Petr Marek on 09.02.2016.
 * Handles showing of answered question, in progress questions and to answer questions in lists
 */

/* Gets and shows answered questions in list */
function getAnsweredJson() {
    if (CONNECTION_ADDRESS != null) {
        $.get(CONNECTION_ADDRESS + "q/?answered", function (r) {
            showQuestionList($("#answered_area"), "answered", "Answered questions", r);
        });
    }
}

/* Gets and shows answers in progress in list */
function getInProgressJson() {
    if (CONNECTION_ADDRESS != null) {
        $.get(CONNECTION_ADDRESS + "q/?inProgress", function (r) {
            showQuestionList($("#inProgress_area"), "inProgress", "In progress", r);
        });
    }
}

/* Gets and shows answers in processing in list */
function getToAnswerJson() {
    if (CONNECTION_ADDRESS != null) {
        $.get(CONNECTION_ADDRESS + "q/?toAnswer", function (r) {
            showQuestionList($("#toAnswer_area"), "toAnswer", "Question queue", r);
        });
    }
}

/* Create a titled listing of questions. */
function showQuestionList(area, listContainerID, title, list) {
    area.empty();
    if (list.length != 0) {
        var listContainer = createList(area, listContainerID, title, false, false);
    }
    list.forEach(function (q) {
        listContainer.append('<li><a href="javascript:showAnsweredQuestion(' + q.id + ')">' + q.text + '</a></li>');
    });
    $("#" + listContainerID).listview().listview("refresh");
}