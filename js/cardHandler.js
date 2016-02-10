/**
 * Created by Petr Marek on 09.02.2016.
 * Class handles cards of dialogue layout
 */

function addNewCard(questionId){
    var card=createCard(questionId);
    $("#cards").prepend(card);
    $("#cards").collapsibleset();
}

function createCard(questionId){
    var card=$('<div data-role="collapsible" data-collapsed="true" id="'+questionId+'"><H2><div id="cardQuestion'+questionId+'"></div><br><i id="cardAnswer'+questionId+'">Thinking...</i></H2></div>');
    card.append('<div id="answers_area'+questionId+'" style="position: relative;"> </div>');
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