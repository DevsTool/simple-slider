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

					simpleSlider = {

						indexCurrentItem: 0,

						render: function() {
							if ( settings.jsonData ) {
								this.buildJsonItems();
							}

							this.sliderStyle();

							if ( settings.navigation ) {
								this.buildNavigationHTML();
								this.addNavigationEvents();
							}

							if ( settings.pagination ) {
								this.buildPaginationHTML();
								this.addPaginationEvents();
							}
							if ( settings.autoPlay ) {
								this.autoPlay();
							}

							this.addResizeEvent();
						},

						/**
						 * Slider inline style.
						 */
						sliderStyle: function() {
							$sliderItems.css( {
								'height': settings.height,
								'animationDuration': settings.duration + 'ms',
								'transitionDuration': settings.duration + 'ms'
							} );

							$sliderItem.width( $sliderItemsWidth );

							$this.addClass( 'simple-slider--' + settings.animation );
							$sliderItem.first()
								.addClass( 'current' );
						},

						/**
						 * Build Navigation Html.
						 */
						buildNavigationHTML: function() {
							var $next = '<div class="simple-slider__next">' + settings.navigationNext + '</div>',
								$prev = '<div class="simple-slider__prev">' + settings.navigationPrev + '</div>';

							$sliderWrap.append( '<div class="simple-slider__navigation">' + $prev + $next + '</div>' );
						},

						/**
						 * Build Pagination Html.
						 */
						buildPaginationHTML: function() {
							var $bulletHtml = '<span class="simple-slider__bullet"></span>',
								i = 1;

							$this.append( '<div class="simple-slider__pagination"></div>' );
							for ( ; i <= $itemsCount; i++ ) {
								$( '.simple-slider__pagination', $this ).append( $bulletHtml );
							}
							$( '.simple-slider__bullet', $this )
								.first()
								.addClass( 'active' );
						},

						/**
						 * Add slider navigation events.
						 */
						addNavigationEvents: function() {
							var $nextBtn = $( '.simple-slider__next', $this ),
								$prevBtn = $( '.simple-slider__prev', $this );

							$nextBtn.on( 'click', this.slidingNext.bind( this ) );
							$prevBtn.on( 'click', this.slidingPrev.bind( this ) );
						},

						/**
						 * Add slider pagination events.
						 */
						addPaginationEvents: function() {
							var self = this,
								slidingBulletHandler = function() {
									self.indexCurrentItem = $( this ).index();

									self.slidingAnimation( $sliderItemsWidth * self.indexCurrentItem );
									self.addActiveClasses();
								};

							$( '.simple-slider__bullet', $this ).on( 'click', slidingBulletHandler );
						},

						/**
						 * Sliding Next Handler.
						 */
						slidingNext: function() {
							var $offset;

							if ( this.indexCurrentItem === ( $itemsCount - 1 ) ) {
								$offset = 0;
								this.indexCurrentItem = 0;

							}
							else {
								$offset = $sliderItemsWidth * ( this.indexCurrentItem + 1 );
								this.indexCurrentItem++;
							}

							this.slidingAnimation( $offset );
							this.addActiveClasses();
						},

						/**
						 * Sliding Prev Handler.
						 */
						slidingPrev: function() {
							var $offset;

							if ( this.indexCurrentItem === 0 ) {
								$offset = $sliderItemsWidth * ( $itemsCount - 1 );
								this.indexCurrentItem = $itemsCount - 1;
							}
							else {
								$offset = ( ( $sliderItemsWidth * this.indexCurrentItem ) - $sliderItemsWidth );
								this.indexCurrentItem--;
							}

							this.slidingAnimation( $offset );
							this.addActiveClasses();
						},

						/**
						 * Sliding animation.
						 */
						slidingAnimation: function( $offset ) {
							var $cssTranslate3d = 'translate3d(' + -$offset + 'px, 0px, 0px)';

							$sliderItems.css( {
								'-webkit-transform': $cssTranslate3d,
								'-moz-transform': $cssTranslate3d,
								'-o-transform': $cssTranslate3d,
								'-ms-transform': $cssTranslate3d,
								'transform': $cssTranslate3d
							} );
						},

						/**
						 * Add active classes.
						 */
						addActiveClasses: function() {
							var $activeBullet = $( '.simple-slider__bullet.active', $this ),
								$bullet = $( '.simple-slider__bullet', $this ),
								$activeSliderItem = $( '.simple-slider__item.current', $sliderItems ),
								removeAnimationClass = setTimeout( function() {
									$sliderItems.removeClass( settings.animation );
								}, settings.duration );

							// add active class to bullet
							$activeBullet.removeClass( 'active' );
							$bullet.eq( this.indexCurrentItem ).addClass( 'active' );

							// add active class to current slider item
							$activeSliderItem.removeClass( 'current' );
							$sliderItem.eq( this.indexCurrentItem ).addClass( 'current' );

							// add animation class
							$sliderItems.addClass( settings.animation );
							removeAnimationClass();
							clearTimeout( removeAnimationClass );
						},

						/**
						 * Auto play.
						 */
						autoPlay: function() {
							var self = this;
							setInterval( function() {
								self.slidingNext();
							}, settings.autoPlayDelay );
						},

						/**
						 * Add resize event.
						 */
						addResizeEvent: function() {
							$( window ).on( 'resize.simple_slider', function() {
								$sliderItemsWidth = $sliderItems.width();
								$sliderItem.width( $sliderItemsWidth );
							} );
						},

						/**
						 * Build json items.
						 */
						buildJsonItems: function() {
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
					};

				// Render slider.
				simpleSlider.render();

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