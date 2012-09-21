function Thing(cArgs)
{
	var m_cArgs = $.extend({
		Sprite: "img/bird.png",
		Frames: 1,
		Width: 32,
		Height: 32,
		MaxSpeed: 130, // Change to max speed px/second
		AccRate: 25, // px/second/AccRate
		BreakRate: 25, // px/second/AccRate
		DecelRate: 25, // px/second/AccRate
		FrameRate: 0.02,
		Context: null,
		TurningRadius: 50, // pixels turning circle,
		Canvas: null
	}, cArgs);
	
	var m_cSettings = {
		Position: {
			X: 0,
			Y: 0
		},
		Clip: {
			X: 0,
			Y: 0
		},
		FrameIndex: 1,
		CurrentSpeed: 0,
		CurrentAngle: 0
	};
	
	var m_nTime = 0;
	var m_cImage = new Image();
	var m_bReady = false;
//	var HTML5render = false;
	m_cImage.onload = function(){
		
		m_bReady = true;
	};
	m_cImage.src = m_cArgs.Sprite;
	
//	var $Object = $("<div>").css({"background": "url(" + m_cArgs.Sprite + ") no-repeat 0 0", width: m_cArgs.Width, height: m_cArgs.Height, position: "absolute"});
	
	this.Position = function(nX, nY){
		
		if (typeof nX == "number" && typeof nY == "number")
		{
			m_cSettings.Position.X = nX;
			m_cSettings.Position.Y = nY;
		}
		
		return {
			X: Math.round(m_cSettings.Position.X),
			Y: Math.round(m_cSettings.Position.Y)
		};
	};

	var fAccelerate = function(nDelta){
		
		if (m_cSettings.CurrentSpeed < m_cArgs.MaxSpeed)
		{
			var nAdjustment = nDelta * m_cArgs.AccRate * 0.001;
			
			
			
			m_cSettings.CurrentSpeed += nAdjustment;

			if (m_cSettings.CurrentSpeed >= m_cArgs.MaxSpeed)
			{
				m_cSettings.CurrentSpeed = m_cArgs.MaxSpeed;
			}
		}
	};

	var fDeccelerate = function(nDelta, bNatural){
		
		if (m_cSettings.CurrentSpeed > 0)
		{
			var nAdjustment = nDelta * m_cArgs.BreakRate * 0.001;
			
			if (bNatural)
			{
				nAdjustment = nAdjustment * m_cArgs.DecelRate * 0.001;
			}
			
			m_cSettings.CurrentSpeed -= nAdjustment;

			if (m_cSettings.CurrentSpeed <= 0)
			{
				m_cSettings.CurrentSpeed = 0;
			}
		}
	};
	
	var nCircumference = (Math.PI * 2 * m_cArgs.TurningRadius);
	
	var fTurn = function(nDistance, bClockwise){
		
		// Need to have a turning circle which is calculated by current speed
		var nCentralPositionDegrees = 360 * (nDistance / nCircumference);
		var nAngleChange = 90 - (0.5 * 180 - nCentralPositionDegrees);
		
		
		if (bClockwise)
		{
			m_cSettings.CurrentAngle += nAngleChange;
			
			if (m_cSettings.CurrentAngle >= 360)
			{
				m_cSettings.CurrentAngle = m_cSettings.CurrentAngle - 360;
			}
		}
		else
		{
			m_cSettings.CurrentAngle -= nAngleChange;
			
			if (m_cSettings.CurrentAngle < 0)
			{
				m_cSettings.CurrentAngle = 360 - m_cSettings.CurrentAngle;
			}
		}
		
	};
	
	this.Update = function(nDelta, cKeysDown){
		
		if (m_bReady)
		{
			// 1. get keys down and work out what to do
			// 2. work out speed
			// 3. work out direction
			// 4. reposition
			// 5. work out terrain - fast,medium,slow or destroy!
			// 6. draw/render
			
			if (KEYS.DOWN in cKeysDown)
			{
				fDeccelerate(nDelta, false);
			}
			else if (KEYS.UP in cKeysDown)
			{
				fAccelerate(nDelta);
			}
			else
			{
				fDeccelerate(nDelta, true);
			}
		
			DisplayConsole.Update("Speed", Math.round(m_cSettings.CurrentSpeed));
			
			// now we have the speed
			
			var nDistance = m_cSettings.CurrentSpeed * nDelta * 0.001;
			
			if (KEYS.LEFT in cKeysDown)
			{
				fTurn(nDistance, false);
			}
			else if (KEYS.RIGHT in cKeysDown)
			{
				fTurn(nDistance, true);
			}
			
			// now we have the direction
			
		
			DisplayConsole.Update("Direction", Math.round(m_cSettings.CurrentAngle));
			
			
			// reposition object
			
			var fConvertToRad = function(nDegrees){
				return nDegrees * (Math.PI/180);
			};
			
			var fConvertToDegrees = function(nRadians){
				return nRadians * (180/Math.PI);
			};
			
			var nRad = fConvertToRad(m_cSettings.CurrentAngle);
			var top = Math.cos(nRad) * nDistance;
			var left = Math.sin(nRad) * nDistance;
			
			m_cSettings.Position.X += left;
			m_cSettings.Position.Y -= top;
			
			
			DisplayConsole.Update("X", Math.round(m_cSettings.Position.X));
			DisplayConsole.Update("Y", Math.round(m_cSettings.Position.Y));
			
			if (m_cArgs.Context !== null)
			{
				m_cArgs.Context.save();
//// 
////				// move to the middle of where we want to draw our image
				m_cArgs.Context.translate(Math.floor(m_cSettings.Position.X + (m_cArgs.Width * 0.5)), Math.floor(m_cSettings.Position.Y + (m_cArgs.Height * 0.5)));
////
////				// rotate around that point, converting our 
////				// angle from degrees to radians 
				m_cArgs.Context.rotate(nRad);

				// draw it up and to the left by half the width
				// and height of the image
				m_cArgs.Context.drawImage(m_cImage, m_cSettings.Clip.X, m_cSettings.Clip.Y, m_cArgs.Width, m_cArgs.Height, m_cSettings.Position.X, m_cSettings.Position.Y, m_cArgs.Width, m_cArgs.Height);

//				// and restore the co-ords to how they were when we began
				m_cArgs.Context.restore();
				
			}
			else
			{
				var sRotate = "rotate(-" + Math.floor(m_cSettings.CurrentAngle) + "deg)";
				
				$Object.css({
					"-webkit-transform": sRotate,
					"-moz-transform": sRotate,
					"transform" : sRotate,
					"top": m_cSettings.Position.Y,
					"left": m_cSettings.Position.X
				});
			}
		}
		
//		if (! HTML5render)
//		{
//			$Object.appendTo(m_cArgs.Canvas);
//		}
		
		// Want to update the sprite frame by delta
		
//		fMove(nDelta);
//		
//		m_nTime += nDelta;
//		
//		if (m_nTime >= m_cArgs.FrameRate)
//		{
//			m_nTime = m_cArgs.FrameRate - m_nTime;
//			
//			++ m_cSettings.FrameIndex;
//
//			if (m_cSettings.FrameIndex == m_cArgs.Frames)
//			{
//				m_cSettings.FrameIndex = 0;
//			}
//		
//			m_cSettings.Clip.X = m_cSettings.FrameIndex * m_cArgs.Width;
//		}
	};
	
	return true;
}