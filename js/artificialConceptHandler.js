/**
 * Created by Petr Marek on 29.10.2015.
 * This class shows and handles clicks on buttons of question concepts.
 */

var conceptButtons;

var SELECTED = true;
var NONSELECTED = false;

// shows button for choosing concepts near generated concepts
function showChooseConceptButton(numberOfGeneratedConcepts) {
    conceptButtons = [];
    for (var i = 1; i <= numberOfGeneratedConcepts; i++) {
        createChooseConceptButton(i);
    }
}

//creates button for showing concept
function createChooseConceptButton(i) {
    conceptButtons[i] = NONSELECTED;

    var conceptButton = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-unchecked ui-btn-icon-left ui-btn-inline ui-nodisc-icon" id="conceptButton' + i + '">Select</button>';
    $("#conceptButtonArea" + i).append(conceptButton);
    $('#conceptButtonArea' + i).on('click', function (e) {
        clickActionSelect(i);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    $("#conceptButtonArea" + i).parent().css("overflow","visible");
}

//click function on correct button
function clickActionSelect(i) {
    if (conceptButtons[i] == NONSELECTED) {
        conceptButtons[i] = SELECTED;
        $('#conceptButton' + i).addClass("ui-icon-myapp-checked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-unchecked');
        $("#conceptButton" + i).text("Selected");
    } else {
        conceptButtons[i] = NONSELECTED;
        $('#conceptButton' + i).addClass("ui-icon-myapp-unchecked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-checked');
        $("#conceptButton" + i).text("Select");
    }
}
