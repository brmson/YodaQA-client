/**
 * Created by Petr Marek on 09.02.2016.
 * Class handles cards of dialogue layout
 */

var numberOfCards=0;

function addNewCard(){
    numberOfCards++;
    var card=createCard();
    $("#cards").prepend(card);
    $("#cards").collapsibleset();
}

function createCard(){
    var card=$('<div data-role="collapsible" data-collapsed="true" id="'+numberOfCards+'"><H2>How old is Travolta?<br><i>38</i></H2></div>');
    card.append('<div id="answers_area'+numberOfCards+'" style="position: relative;"> </div>');
    card.append('<div id="concept_area'+numberOfCards+'"></div>');
    card.append('<div id="answerType_area'+numberOfCards+'"></div>');
    card.append('<div id="sources_area'+numberOfCards+'" class="responsive"></div>');
    return card;
}