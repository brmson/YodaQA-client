/**
 * Created by Petr Marek on 29.10.2015.
 */

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
