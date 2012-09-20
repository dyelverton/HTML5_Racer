
// Extend the Array class with isArray if not defined
if (!Array.isArray)
{
	Array.isArray = function(arg){
		return Object.prototype.toString.call(arg) == '[object Array]';
	};
} 

function isset(val)
{
	return typeof val != "undefined";
}

function GetUID()
{
	function S4()
	{
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function String_Shorten(sString, nMaxCharacters, sStringEnd)
{
	var sShortString = "";
	
	if (sString)
	{
		sShortString = sString.toString(); // in case number is parsed in
	
		if (typeof nMaxCharacters != "undefined" &&
			! isNaN(nMaxCharacters) &&
			sShortString.length > nMaxCharacters)
		{	
			if (typeof sStringEnd == "undefined")
			{
				sStringEnd = "'";
			}
			
			sShortString = sShortString.substring(0, nMaxCharacters - sStringEnd.length);
			sShortString = String_Trim(sShortString) + sStringEnd;
		}
	}
	
	return sShortString;
}

function String_RemoveSpaces(sString)
{
	return sString.split(' ').join('');
}

function String_CssClassName(sString, sPrefix)
{
	sString = sString.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
	
	if (typeof sPrefix != "undefined")
	{
		sString = sPrefix + sString;
	}
	
	return String_RemoveSpaces(sString); 
}

function String_Trim(sString)
{
	if (sString.charAt(sString.length - 1) == " ")
	{
		sString = sString.substring(0, sString.length - 1);
	}
	
	return sString;
}

function Time_GetTimeBySeconds(nSeconds, cArgs)
{
	var cSettings = $.extend({
		"ShowDays": true,
		"ShowHours": true
	}, cArgs);
	
	var cTime = {};
	
	nSeconds = Math.floor(nSeconds);
	
	if (cSettings.ShowDays)
	{
		cTime = {
			Days: Math.floor(nSeconds / 86400),
			Hours: Math.floor((nSeconds % 86400) / 3600),
			Minutes: Math.floor((nSeconds % 3600) / 60),
			Seconds: nSeconds % 60
		};
	}
	else if (cSettings.ShowHours)
	{
		cTime = {
			Hours: Math.floor(nSeconds / 3600),
			Minutes: Math.floor((nSeconds % 3600) / 60),
			Seconds: nSeconds % 60
		};
	}
	else
	{
		cTime = {
			Minutes: Math.floor(nSeconds / 60),
			Seconds: nSeconds % 60
		};
	}
	
	return cTime; 
}

function String_GetTimeBySeconds(nSeconds, cArgs)
{
	var sTime = "";
	var bPositive = nSeconds >= 0;
	var cTime = Time_GetTimeBySeconds(Math.abs(nSeconds), cArgs);
	var cSettings = $.extend({
		"Shorten": false
	}, cArgs);

	if (cTime.Days > 0)
	{
		sTime = cSettings.Shorten ? cTime.Days + "d" : cTime.Days + "d " + cTime.Hours + "h " + cTime.Minutes + "m " + cTime.Seconds + "s";
	}
	else if (cTime.Hours > 0)
	{
		sTime = cSettings.Shorten ? cTime.Hours + "h" : cTime.Hours + "h " + cTime.Minutes + "m " + cTime.Seconds + "s";
	}
	else if (cTime.Minutes > 0)
	{
		sTime = cSettings.Shorten ? cTime.Minutes + "m" : cTime.Minutes + "m " + cTime.Seconds + "s";
	}
	else if (nSeconds > 0)
	{
		sTime = nSeconds + "s";

		if (nSeconds < 10)
		{
			sTime = "0" + sTime;
		}
	}

	return bPositive ? sTime : "-" + sTime;
}