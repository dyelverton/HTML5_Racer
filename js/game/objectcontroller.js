

var ObjectController = (function(){

	var m_cObjects = {};
	var m_nObjectKey = -1;

	return {
		Update: function(nDelta, aKeysDown){
			for (var sKey in m_cObjects)
			{
				if (typeof m_cObjects[sKey].Update == "function")
				{
					m_cObjects[sKey].Update(nDelta, aKeysDown, function(cCoords, bOk){
						Log.Log(cCoords, bOk);
					});
				}
			}
		},
		Register: function(cObject){

			++m_nObjectKey;
			m_cObjects[m_nObjectKey] = cObject;

			return m_nObjectKey;
		}
	};		
})();