/**
 * Created by Petr Marek on 3.7.2015.
 */


var CONNECTION_ADDRESS = "http://qa.ailao.eu/"; //address of endpoint

var DIRECTLY_SHOWED_QUESTIONS = 5; // Number of questions above drop down menu


var qid;  // id of the last posed question
var gen_sources, gen_answers;  // when this number changes, re-render
var answers;
var endpoint;

/* Ajax function for retrieving questions and answers */
$(function () {
    $("#ask").ajaxForm({
        success: function (response) {
            $('#verticalCenter').animate({marginTop: '0px'}, 'slow');
            setTimeout(function () {
                loadQuestion(JSON.parse(response).id,false)
            }, 500);
        }
    });

    getToAnswerJson();
    setInterval(getToAnswerJson, 3100);

    getInProgressJson();
    setInterval(getInProgressJson, 3000);

    getAnsweredJson();
    setInterval(getAnsweredJson, 2900);
});

/* Handles back navigation */
$(function () {
    // Bind the event.
    $(window).hashchange(hashchanged);
    // Trigger the event (useful on page load).
    hashchanged();
});

/* Url changed, redraw page */
//TODO dont redraw when only qID is added during asking question
function hashchanged() {
    //load and change endpoint
    endpoint= getParameterByName("e", window.location.href);
    if (endpoint!=null){
        changeEndpoint(endpoint);
    }
    var qID = getParameterByName("qID", window.location.href);
    // If qID is present and we are on main page, show answer
    var arr = window.location.href.split('#');
    if (qID != null && (arr[1]=="mainPage" || arr[1]==null)) {
        loadQuestion(qID,false);
        $('#verticalCenter').css('margin-top', 0);
    }
    //if there is no qID clear show search area to center and clear results
    else {
        //if page is not loaded, don't position anything (page is loaded only during back navigation)
        if ($('[data-role=header]').height() != null) {
            $('#verticalCenter').css('opacity', 0.0);
            $('#verticalCenter').animate({opacity: '1.0'}, 100);
            $('#verticalCenter').css('margin-top', ($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() -
                ($('#verticalCenter').outerHeight())) / 2);
        }
        clearResult();
        qid = null;
    }
}

/* Centers search area if there is no answers */
$(document).on('pageshow', '#mainPage', function (e, data) {
    if (qid == null) {
        $('#verticalCenter').animate({opacity: '1.0'}, 100);
        $('#verticalCenter').css('margin-top', ($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() -
            ($('#verticalCenter').outerHeight())) / 2);
    } else {
        $('#verticalCenter').css('opacity', 1.0);
    }
});

/* Centers search area on page resize */
$(window).resize(function () {
    if (qid == null) {
        $('#verticalCenter').css('margin-top', ($(window).height() - $('[data-role=header]').height() - $('[data-role=footer]').height() -
            ($('#verticalCenter').outerHeight())) / 2);
    }
});

