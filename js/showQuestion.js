/**
 * Created by Petr Marek on 09.02.2016.
 * Showing answer to question
 */

function showAnswerToQuestion(r) {
    questionText = r.text;
    var questionID = r.id;
    addQuestion(questionID, questionText);
    //shows answers
    if (r.answers && gen_answers != r.gen_answers) {
        var container = createList("#answers_area" + questionID, "answers" + questionID, null, false, true);
        showResultAnswers(container, r.answers, r.snippets, r.sources, r.finished, questionID);
        if (r.gen_answers==0){
            addAnswer(questionID,'<img src="img/ajax-loader.gif" width="12px" height="12px"> '+"Waiting in queue");
        }
        else if (r.qen_answers==1){
            addAnswer(questionID,'<img src="img/ajax-loader.gif" width="12px" height="12px"> '+ r.gen_answers + " answer considered");
        }else{
        addAnswer(questionID,'<img src="img/ajax-loader.gif" width="12px" height="12px"> '+ r.gen_answers + " answers considered");}
        gen_answers = r.gen_answers;
    }

    //shows concepts and summary
    if (r.summary) {
        if (r.summary.concepts.length) {
            var container = createList("#concept_area" + questionID, "concepts" + questionID, "Concepts", true, false);
            showConcept(container, r.summary.concepts,questionID);
        } else {
            $("#concept_area" + questionID).empty();
        }
        showAnswerType(r.summary,questionID);
    }

    //shows sources
    if (!$.isEmptyObject(r.sources) && gen_sources != r.gen_sources) {
        var container = createList("#sources_area" + questionID, "questionSources" + questionID, "Answer sources", true, false);
        showSources(container, r.sources,questionID);
        gen_sources = r.gen_sources;
    }

    if (r.finished) {
        if (r.answerSentence == "" || r.answerSentence == undefined) {
            addAnswer(questionID, r.answers[0].text.replace(/"/g, "&#34;"));
        } else {
            addAnswer(questionID, r.answerSentence);
        }
        if (r.answerSentence) {
            $("#answers_area" + questionID).prepend('<div id="answersent">' + r.answerSentence + '</div>');
        }
        if (showFeedbackBool) {
            showFeedback(numberOfShowedAnswers,questionID);
        }
        $("#spinner" + questionID).hide();
        showArtificialConcepts(r.summary.concepts);
    } else {
        // keep watching
        setTimeout(getQuestionJson(r.id), 500);
    }
}

/* Create a table with answers. */
function showResultAnswers(container, answers, snippets, sources, finished, questionID) {
    container.empty();
    $("#noAnswersFound"+questionID).empty();

    //Special case, nothing has been founded
    if (answers.length == 1 && answers[0].text == "" && finished==true) {
        showNoAnswer(questionID);
    }
    //normal case
    else {
        showAnswers(container, answers, snippets, sources, finished, questionID);
    }
}

function showNoAnswer(questionID) {
    $("#answers_area" + questionID).html("<H1 id='noAnswersFound"+questionID+"'>No answers found, we are sorry.</H1>");
}

function showAnswers(container, answers, snippets, sources, showMoreAnswers, questionID) {
    var i = 1;
    answers.forEach(function (a) {
        // FIXME: also deal with < > &
        //text = a.text.replace(/"/g, "&#34;");
        if (i <= DIRECTLY_SHOWED_QUESTIONS) {
            showOneAnswer(a, i, container, snippets, sources,questionID);
        } else {
            if (showMoreAnswers) {
                showAnswersInDropDown(a, i, container, snippets, sources,questionID);
            }
        }
        i++;
    });
    numberOfShowedAnswers = i;
    if (showMoreAnswers) {
        $("#moreAnswers" + questionID).collapsibleset();
    }
    $("#answers" + questionID).collapsibleset();

    if (!$('#spinner' + questionID).length) {
        $("#answers_area" + questionID).append('<img src="img/ajax-loader.gif" id="spinner' + questionID + '" style="position: absolute;top: 50%;left:50%;transform: translate(-50%,-50%);">');
    }
}

/* Shows best answers directly */
function showOneAnswer(a, i, container, snippets, sources,questionID) {
    text = a.text.replace(/"/g, "&#34;");
    var toAppend = $('' +
        '<div data-role="collapsible" class="answer" data-iconpos="right" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" style="position:relative;">' +
        '<H2>' +
        '<span style="color: ' + score_color(a.confidence) + '; display: inline-block; width:3.5em;">' + (a.confidence * 100).toFixed(1) + '%' + '</span>' +
        '<span style="" id="feedbackButtonArea' + i + '_'+questionID+'" class="feedbackButton">' +
        '</span>' +
        '<span id="answerText' + i + '_'+questionID+'" style="white-space: normal;">' +
        text +
        '</span>' +
        score_bar(a.confidence) +
        '</H2>' +
        '<div>' + showSnippets(a, snippets, sources) + '</div>' +
        '</div>')
    container.append(toAppend);
}

/* Shows answers in drop down menu */
function showAnswersInDropDown(a, i, container, snippets, sources, questionID) {
    var dropDownList = $("#moreAnswers" + questionID);
    if (!dropDownList.length) {
        createDropDownList(container, "answersDropDownLI" + questionID, "More answers...", "moreAnswers" + questionID);
        dropDownList = $("#moreAnswers");
    }
    showOneAnswer(a, i, dropDownList, snippets, sources,questionID);
}

/* Creates base for drop down menu */
function createDropDownList(container, liID, title, divID) {
    container.append('' +
        '<div data-role="collapsible" data-iconpos="right" data-inset="true" id="' + liID + '" data-theme="c" data-content-theme="a">' +
        '   <h2>' + title + '</h2> ' +
        '   <div data-role="collapsibleset" data-iconpos="right" data-inset="false"  id="' + divID + '"> ' +
        '   </div>' +
        '</div>');
}

/* Returns color for score */
function score_color(score) {
    var hue = 120 * score;
    var saturation = 75 + 25 * score;
    var light = 25 + 30 * (1 - score);
    return 'hsl(' + hue + ', ' + saturation + '%, ' + light + '%);';
}

/* Create a fancy score bar representing confidence of an answer. */
function score_bar(score) {
    return '<hr class="scorebar" style="width:' + (score * 100) + '%; background-color:' + score_color(score) + '"> ';
}

/* Show snippets in answer collapsible */
function showSnippets(a, snippets, sources) {
    var texts = "";
    var snippetIDs = a.snippetIDs;
    var len = snippetIDs.length;
    for (var i = 0; i < len; i++) {
        var snippet = snippets[snippetIDs[i]];
        var source = sources[snippet.sourceID];
        texts += '<div style="overflow: hidden">';
        texts += createURLButton(source);
        texts += '<div style="overflow: hidden"><span style="vertical-align: middle;display: inline-block;min-height: 55px; padding-top: 10px">' +
            createPassageText(a, snippet, source) + createPropertyLabel(a, snippet) + createOrigin(source) + '</span></div>';
        texts += "</div>";
        if (i != len - 1) {
            texts += '<hr>';
        }
    }
    return texts;
}

/* Creates text of snippet */
function createPassageText(a, snipet, source) {
    var text = "";
    if (!(typeof (snipet.passageText) === "undefined")) {
        text = highlight(a.text.replace(/"/g, "&#34;"), snipet.passageText);
    }
    return text;
}

/* Creates property label of snippet */
function createPropertyLabel(a, snipet) {
    var text = "";
    if (!(typeof (snipet.propertyLabel) === "undefined")) {
        text = highlight(a.text.replace(/"/g, "&#34;"), snipet.propertyLabel);
    }
    if (!(typeof (snipet.witnessLabel) === "undefined")) {
        text += " (" + snipet.witnessLabel + ")";
    }
    return text;
}

/* Highlight word in text */
function highlight(word, text) {
    var wordForRGXP = word.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    var rgxp = new RegExp(wordForRGXP, 'g');
    var repl = '<span class="highlight">' + word + '</span>';
    return text.replace(rgxp, repl);
}

/* Creates origin of snippet */
function createOrigin(source) {
    var text = "";
    if (!(typeof (source.origin) === "undefined")) {
        text = '<i> (' + source.origin + ')</i>';
    }
    return text;
}

/* Creates url button for snippet */
function createURLButton(source) {
    var text = "";
    var image = "";
    if (!(typeof (source.URL) === "undefined")) {
        image = createButtonImage(source);
        text = '<a href="' + source.URL + '" target="_blank" class="snippetButton ui-btn ui-btn-inline ui-corner-all" style="float: left;">' +
            image +
            source.title + '</a>';
    }
    return text;
}

/* Creates image for snippet's button */
function createButtonImage(source) {
    if (!(typeof (source.type) === "undefined")) {
        var imageSource;
        var alt;
        var size;
        if (source.type == "enwiki") {
            imageSource = "img/wikipedia-w-logo.png";
            alt = "Wikipedia";
            size = 1;
        } else if (source.type == "freebase") {
            imageSource = "img/freebase_logo.png";
            alt = "Freebase";
            size = 1;
        } else if (source.type == "dbpedia") {
            imageSource = "img/dbpedia_logo.png";
            alt = "DBpedia";
            size = 1.5;
        } else if (source.type == "bing") {
            imageSource = "img/bing_logo.png";
            alt = "Bing";
            size = 1;
        } else {
            return '[' + source.type + '] '; // return at least type text if we have no icon
        }
        return '<img src="' + imageSource + '" alt="' + alt + '" class="ui-li-icon" style="max-height: ' + size + 'em; max-width: ' + size + 'em; padding-right: 7px;">'
    }
    return "";
}

/* Shows concepts on main page */
function showConcept(container, concepts, questionID) {
    container.empty();
    var i = numberOfArtificialConcepts+1;
    concepts.forEach(function (a) {
        container.append('' +
            '<li>' +
            '   <a href="http://en.wikipedia.org/?curid=' + a.pageId + '" target="_blank">' +
            '       <img src="img/wikipedia-w-logo.png" alt="Wikipedia" class="ui-li-icon">'
            + a.title +
            '   </a>' +
            '   <span style="" id="conceptButtonArea' + i+'" class="conceptButtonArea"></span>' +
            '</li>');
        i++;
    });
    $("#concepts" + questionID).listview().listview("refresh");
}

/* Shows answer type */
function showAnswerType(summary, questionID) {
    var container = $("#answerType_area"+questionID);
    container.empty();
    if (summary.lats.length) {
        container.append('<br>');
        container.append('<H2>Answer types</H2>');
        container.append('<p>' + summary.lats.join(', ').capitalizeFirstLetter() + '</p>');
    }
}

/* Create a box with answer sources. */
function showSources(container, sources, questionID) {
    container.empty();
    var map = [];
    var indexes = [];
    $.each(sources, function (sid, source) {
        if (source.origin != "document title") {
            deduplicateSources(map, indexes, source);
        }
    });
    var toAppend = "";
    indexes.forEach(function (index) {
        var source = map[index];
        var url;
        if (source.type == "enwiki") {
            url = 'http://en.wikipedia.org/?curid=' + source.pageId;
        } else {
            url = source.URL;
        }
        toAppend += '<li>' +
            '<a href="' + url + '" target="_blank">' +
            createButtonImage(source) +
            source.title + ' (' + source.origin + ')' +
            '</a>' +
            '</li>';
    });
    container.append(toAppend);
    $('#questionSources' + questionID).listview().listview("refresh");
}

/* Deduplicate sources and connects origins */
function deduplicateSources(map, indexes, source) {
    var id = source.type == "enwiki" ? source.pageId : source.URL;
    if (id in map) {
        map[id].origin += ", " + source.origin;
    } else {
        indexes.push(id);
        map[id] = JSON.parse(JSON.stringify(source)); // copy object
    }
}