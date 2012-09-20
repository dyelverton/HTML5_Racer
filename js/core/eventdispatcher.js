/**
 * EventDispatcher - Used for registering and trigger events
 * 
 * Example Usage: EventDispatcher.TriggerEvent("Action", "Parameter");
 * 
 * Required Includes: /corejs/base/base.js
 */

var EventDispatcher = (function(){
	
	var m_cRegisteredEvents = {};
	
	return {
		BindEvents: function(cEvents, sNamespace){
			sNamespace = isset(sNamespace) ? sNamespace : "*";
			
			var sRegId = GetUID();
			
			for (var sEvent in cEvents)
			{
				if (!isset(m_cRegisteredEvents[sEvent]))
				{
					m_cRegisteredEvents[sEvent] = {};
				}
				
				if (!isset(m_cRegisteredEvents[sEvent][sNamespace]))
				{
					m_cRegisteredEvents[sEvent][sNamespace] = {};
				}
				
				m_cRegisteredEvents[sEvent][sNamespace][sRegId] = cEvents[sEvent];
			}
			
			return sRegId;
		},
		UnbindEvents: function(sRegisterId){
			for (var sEvent in m_cRegisteredEvents)
			{
				for (var sNamespace in m_cRegisteredEvents[sEvent])
				{
					delete m_cRegisteredEvents[sEvent][sNamespace][sRegisterId];
				}
			}
		},
		TriggerEvent: function(sEvent, cParams, sNamespace){
			sNamespace = isset(sNamespace) ? sNamespace : "*";
			
			var sRegisterId = "";
			
			if (isset(m_cRegisteredEvents[sEvent]))
			{
				if (sNamespace == "*")
				{
					for (sNamespace in m_cRegisteredEvents[sEvent])
					{
						for (sRegisterId in m_cRegisteredEvents[sEvent][sNamespace])
						{
							m_cRegisteredEvents[sEvent][sNamespace][sRegisterId](cParams);
						}
					}
				}
				else if (isset(m_cRegisteredEvents[sEvent][sNamespace]))
				{
					for (sRegisterId in m_cRegisteredEvents[sEvent][sNamespace])
					{
						m_cRegisteredEvents[sEvent][sNamespace][sRegisterId](cParams);
					}
				}
			}
		}
	};
})();