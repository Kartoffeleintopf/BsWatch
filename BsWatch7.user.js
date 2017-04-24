﻿// ==UserScript==
// @name        BsWatch - File 7
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/openload\.co\/embed\/.+$/
// @version    	1
// @description	OpenLoad Direct-Link
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch7.user.js
// ==/UserScript==

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:999';
blackP.setAttribute('style', blackPStyle);
blackP.setAttribute('id', 'blackP');

//Attach blackPage
document.documentElement.appendChild(blackP);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

//When document loaded
$(document).ready(function () {
	//Get the api ticket of the mp4 file
	var elem = document.getElementById('streamurl');
	if (elem !== null) {
		var vidLink = elem.innerHTML;
		//Costruct the mp4 file path
		vidLink = 'https://openload.co/stream/' + vidLink + '?mime=true';

		window.location = vidLink;
	} else {
		window.location = 'https://bs.to/?error';
	}

});