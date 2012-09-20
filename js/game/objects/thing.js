function Thing(cArgs)
{
	var m_cArgs = $.extend({
		Sprite: "img/bird.png",
		Frames: 1,
		Width: 32,
		Height: 32,
		MaxSpeed: 130, // Change to max speed px/second
		AccRate: 100, // px/second/AccRate
		FrameRate: 0.02,
		Context: null,
		TurningRadius: 50 // pixels turning circle
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
	m_cImage.onload = function(){
		
		m_bReady = true;
	};
	m_cImage.src = m_cArgs.Sprite;
	
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
			var nAdjustment = nDelta / m_cArgs.AccRate;
			
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
			var nAdjustment = nDelta / m_cArgs.AccRate;
			
			if (bNatural)
			{
				nAdjustment = nAdjustment * 0.5;
			}
			
			m_cSettings.CurrentSpeed -= nAdjustment;

			if (m_cSettings.CurrentSpeed <= 0)
			{
				m_cSettings.CurrentSpeed = 0;
			}
		}
	};
	
	var fTurn = function(nDistance, bClockwise){
		
		// Need to have a turning circle which is calculated by current speed
		var nCentralPositionDegrees = 360 * (nDistance / (Math.PI * 2 * m_cArgs.TurningRadius));
		var nAngleChange = 90 - (0.5 * 180 - nCentralPositionDegrees);
		
		
		if (bClockwise)
		{
			m_cSettings.CurrentAngle += nAngleChange;
		}
		else
		{
			m_cSettings.CurrentAngle -= nAngleChange;
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
			
//			m_cSettings.Position.X += top;
//			m_cSettings.Position.Y += left;
			m_cSettings.Position.Y -= nDistance;
			
			
			DisplayConsole.Update("X", Math.round(m_cSettings.Position.X));
			DisplayConsole.Update("Y", Math.round(m_cSettings.Position.Y));
			
			if (m_cArgs.Context)
			{
				m_cArgs.Context.save(); 
// 
//				// move to the middle of where we want to draw our image
				m_cArgs.Context.translate(Math.floor(m_cSettings.Position.X + (m_cArgs.Width * 0.5)), Math.floor(m_cSettings.Position.Y + (m_cArgs.Height * 0.5)));
//
//				// rotate around that point, converting our 
//				// angle from degrees to radians 
				m_cArgs.Context.rotate(nRad);

				// draw it up and to the left by half the width
				// and height of the image
				m_cArgs.Context.drawImage(m_cImage, m_cSettings.Clip.X, m_cSettings.Clip.Y, m_cArgs.Width, m_cArgs.Height, m_cSettings.Position.X, m_cSettings.Position.Y, m_cArgs.Width, m_cArgs.Height);

				// and restore the co-ords to how they were when we began
				m_cArgs.Context.restore(); 
				
			}
			else
			{
				
			}
		}
		
		
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