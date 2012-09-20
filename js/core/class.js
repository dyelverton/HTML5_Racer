function ExtendClass(cChild, cParent)
{
	for (var sProp in cParent)
	{
		if (typeof cParent[sProp] == "function")
		{
			cChild[sProp] = (function(sProp){
				return function(){
					return cParent[sProp].apply(this, arguments);
				};
			})(sProp);
		}
		else
		{
			(function(sProp){
				Object.defineProperty(
					cChild, 
					sProp, 
					{
						get : function(){ return cParent[sProp]; },  
						set : function(value){ cParent[sProp] = value; },
						configurable: true
					}
				);
			})(sProp);  
		}
	}
	
	return cParent;
}
