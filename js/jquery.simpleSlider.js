/**
 * Simple slider.
 */
(function( $ ) {
	'use strict';

	var methods = {

		init: function( options ) {
			var settings = {
				height: 500,
				animation: 'slide',
				duration: 1500,
				navigation: true,
				navigationPrev: 'Prev',
				navigationNext: 'Next',
				pagination: true,
				autoPlay: false,
				autoPlayDelay: 10000,
				jsonData: false,
				jsonPatch: ''
			};

			return this.each( function() {
				if ( options ) {
					$.extend( settings, options );
				}

				var $this = $( this ),
					$sliderWrap = $( '.simple-slider__wrap', $this ),
					$sliderItems = $( '.simple-slider__items', $this ),
					$sliderItem = $( '.simple-slider__item', $sliderItems ),
					$itemsCount = $sliderItem.length,
					$sliderItemsWidth = $sliderItems.width(),
					$indexCurrentItem = 0;

				(function() {

					if ( settings.jsonData ) {
						buildJsonItems();
					}

					sliderStyle();

					if ( settings.navigation ) {
						buildNavigationHTML();
						addNavigationEvents();
					}

					if ( settings.pagination ) {
						buildPaginationHTML();
						addPaginationEvents();
					}
					if ( settings.autoPlay ) {
						autoPlay();
					}

					addResizeEvent();

				})();


				/**
				 * Slider inline style.
				 */
				function sliderStyle() {
					$sliderItems.css( {
						'height': settings.height,
						'animationDuration': settings.duration + 'ms',
						'transitionDuration': settings.duration + 'ms'
					} );

					$sliderItem.width( $sliderItemsWidth );

					$this.addClass( 'simple-slider--' + settings.animation );
					$sliderItem.first()
						.addClass( 'current' );
				}

				/**
				 * Build Navigation Html.
				 */
				function buildNavigationHTML() {
					var $next = '<div class="simple-slider__next">' + settings.navigationNext + '</div>',
						$prev = '<div class="simple-slider__prev">' + settings.navigationPrev + '</div>';

					$sliderWrap.append( '<div class="simple-slider__navigation">' + $prev + $next + '</div>' );
				}

				/**
				 * Build Pagination Html.
				 */
				function buildPaginationHTML() {
					var bulletHtml = '<span class="simple-slider__bullet"></span>',
						i = 1;

					$this.append( '<div class="simple-slider__pagination"></div>' );
					for ( ; i <= $itemsCount; i++ ) {
						$( '.simple-slider__pagination', $this ).append( bulletHtml );
					}
					$( '.simple-slider__bullet', $this )
						.first()
						.addClass( 'active' );
				}

				/**
				 * Add slider navigation events.
				 */
				function addNavigationEvents() {
					var $nextBtn = $( '.simple-slider__next', $this ),
						$prevBtn = $( '.simple-slider__prev', $this );

					$nextBtn.on( 'click', slidingNext );
					$prevBtn.on( 'click', slidingPrev );
				}

				/**
				 * Add slider pagination events.
				 */
				function addPaginationEvents() {
					var $bullet = $( '.simple-slider__bullet', $this );

					$bullet.on( 'click', slidingBullet );
				}

				/**
				 * Sliding Next Handler.
				 */
				function slidingNext() {
					var $offset;

					if ( $indexCurrentItem === ( $itemsCount - 1 ) ) {
						$offset = 0;
						$indexCurrentItem = 0;

					}
					else {
						$offset = $sliderItemsWidth * ( $indexCurrentItem + 1 );
						$indexCurrentItem++;
					}

					slidingAnimation( $offset );
					addActiveClasses();
				}

				/**
				 * Sliding Prev Handler.
				 */
				function slidingPrev() {
					var $offset;

					if ( $indexCurrentItem === 0 ) {
						$offset = $sliderItemsWidth * ( $itemsCount - 1 );
						$indexCurrentItem = $itemsCount - 1;
					}
					else {
						$offset = ( ( $sliderItemsWidth * $indexCurrentItem ) - $sliderItemsWidth );
						$indexCurrentItem--;
					}

					slidingAnimation( $offset );
					addActiveClasses();
				}

				/**
				 * Sliding Bullet Handler.
				 */
				function slidingBullet() {
					var $bulletIndex = $( this ).index(),
						$offset;

					$indexCurrentItem = $bulletIndex;
					$offset = $sliderItemsWidth * $indexCurrentItem;

					slidingAnimation( $offset );
					addActiveClasses();
				}

				/**
				 * Sliding animation.
				 */
				function slidingAnimation( $offset ) {
					var $cssTranslate3d = 'translate3d(' + -$offset + 'px, 0px, 0px)';

					$sliderItems.css( {
						'-webkit-transform': $cssTranslate3d,
						'-moz-transform': $cssTranslate3d,
						'-o-transform': $cssTranslate3d,
						'-ms-transform': $cssTranslate3d,
						'transform': $cssTranslate3d
					} );
				}

				/**
				 * Add active classes.
				 */
				function addActiveClasses() {
					var $activeBullet = $( '.simple-slider__bullet.active', $this ),
						$bullet = $( '.simple-slider__bullet', $this ),
						$activeSliderItem = $( '.simple-slider__item.current', $sliderItems );

					// add active class to bullet
					$activeBullet.removeClass( 'active' );
					$bullet.eq( $indexCurrentItem ).addClass( 'active' );

					// add active class to current slider item
					$activeSliderItem.removeClass( 'current' );
					$sliderItem.eq( $indexCurrentItem ).addClass( 'current' );

					// add animation class
					$sliderItems.addClass( settings.animation );
					setTimeout( function() {
						$sliderItems.removeClass( settings.animation );
					}, settings.duration );

				}

				/**
				 * Auto play.
				 */
				function autoPlay() {
					setInterval( function() {
						slidingNext();
					}, settings.autoPlayDelay );
				}

				/**
				 * Add resize event.
				 */
				function addResizeEvent() {
					$( window ).on( 'resize.simple_slider', function() {
						$sliderItemsWidth = $sliderItems.width();
						$sliderItem.width( $sliderItemsWidth );
					} );
				}

				/**
				 * Build json items.
				 */
				function buildJsonItems() {
					if ( !settings.jsonPatch ) {
						return false;
					}

					$.getJSON(
						settings.jsonPatch,
						function( data ) {
							var $sliderItemHtml = '';

							for ( var i in data['items'] ) {

								var $img = data['items'][i].img,
									$alt = data['items'][i].alt;

								$sliderItemHtml += '<div class="simple-slider__item"><img src="' + $img + '" alt="' + $alt + '"></div>';
							}
							$sliderItems.append( $sliderItemHtml );

						}
					);
				}

			} );
		}
	};

	$.fn.simpleSlider = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'Method with name ' + method + ' is not exist for simpleSlider jQuery plugin' );
		}

	};
})( jQuery );