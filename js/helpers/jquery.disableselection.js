/*
 * jQuery disableSelection
 *
 * Will Thirkettle
 *
 * Disables selection / text highlighting...
 */

(function($){

	$.fn.disableSelection = function() {
		return this.each(function() {			
			$(this).attr('unselectable', 'on')
				   .css({
					   '-moz-user-select':'none',
					   '-webkit-user-select':'none',
					   'user-select':'none'
				   })
				   .each(function() {
					   this.onselectstart = function() { return false; };
				   });
		});
	};
	
})(jQuery);