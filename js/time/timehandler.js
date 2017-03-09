
/**
 * TimeHandler - for animations, replacing timeouts and intervals
 * 
 * Usage:
			var sIntervalId = TimeHandler.SetInterval(function(){}, 1000);
			TimeHandler.Clear(sIntervalId);
			var sTimerId = TimeHandler.SetTimeout(function(){}, 200);
			TimeHandler.Clear(sTimerId);
 *
 * Required Includes: /corejs/time/animationframepolyfill.js
 * 
 */
// Time handler portion 
var TimeHandler = (function(){
			
	var m_nTime = new Date().getTime(),
		m_cActiveTimers = {},
		m_aOnUpdateTimers = [], // Updates everytime
		m_nLastKey = -1,
		m_nNonCriticalCutOffTime = -300;
		
	function Add(fCallback, nDelay, bRepeat, bCritical)
	{
		var sId = m_nLastKey;
		var nStartTime = m_nTime + nDelay;

		m_cActiveTimers[sId] = {
			"Callback":fCallback,
			"Delay":nDelay,
			"Repeat":bRepeat,
			"ExecuteAt":nStartTime,
			"Critical":bCritical,
			"PreviousTime":nStartTime
		};

		++m_nLastKey;

		return sId;
	}

	function Update(nTime)
	{
		for (var nTimerIndex = 0; nTimerIndex < m_aOnUpdateTimers.length; ++nTimerIndex)
		{
			if (typeof m_aOnUpdateTimers[nTimerIndex] == "function")
			{
				m_aOnUpdateTimers[nTimerIndex](nTime-m_nTime);
			}
		}
		
		m_nTime = nTime;

		for (var sKey in m_cActiveTimers)
		{
			if (typeof m_cActiveTimers[sKey].Callback == "function") // Valid Timer
			{
				var nTimeTilExecution = m_cActiveTimers[sKey].ExecuteAt - m_nTime;

				if (nTimeTilExecution < 1)
				{
					if (m_cActiveTimers[sKey].Delete)
					{
						delete m_cActiveTimers[sKey];
					}
					else
					{
						if (m_cActiveTimers[sKey].Repeat)
						{
							// Intervals
							m_cActiveTimers[sKey].Callback(m_nTime - m_cActiveTimers[sKey].PreviousTime); // Callback with the dt
							m_cActiveTimers[sKey].PreviousTime = m_nTime;
							m_cActiveTimers[sKey].ExecuteAt = m_nTime + m_cActiveTimers[sKey].Delay;
						}
						else
						{
							// Timeouts
							if (m_cActiveTimers[sKey].Critical ||
								nTimeTilExecution > m_nNonCriticalCutOffTime)
							{
								m_cActiveTimers[sKey].Callback();
							}

							delete m_cActiveTimers[sKey];
						}
					}
				}
			}
		}

		requestAnimationFrame(Update);
	}

	requestAnimationFrame(Update);
	
	return {
		GetTime: function(){
			return m_nTime;
		},		
		SetTimeout: function(fCallback, nDelay, bCritical){
			
			bCritical = typeof bCritical == "undefined" ? false : bCritical;
			
			return Add(fCallback, nDelay, false, bCritical);
		},
		SetInterval: function(fCallback, nDelay, bStartNow){
			
			bStartNow = typeof bStartNow == "undefined" ? false : bStartNow;
			
			if (bStartNow)
			{
				fCallback();
			}
			
			return Add(fCallback, nDelay, true, false);
		},
		Clear: function(sKey){
			if (typeof m_cActiveTimers[sKey] != "undefined")
			{
				m_cActiveTimers[sKey].Delete = true;
			}
		},
		Get: function(){
			Log.Warn("Get function deprecated! Avoid using where possible");
			return TimeHandler;
		},
		OnUpdate: function(fCallback){
			m_aOnUpdateTimers.push(fCallback);
		}
	};
})();
