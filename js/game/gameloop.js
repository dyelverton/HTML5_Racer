

var Game = (function(){
	
	//http://javascript.info/tutorial/animation
	//https://www.google.co.uk/search?q=top+down+driving+game&hl=en&prmd=imvnsa&tbm=isch&tbo=u&source=univ&sa=X&ei=pbtQUKmNLqiw0QWHhYGgAg&ved=0CD0QsAQ&biw=1920&bih=995
	
	var eCanvas = document.createElement("canvas");
	var cContext = eCanvas.getContext("2d");
	var cCanvasSettings = {
		Width: 800,
		Height: 800
	};
	eCanvas.width = cCanvasSettings.Width;
	eCanvas.height = cCanvasSettings.Height;
	document.body.appendChild(eCanvas);
	
	
	// Handle keyboard controls
	var m_aKeysDown = {};
	
	var fGameLoop = function(nDelta){
		
		cContext.fillStyle = "#eee";
		cContext.clearRect(0, 0, cCanvasSettings.Width, cCanvasSettings.Height);
		cContext.fillRect(0, 0, cCanvasSettings.Width, cCanvasSettings.Height);
		
		// Update objects
		ObjectController.Update(nDelta, m_aKeysDown);
		
		DisplayConsole.Update("nDelta", nDelta);
		// Draw canvas
	};
	
	var cCar = new Thing({
		Sprite: "img/car.png",
		Frames: 1,
		Width: 64,
		Height: 64,
		MaxSpeed: 130,
		AccRate: 80,
		BreakRate: 250,
		Context: cContext,
		Canvas: eCanvas
	});
	
	cCar.Position(600,600);
	
	ObjectController.Register(cCar);
	
	return {
		Init: function(){
			TimeHandler.OnUpdate(fGameLoop);
		
			addEventListener("keydown", function(e){
				
				Log.Log(e.keyCode);
				
				
				
				m_aKeysDown[e.keyCode] = true;
			}, false);

			addEventListener("keyup", function(e){
				delete m_aKeysDown[e.keyCode];
			}, false);
		}
	};	
})();

var KEYS = {
	LEFT: "37",
	UP: "38",
	RIGHT: "39",
	DOWN: "40"
};