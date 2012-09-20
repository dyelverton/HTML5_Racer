var Log = {
	s_bEnabled: true && typeof console != "undefined",
	
	Log: function(){
		if (Log.s_bEnabled && isset(console.log))
		{
			if (arguments.length == 1)
			{
				console.log(arguments[0]);
			}
			else if (arguments.length > 1)
			{
				console.log(arguments);
			}
		}
	},
	Info: function(sMessage){
		if (Log.s_bEnabled && isset(console.info))
		{
			console.info(sMessage);
		}
		else
		{
			Log.Log("INFO: " + sMessage);
		}
	},
	Debug: function(sMessage){
		if (Log.s_bEnabled && isset(console.debug))
		{
			console.debug(sMessage);
		}
		else
		{
			Log.Log("DEBUG: " + sMessage);
		}
	},
	Warn: function(sMessage){
		if (Log.s_bEnabled && isset(console.warn))
		{
			console.warn(sMessage);
		}
		else
		{
			Log.Log("WARN: " + sMessage);
		}
	},
	Error: function(sMessage){
		if (Log.s_bEnabled && isset(console.error))
		{
			console.error(sMessage);
		}
		else
		{
			Log.Log("ERROR: " + sMessage);
		}
	},
	SetLoggingEnabled: function(bEnabled){
		Log.s_bEnabled = bEnabled && typeof console != "undefined";
	}
};