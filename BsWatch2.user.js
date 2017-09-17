﻿// ==UserScript==
// @name		BsWatch - File 2
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie-genre[^\/]*$/
// @version    	1.9
// @description	Series List
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch2.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {
    //Reset last connection
    setCookie('autoplay', false, false);
    removeCookie('lastSeries');
    removeCookie('lastSeason');
    removeCookie('lastEpisode');

    cp.appendChild(makeTable());
}

function makeTable() {
    var rowObj = searchSeriesNames();

    //create the series table
    var table = document.createElement('table');
    table.setAttribute('id', 'seriesTable');
    var tbody = document.createElement('tbody');

    tbody.appendChild(createHeadRow());

    var favStar = getFavStar();

    //Create the content of the table
    for (t = 0; t < rowObj.length; t++) {
        var node = createRow((t + 1), rowObj[t], favStar.cloneNode(true));
        tbody.appendChild(node);
    }
    table.appendChild(tbody);

    return table;
}

function searchSeriesNames() {
    var genresContainer = document.getElementsByClassName('genre');
    var tableRows = [];

    for (i = 0; i < genresContainer.length; i++) {
        var genresEntry = genresContainer[i].getElementsByTagName('a');
        var genreName = genresContainer[i].getElementsByTagName('strong')[0].innerHTML;
        for (x = 0; x < genresEntry.length; x++) {
            var title = genresEntry[x].innerHTML;
            var linkTo = genresEntry[x].getAttribute('href');

            var rowObj = {
                title: title,
                linkTo: linkTo,
                genreName: genreName
            };

            tableRows[tableRows.length] = rowObj;
        }
    }

    //Sorting
    var endPref = window.location.href.split('?');
    if (endPref.length != 1) {
        if (endPref[1] == 'title') {
            tableRows.sort(function (a, b) {
                return a.title.localeCompare(b.title);
            });
        } else if (endPref[1] == 'genre') {
            tableRows.sort(function (a, b) {
                return a.genreName.localeCompare(b.genreName);
            });
        }
    } else {
        tableRows.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
    }

    return tableRows;
}

function createHeadRow() {
    var row = document.createElement('tr');
    row.setAttribute('id', 'headRow');

    var numNode = document.createElement('th');
    numNode.innerHTML = 'Nr';

    var serNode = document.createElement('th');
    serNode.innerHTML = 'Series';
    serNode.setAttribute('onclick', "window.location = 'https://bs.to/serie-genre?title'");

    var genNode = document.createElement('th');
    genNode.innerHTML = 'Genre';
    genNode.setAttribute('onclick', "window.location = 'https://bs.to/serie-genre?genre'");

    var favNode = document.createElement('th');
    favNode.innerHTML = 'Fav';

    row.appendChild(numNode);
    row.appendChild(serNode);
    row.appendChild(genNode);
    row.appendChild(favNode);

    return row;
}

//For performance
var favoritesSeries = getFavs();

function createRow(index, rowObj, favStar) {
    var tableRow = document.createElement('tr');

    //The link to the Series
    var seriesLinkTo = 'https://bs.to/' + rowObj.linkTo;

    //On click change dir
    var clickFunc = 'window.location = \'' + seriesLinkTo + '\'';
    tableRow.setAttribute("tabindex", -1);
    tableRow.setAttribute("id", index);
    tableRow.setAttribute("class", seriesLinkTo);

    //Node with the index in it
    var indexNode = document.createElement('td');
    indexNode.innerHTML = index;

    //Node with the name in it
    var nameNode = document.createElement('td');
    nameNode.innerHTML = rowObj.title;

    var genreNode = document.createElement('td');
    genreNode.innerHTML = rowObj.genreName;

    //Favorite Node set/rem-favorite
    var favNode = document.createElement('td');
    var toFav = rowObj.linkTo.split('/')[1];
    favNode.setAttribute('favId', toFav);
    favNode.appendChild(favStar);

    if (favoritesSeries.indexOf(toFav) > -1) {
        favNode.setAttribute('class', 'isFav');
    } else {
        favNode.setAttribute('class', 'noFav');
    }

    //Construct the row
    tableRow.appendChild(indexNode);
    tableRow.appendChild(nameNode);
    tableRow.appendChild(genreNode);
    tableRow.appendChild(favNode);

    return tableRow;
}

//init row-events
function afterInit() {
    $("#seriesTable tr").click(function () {
        var className = $(this).attr('class');
        if (className !== undefined) {
            window.location = className;
        }
    });

    $("#seriesTable tr").mouseover(function () {
        var searchElem = document.getElementById('search');

        //Prevent focus when search-textarea has it
        if (searchElem !== document.activeElement) {
            $(this).focus();
        }
    });

    $("#seriesTable tr td:last-child").click(function (e) {
        e.stopPropagation();

        var favName = $(this).attr('favId');
        if ($(this).attr('class') == 'isFav') {
            removeFavorite(favName, true);
            $(this).attr('class', 'noFav');
        } else {
            addFavorite(favName);
            $(this).attr('class', 'isFav');
        }
    });

    if (getCookie('seriesScroll') != undefined) {
        //Scroll to LastPos
        window.scroll(0, getCookie('seriesScroll'));
        var lastSearch = getCookie('seriesSearch');
        if (typeof lastSearch != "undefined") {
            if (lastSearch != "") {
                document.getElementById('search').value = getCookie('seriesSearch');
                searchEv();
            }
        }
    }

    setInterval(function () {
        var doc = document.documentElement;
        setCookie('seriesScroll', (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0), false);
        setCookie('seriesSearch', document.getElementById('search').value, false);
    }, 1000)
}
