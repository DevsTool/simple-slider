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
					$sliderHeight = $this.data( 'height' ),
					$sliderDuration = $this.data( 'duration' ),
					$sliderAutoPlay = $this.data( 'auto-play' ),
					$sliderAnimation = $this.data( 'animation' ),
					$sliderNavigation = $this.data( 'navigation' ),
					$sliderPagination = $this.data( 'pagination' ),
					$sliderJson = $this.data( 'json' ),
					$sliderJsonPath = $this.data( 'json-path' );

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