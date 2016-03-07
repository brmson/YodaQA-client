/**
 * Created by Petr Marek on 09.02.2016.
 * Creates stylized lists
 */

/* Creates and returns new list with containerID in area element */
function createList(area, containerID, title, br, collapsibleSet) {
    container = $("#" + containerID);
    if (!container.length) {
        if (br == true) {
            $(area).append('<br>');
        }
        if (title != null) {
            titleElement=$('<H2>' + title +'</H2>');
            $(area).append(titleElement);
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