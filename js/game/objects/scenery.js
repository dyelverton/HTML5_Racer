function Scenery(cArgs, fOnReady)
{
	var m_cArgs = $.extend({
		Sprite: "img/tree.png",
		Frames: 1,
		Width: 32,
		Height: 32,
		FrameRate: 0.02
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
		FrameIndex: 1
	};
	
	var m_nTime = 0;
	var m_cImage = new Image();
	
	this.Position = function(nX, nY){
		
		if (typeof nX == "number" && typeof nY == "number")
		{
			m_cSettings.Position.X = nX;
			m_cSettings.Position.Y = nY;
		}
		
		return m_cSettings.Position;
	};
	
	this.Update = function(nDelta){
		
		m_nTime += nDelta;
		
		if (m_nTime >= m_cArgs.FrameRate)
		{
			m_nTime = m_cArgs.FrameRate - m_nTime;
			
			++ m_cSettings.FrameIndex;

			if (m_cSettings.FrameIndex == m_cArgs.Frames)
			{
				m_cSettings.FrameIndex = 0;
			}
		
			m_cSettings.Clip.X = m_cSettings.FrameIndex * m_cArgs.Width;
		}
	};
	
	this.Render = function(ctx){
		ctx.drawImage(m_cImage, m_cSettings.Clip.X, m_cSettings.Clip.Y, m_cArgs.Width, m_cArgs.Height, m_cSettings.Position.X, m_cSettings.Position.Y, m_cArgs.Width, m_cArgs.Height);
	};
	
	m_cImage.onload = function(){
		fOnReady();
	};
	m_cImage.src = m_cArgs.Sprite;
	
	return true;
}
