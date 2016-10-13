/**
 * Scripts init.
 */
(function( $ ) {
	"use strict";

	$( document ).ready( function() {
		var $slider = $( '.simple-slider' );
		if ( $slider.length > 0 ) {
			$slider.each( function() {
				var $this = $( this ),
					settings = $this.data( 'settings' ),
					$sliderHeight = settings['height'],
					$sliderDuration = settings['duration'],
					$sliderAutoPlay = settings['auto-play'],
					$sliderAnimation = settings['animation'],
					$sliderNavigation = settings['navigation'],
					$sliderPagination = settings['pagination'],
					$sliderJson = settings['json'],
					$sliderJsonPath = settings['json-path'];

				$this.simpleSlider( {
					height: $sliderHeight,
					duration: $sliderDuration,
					navigation: $sliderNavigation,
					pagination: $sliderPagination,
					animation: $sliderAnimation,
					navigationPrev: '<i class="fa fa-chevron-left"></i>',
					navigationNext: '<i class="fa fa-chevron-right"></i>',
					autoPlay: $sliderAutoPlay,
					jsonData: $sliderJson,
					jsonPatch: $sliderJsonPath
				} );
			} );

			// Default init
			//$slider.simpleSlider();
		}
	} );
})( jQuery );