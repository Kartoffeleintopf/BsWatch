function setCookie(name, value, perma) {
	var expires = '';

	//For permanent cookie
	if (perma) {
		var d = new Date();
		//expires in 9999days
		d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
		var expires = ";expires=" + d.toUTCString();
	}
	//Create new cookie
	document.cookie = name + "=" + value + expires + ";path=/";
}

function getCookie(cname) {
	//Name if the cookie
	var name = cname + "=";
	//The complete cookie string
	var decodedCookie = decodeURIComponent(document.cookie);
	//Cookie array
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		//Current cookie
		var c = ca[i];
		//Delete all spaces at the beginning
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		
		//When the name is part of the string
		if (c.indexOf(name) == 0) {
			//Only the string value after 'cname='
			var returnVal = c.substring(name.length, c.length);

			//Pase values in boolean int and string
			if (returnVal.toLowerCase() == 'true') {
				return true;
			} else if (returnVal.toLowerCase() == 'false') {
				return false;
			} else if ((/^\d+$/).test(returnVal)) {
				return parseInt(returnVal);
			} else {
				return returnVal;
			}
		}
	}
	//Cookie is undefined when not found
	return undefined;
}

function removeCookie(name) {
	//Set the cookie to a expired date
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
