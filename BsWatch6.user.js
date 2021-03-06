﻿// ==UserScript==
// @name        BsWatch - File 6
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/openload\.co\/embed\/.+$/
// @version    	1.5
// @description	OpenLoad Direct-Link
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch6.user.js
// ==/UserScript==

makeBlackPage();

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

//When document loaded
$(document).ready(function () {
    //Get the api ticket of the mp4 file
    var elem = document.getElementById('streamurl');
    if (elem !== null) {
		if(elem.innerHTML != "HERE IS THE LINK"){
			var vidLink = elem.innerHTML;
			//Costruct the mp4 file path
			vidLink = 'https://openload.co/stream/' + vidLink + '?mime=true';

			window.location = vidLink;
			return;
		}
    }
	window.location = 'https://bs.to/?error';
});
