/**
 * Created by Petr Marek on 09.02.2016.
 * Class handles cards of dialogue layout
 */

function addNewCard(questionId){
    var card=createCard(questionId);
    $("#cards").append(card);
    $("#cards").collapsibleset();

    $(".questionCard").find("a").click(function (e) {
        var collapsible=$(e.target).parent().parent();
        var id=collapsible.attr('id');
        if (id==undefined){
            collapsible=collapsible.parent();
            id=collapsible.attr('id');
        }
        var isVisible=collapsible.children(".ui-collapsible-content").attr("aria-hidden");
        if (isVisible=="true"){
            window.history.replaceState("object or string", "Title", createURL(getParameterByName("dID", window.location.href),id));
        }else{
            window.history.replaceState("object or string", "Title", createURL(getParameterByName("dID", window.location.href),null));
        }
    });
}

function createCard(questionId){
    var card=$('<div data-role="collapsible" data-collapsed="true" id="'+questionId+'" class="questionCard">' +
        '<H2><span id="cardfeedbackButtonArea'+questionId+'" class="cardFeedback"></span><div id="cardQuestion'+questionId+'"></div><br><i id="cardAnswer'+questionId+'">Thinking...</i></H2></div>');
    card.append('<div id="answers_area'+questionId+'" style="position: relative;"> </div>');
    card.append('<div id="feedback_area'+questionId+'"> </div>');
    card.append('<div id="concept_area'+questionId+'"></div>');
    card.append('<div id="answerType_area'+questionId+'"></div>');
    card.append('<div id="sources_area'+questionId+'" class="responsive"></div>');
    return card;
}

function addQuestion(questionId, text){
    $("#cardQuestion"+questionId).text(text);
}

function addAnswer(questionId, text){
    $("#cardAnswer"+questionId).text(text);
}