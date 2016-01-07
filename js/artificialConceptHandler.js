/**
 * Created by Petr Marek on 29.10.2015.
 * This class shows and handles clicks on buttons of question concepts.
 */

// shows all concept related elements
function showArtificialConcepts(concepts){
    showChooseConceptButtons(concepts);
    showReAskSelectedButton();
}

// shows button for choosing concepts near generated concepts
function showChooseConceptButtons(concepts) {
    for (var i = 0; i < concepts.length; i++) {
        createChooseConceptButton(concepts[i], i+1);
    }
    $('#numberOfConcepts').attr('value', concepts.length);
}

function showReAskSelectedButton(){
        reAskSelectedConcepts=$("#reAskSelectedConcepts");
        button=$('<input type="submit" value="Re-ask with only selected concepts" data-inline="true" style="float: right;"></H2>');
        reAskSelectedConcepts.append(button);
        button.button().button('refresh');
}

//creates button for showing concept
function createChooseConceptButton(concept, i) {
    var conceptButton = '<button class="ui-btn ui-mini ui-corner-all ui-icon-myapp-unchecked ui-btn-icon-left ui-btn-inline ui-nodisc-icon" id="conceptButton' + i + '" type="button">Select</button>';
    $("#conceptButtonArea" + i).append(conceptButton);
    console.log(i, concept);
    $('#conceptButtonArea' + i).on('click', function (e) {
        console.log(i, concept);
        clickActionSelect(concept, i);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });
    $("#conceptButtonArea" + i).append('<input type="hidden" name="fullLabel'+i+'" id="fullLabel'+i+'" value="">');
    $("#conceptButtonArea" + i).append('<input type="hidden" name="pageID'+i+'" id="pageID'+i+'" value="">');
    $("#conceptButtonArea" + i).parent().css("overflow","visible");
}

//click function on correct button
function clickActionSelect(concept, i) {
    if ($('#fullLabel' + i).attr('value') == "") {
        $('#fullLabel' + i).attr('value', concept.title);
        $('#pageID' + i).attr('value', concept.pageId);
        $('#conceptButton' + i).addClass("ui-icon-myapp-checked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-unchecked');
        $("#conceptButton" + i).text("Selected");
    } else {
        $('#fullLabel' + i).attr('value', "");
        $('#pageID' + i).attr('value', "");
        $('#conceptButton' + i).addClass("ui-icon-myapp-unchecked");
        $("#conceptButton" + i).removeClass('ui-icon-myapp-checked');
        $("#conceptButton" + i).text("Select");
    }
}
