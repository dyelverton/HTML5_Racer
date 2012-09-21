var DisplayConsole = (function(){
	
	var $Console = $("<div>").css({
		position: "absolute",
		top: 0,
		right: 0,
		padding: "20px",
		fontSize: "20px",
		fontFamily: "monospace",
//		background: "#000",
		color: "#cfc"
	}).appendTo($("body"));
	
	var m_nTime = 0;
	var m_nFrameRate = 500;
	
	var m_cValues = {
		
	};
	
	return {
		Update: function (sValue, nValue){
			
			if (typeof m_cValues[sValue] == "undefined")
			{
				m_cValues[sValue] = $("<p>").appendTo($Console);
			}
			
			m_cValues[sValue].text(sValue + ": " + nValue);
		}
	};
})()