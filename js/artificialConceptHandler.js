/**
 * Created by Petr Marek on 29.10.2015.
 */

var conceptButtons;

var SELECTED = true;
var NONSELECTED = false;

//click on add more artificial concept button
$(document).on('click', '#moreConceptButton', function (e) {
    var numberOfArtificialConcepts=$("#numberOfConcepts").val();
    numberOfArtificialConcepts++;
    addInputForArtificialConcepts(numberOfArtificialConcepts);
    if (numberOfArtificialConcepts==2){
        showEraseArtificialConceptButton()
    }
    $("#numberOfConcepts").val(numberOfArtificialConcepts);
});

//click on erase last artificial concept button
$(document).on('click', '#lessConceptButton', function (e) {
    var numberOfArtificialConcepts=$("#numberOfConcepts").val();
    if (numberOfArtificialConcepts>1){
        erraseLastInputForArtificialConcepts(numberOfArtificialConcepts);
        numberOfArtificialConcepts--;
        $("#numberOfConcepts").val(numberOfArtificialConcepts);
        if (numberOfArtificialConcepts==1){
            hideEraseArtificialConceptButton();
        }
    }

});

function addInputForArtificialConcepts(numberOfArtificialConcepts){
    var container = $("#artificialConceptsBlock");
    var toAppend='<input type="text" name="fullLabel'+numberOfArtificialConcepts+'" id="fullLabel'+numberOfArtificialConcepts+'" ' +
        'placeholder="Concept Label" > ' +
        '<input type="number" name="pageID'+numberOfArtificialConcepts+'" id="pageID'+numberOfArtificialConcepts+'" placeholder="Page id">'
    container.append(toAppend);
    $("#fullLabel"+numberOfArtificialConcepts).textinput();
    $("#pageID"+numberOfArtificialConcepts).textinput();
}

function erraseLastInputForArtificialConcepts(numberOfArtificialConcepts){
    $("#fullLabel"+numberOfArtificialConcepts).remove();
    $("#pageID"+numberOfArtificialConcepts).remove();
}

function showEraseArtificialConceptButton(){
    var container = $("#artificialConceptButtonBlock");
    var toPrepend='<input type="button" name="lessConceptButton" id="lessConceptButton" value="Erase concept">'
    container.prepend(toPrepend);
    $("#lessConceptButton").button();
}

function hideEraseArtificialConceptButton(){
    $("#lessConceptButton").remove();
}

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

    var conceptButton = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-unchecked ui-btn-icon-left ui-btn-inline ui-nodisc-icon" id="conceptButton' + i + '">Selected</button>';
    $("#conceptButtonArea" + i).append(conceptButton);
    $('#conceptButtonArea' + i).on('click', function (e) {
        clickActionCorrect(i);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    });
    $("#conceptButtonArea" + i).parent().css("overflow","visible");
}

//click function on correct button
function clickActionCorrect(i) {
    if (conceptButtons[i] == NONSELECTED) {
        conceptButtons[i] = SELECTED;
        $('#conceptButton' + i).addClass("ui-icon-myapp-checked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-unchecked');
    } else {
        conceptButtons[i] = NONSELECTED;
        $('#conceptButton' + i).addClass("ui-icon-myapp-unchecked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-checked');
    }
}
