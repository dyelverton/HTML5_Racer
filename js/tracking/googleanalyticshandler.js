
var GoogleAnalyticsHandler = (function(){
	
	var m_cUrls = {};
	
	var fTrackPageView = function(sUrl){
		if (typeof _gaq != "undefined" && _gaq)
		{
			_gaq.push(['_trackPageview', sUrl]);
		}
	};
	
	return {
		RegisterUrls: function(cUrls){
			$.extend(m_cUrls, cUrls);
		},
		PageView: function(sPage){
			if (typeof m_cUrls[sPage] == "string")
			{
				fTrackPageView(m_cUrls[sPage]);
			}
		},
		TrackPageView: function(sUrl){
			fTrackPageView(sUrl);
		}
	};
})();