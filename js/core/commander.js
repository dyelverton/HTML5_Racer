/**
 * Commander - Used for communication to and from server
 * 
 * Example Usage: Commander.RunCommand({
 *		Command: "TheCommand",
 *		Success: function(){
 *			//Something happens
 *		}
 * });
 * 
 * Required Includes: /corejs/logging/logging.js
 * Required Includes: /corejs/base/md5.js
 * Required Includes: /corejs/base/base.js
 */

var Commander = (function(){
	
	var m_cCommands = {};
	var m_fServerHandler = null;
	
	var m_cCache = {};
		
	var m_cDefaults = {
		Command: null,				//The command to call either a preregistered command or a url
		CommandData: {},			//The parameters used to build the query string eg. { Param1: "data1", Param2: "data2" } == ?Param1=data1&Param2=data2
		Type: "GET",				//The type of the request either GET or POST
		Success: function(){},		//Callback on success
		Error: function(){},		//Callback on failure
		Always: function(){},		//Callback that always gets called on success or failure
		Absolute: false,			//Whether the command paramater is a url or not
		Cache: false,				//Whether to cache the results within commander
		BrowserCache: false,		//Whether to let the browser cache the results
		DataType: "json"            //Datatype to use
	};
	
	return {
		Init: function(cCommands, fServerHandler){
			m_cCommands = cCommands;
			m_fServerHandler = isset(fServerHandler) ? fServerHandler : null; 
		},
		RunCommand: function(cParameters){
			var cCommandParams = {};
			var sCommandUrl = "";
			
			var sCommandError = "Commander - Unknown Command - " + cParameters.Command;
			
			var bCommandFound = isset(m_cCommands[cParameters.Command]);
			
			if (bCommandFound)
			{
				if (typeof m_cCommands[cParameters.Command] == "object")
				{
					if (!isset(m_cCommands[cParameters.Command].Url))
					{
						bCommandFound = false;
						sCommandError = "Commander - No url provided in command object for command - " + cParameters.Command;
					}
					else 
					{
						if (isset(m_cCommands[cParameters.Command].Params))
						{
							cCommandParams = m_cCommands[cParameters.Command].Params;
						}
						
						sCommandUrl = m_cCommands[cParameters.Command].Url;
					}
				}
				else
				{
					sCommandUrl = m_cCommands[cParameters.Command];
				}
			}
			
			cParameters = $.extend({}, m_cDefaults, cCommandParams, cParameters);
			
			if (bCommandFound || cParameters.Absolute)
			{
				var bRunCommand = true;
				
				var sUrl = bCommandFound ? sCommandUrl : cParameters.Command;
				var sHash = "";
				
				if (cParameters.Cache)
				{
					sHash = md5(sUrl + JSON.stringify(cParameters.CommandData));
					if (isset(m_cCache[sHash]))
					{
						var cRet = m_cCache[sHash];
						
						bRunCommand = false;
						cParameters.Success(cRet);
						cParameters.Always();
						EventDispatcher.TriggerEvent(cParameters.Command, cRet);
					}
				}
				
				if (bRunCommand)
				{
					if (JSON.stringify(cParameters.CommandData).length > 300 && cParameters.Type == "GET")
					{
						Log.Warn("Commander - Message too long in command: " + cParameters.Command);
					}
					
					$.ajax({
						url: sUrl,
						data: cParameters.CommandData,
						type: cParameters.Type,
						dataType: cParameters.DataType,
						cache: cParameters.BrowserCache,
						//timeout: 60000,
						success: function(cRet){
							var sError = null;

							if (cRet)
							{
								var bContinue = true;

								if (isset(cRet.Server) && m_fServerHandler)
								{
									bContinue = m_fServerHandler({
										"Server": cRet.Server
									}, cParameters.Command);
								}

								if (bContinue)
								{
									if (isset(cRet.Result))
									{
										if (cParameters.Cache)
										{
											m_cCache[sHash] = cRet.Result;
										}
										
										cParameters.Success(cRet.Result);
										EventDispatcher.TriggerEvent(cParameters.Command, cRet.Result);
									}
									else
									{
										if (isset(cRet.Error))
										{
											sError = "Commander - Server Error - " + cRet.Error + ": " + cRet.Message;
											cParameters.Error();
										}
										else
										{
											sError = "Commander - Malformed Response - " + JSON.stringify(cRet);
											
											if (m_fServerHandler)
											{
												bContinue = m_fServerHandler({
													"Error": {}
												}, cParameters.Command);

												if (bContinue)
												{
													cParameters.Error();
												}
											}
										}

									}
								}
							}
							else
							{
								sError = "Commander - Empty response from server";
								
								if (m_fServerHandler)
								{
									bContinue = m_fServerHandler({
										"Error": {}
									}, cParameters.Command);

									if (bContinue)
									{
										cParameters.Error();
									}
								}
							}

							if (sError)
							{
								Log.Error(sError);
							}

							cParameters.Always();
						},
						error: function(jqXHR, textStatus, errorThrown){
							
							var bContinue = true;
								
							if (m_fServerHandler)
							{
								bContinue = m_fServerHandler({
									"Error": {
										"jqXHR": jqXHR,
										"textStatus": textStatus,
										"errorThrown": errorThrown
									}
								}, cParameters.Command);
							}

							if (bContinue)
							{
								cParameters.Error();
								cParameters.Always();
							}

							Log.Error("Commander - Ajax Error!");
							Log.Log("Commander - Ajax Error:", jqXHR, textStatus, errorThrown);

						}
					});
				}
			}
			else
			{
				Log.Error(sCommandError);
							
				cParameters.Error();
				cParameters.Always();
			}
		},
		Get: function(){
			Log.Warn("Commander - Get function deprecated! Avoid using where possible");
			return Commander;
		}
	};
})();