/* Gets parameter by name */
function getParameterByName(name, url) {
    var arr = url.split('#');
    var match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(arr[0]);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/* Clears results of answer during back navigation */
function clearResult() {
    $("#answers_area").empty();
    $("#concept_area").empty();
    $("#answerType_area").empty();
    $("#sources_area").empty();
    $('input[name="text"]').val("");
    //$('#verticalCenter').css('opacity', 0.0);
}

function changeEndpoint(endpoint){
    CONNECTION_ADDRESS=endpoint;
    $("#ask").attr("action",  endpoint+"q");
}

/* Gets question information and shows it
*  Reload determines if (true) page will be reloaded or (false) only url will be changed without reload
*/
function loadQuestion(q, reload) {
    $("#answers_area").empty();
    qid = q;
    gen_sources = 0;
    gen_answers = 0;
    if (reload){
        if (endpoint==null){
            window.location.href = "?qID=" + qid+"#mainPage";
        }else{
            window.location.href="?qID="+qid+"&e=" + endpoint+"#mainPage";
        }
    }else{
        if (endpoint==null){
            window.history.pushState("object or string", "Title", "?qID=" + qid+"#mainPage");
        }else{
            window.history.pushState("object or string", "Title", "?qID="+qid+"&e=" + endpoint+"#mainPage");
        }
    }


    getQuestionJson();
}

/* Gets and shows answered questions in list */
function getAnsweredJson() {
    $.get(CONNECTION_ADDRESS + "q/?answered", function (r) {
        showQuestionList($("#answered_area"), "answered", "Answered questions", r);
    });
}

/* Gets and shows answers in progress in list */
function getInProgressJson() {
    $.get(CONNECTION_ADDRESS + "q/?inProgress", function (r) {
        showQuestionList($("#inProgress_area"), "inProgress", "In progress", r);
    });
}

/* Gets and shows answers in processing in list */
function getToAnswerJson() {
    $.get(CONNECTION_ADDRESS + "q/?toAnswer", function (r) {
        showQuestionList($("#toAnswer_area"), "toAnswer", "Question queue", r);
    });
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

/* Shows answers to selected questions and jumps to main page */
function showAnsweredQuestion(qId) {
    loadQuestion(qId,true);
    $('#verticalCenter').css('margin-top', 0);
}

/* Retrieve, process and display json question information. */
function getQuestionJson() {
    $.get(CONNECTION_ADDRESS + "q/" + qid, function (r) {
        $('input[name="text"]').val(r.text);

        //shows answers
        if (r.answers && gen_answers != r.gen_answers) {
            var container = createList("#answers_area", "answers", null, false, true);
            showAnswers(container, r.answers, r.snippets, r.sources);
            gen_answers = r.gen_answers;
        }

        //shows concepts and summary
        if (r.summary) {
            if (r.summary.concepts.length) {
                var container = createList("#concept_area", "concepts", "Concepts", true, false);
                showConcept(container, r.summary.concepts);
            } else {
                $("#concept_area").empty();
            }
            showAnswerType(r.summary);
        }

        //shows sources
        if (!$.isEmptyObject(r.sources) && gen_sources != r.gen_sources) {
            var container = createList("#sources_area", "questionSources", "Answer sources", true, false);
            showSources(container, r.sources);
            gen_sources = r.gen_sources;
        }

        if (r.finished) {
            $("#spinner").hide();
        } else {
            // keep watching
            setTimeout(getQuestionJson, 500);
        }
    });
}

/* Shows answer type */
function showAnswerType(summary) {
    var container = $("#answerType_area");
    container.empty();
    if (summary.lats.length) {
        container.append('<br>');
        container.append('<H2>Answer types</H2>');
        container.append('<p>' + summary.lats.join(', ').capitalizeFirstLetter() + '</p>');
    }

}

/* Capitalize first letter */
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/* Shows concepts on main page */
function showConcept(container, concepts) {
    container.empty();
    var i = 1;
    concepts.forEach(function (a) {
        container.append('' +
            '<li>' +
            '   <a href="http://en.wikipedia.org/?curid=' + a.pageId + '" target="_blank">' +
            '       <img src="img/wikipedia-w-logo.png" alt="Wikipedia" class="ui-li-icon">'
            + a.title +
            '   </a>' +
            '</li>');
        i++;
    });
    $("#concepts").listview().listview("refresh");
}

/* Creates and returns new list with containerID in area element */
function createList(area, containerID, title, br, collapsibleSet) {
    container = $("#" + containerID);
    if (!container.length) {
        if (br == true) {
            $(area).append('<br>');
        }
        if (title != null) {
            $(area).append('<H2>' + title + '</H2>');
        }
        if (collapsibleSet) {
            container = $('<div data-role="collapsibleset" data-iconpos="right" data-inset="true" id="' + containerID + '"></div>');
        } else {
            container = $('<ul data-role="listview" data-inset="true" id="' + containerID + '"></ul>');
        }
        $(area).append(container);
    }
    return container;
}

/* Create a table with answers. */
function showAnswers(container, answers, snippets, sources) {
    container.empty();

    var i = 1;
    answers.forEach(function (a) {
        // FIXME: also deal with < > &
        //text = a.text.replace(/"/g, "&#34;");
        if (i <= DIRECTLY_SHOWED_QUESTIONS) {
            showOneAnswer(a, i, container, snippets, sources);
        } else {
            showAnswersInDropDown(a, i, container, snippets, sources);
        }
        i++;
    });

    $("#moreAnswers").collapsibleset();
    $("#answers").collapsibleset();

    if (!$('#spinner').length) {
        $("#answers_area").append('<img src="img/ajax-loader.gif" id="spinner" style="position: absolute;top: 50%;left:50%;transform: translate(-50%,-50%);">');
    }
}

/* Shows best answers directly */
function showOneAnswer(a, i, container, snippets, sources) {
    text = a.text.replace(/"/g, "&#34;");
    var toAppend = $('' +
        '<div data-role="collapsible" id="' + i + '" class="answer" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">' +
        '<H2>' +
        '<span style="color: ' + score_color(a.confidence) + '; display: inline-block; width:3.5em;">' + (a.confidence * 100).toFixed(1) + '%' + '</span>' +
        '<span>' +
        text +
        '</span>' +
        score_bar(a.confidence) +
        '</H2>' +
        '<div>' + showSnippets(a, snippets, sources) + '</div>' +
        '</div>')
    container.append(toAppend);
}

/* Show snippets in answer collapsible */
function showSnippets(a, snippets, sources) {
    var texts = "";
    var snippetIDs = a.snippetIDs;
    var len = snippetIDs.length;
    for (var i = 0; i < len; i++) {
        var snippet = snippets[snippetIDs[i]];
        var source = sources[snippet.sourceID];
        texts += createWikipediaButton(source);
        texts += createURLButton(source);
        texts += '<div style="overflow: hidden;"><span style="vertical-align: middle;display: inline-block;min-height: 55px; padding-top: 10px">'+
            createPassageText(a, snippet,source) + createPropertyLabel(a, snippet) + createOrigin(source)+'</span></div>';
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
    return text;
}

/* Creates wikipedia button for snippet*/
function createWikipediaButton(source) {
    var text = "";
    if (!(typeof (source.pageId) === "undefined")) {
        text = '<a href="http://en.wikipedia.org/?curid=' + source.pageId + '" class="snippetButton ui-btn ui-btn-inline ui-corner-all" style="float: left;">' +
            + createButtonImage(source)
            + source.title + '</a>';
    }
    return text;
}

/* Creates url button for snippet */
function createURLButton(source) {
    var text = "";
    var image="";
    if (!(typeof (source.URL) === "undefined")) {
        image=createButtonImage(source);
        text = '<a href="' + source.URL + '" class="snippetButton ui-btn ui-btn-inline ui-corner-all" style="float: left;">' +
            image+
            source.title + '</a>';
    }
    return text;
}

function createButtonImage(source) {
    if (!(typeof (source.type) === "undefined")) {
        var imageSource;
        var alt;
        var size;
        if (source.type == "enwiki") {
            imageSource="img/wikipedia-w-logo.png";
            alt="Wikipedia";
            size=1;
        } else if (source.type == "freebase") {
            imageSource="img/freebase_logo.png";
            alt="Freebase";
            size=1;
        } else if (source.type == "dbpedia") {
            imageSource="img/dbpedia_logo.png";
            alt="DBpedia";
            size=1.5;
        }else{
            return '[' + source.type + '] '; // return at least type text if we have no icon
        }
      return  '<img src="'+ imageSource +'" alt="'+alt+'" class="ui-li-icon" style="max-height: '+size+'em; max-width: '+size+'em; padding-right: 7px;">'
    }
    return "";
}

/* Creates origin of snippet */
function createOrigin(source) {
    var text = "";
    if (!(typeof (source.origin) === "undefined")) {
        text = '<i> (' + source.origin + ')</i>';
    }
    return text;
}

/* highlight word in text */
function highlight(word, text) {
    var wordForRGXP = word.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    var rgxp = new RegExp(wordForRGXP, 'g');
    var repl = '<span class="highlight">' + word + '</span>';
    return text.replace(rgxp, repl);
}

/* Shows answers in drop down menu */
function showAnswersInDropDown(a, i, container, snippets, sources) {
    var dropDownList = $("#moreAnswers");
    if (!dropDownList.length) {
        createDropDownList(container, "answersDropDownLI", "More answers...", "moreAnswers");
        dropDownList = $("#moreAnswers");
    }
    showOneAnswer(a, i, dropDownList, snippets, sources);
}

/* Creates base for drop down menu */
function createDropDownList(container, liID, title, divID) {
    container.append('' +
        '<div data-role="collapsible" data-iconpos="right" data-inset="true" id="' + liID + '" data-theme="b" data-content-theme="a">' +
        '   <h2>' + title + '</h2> ' +
        '   <div data-role="collapsibleset" data-iconpos="right" data-inset="false"  id="' + divID + '"> ' +
        '   </div>' +
        '</div>');
}

/* Create a box with answer sources. */
function showSources(container, sources) {
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
    $('#questionSources').listview().listview("refresh");
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
