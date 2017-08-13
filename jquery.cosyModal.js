/**
 * cosyModal
 * @author Jan Ebsen <xicrow@gmail.com>
 * @version 1.0.0
 * @date 2014-02-06
 * @copyright Jan Ebsen 2014
 */
(function($){
	// cosyModal object
	$.cosyModal = {
		// Default configuration
		configuration : {
			width : 400,
			height : 'auto',
			showTime : 500,
			hideTime : 250
		},
		
		// Events
		/*
		cosyModalShow
		cosyModalShowed
		cosyModalHide
		cosyModalHided
		*/
		
		// Counter used for ID's
		counter : 0,
		
		// Are we animating ?
		animating : false,
		
		init : function(elmModal, options){
			// Check if element ID is an object
			if (typeof(elmModal) == 'object'){
				elmModal = $(elmModal);
			}
			// Attempt to get modal by ID
			else if ($('#'+elmModal).length){
				elmModal = $('#'+elmModal);
			}
			// Modal does not exist
			else{
				// Return false
				return false;
			}
			
			// Check if overlay element allready exists
			if (!$('#cosyModal-overlay').length){
				// Create overlay
				$('<div></div>')
					.attr('class', 'cosyModal-overlay')
					.attr('id', 'cosyModal-overlay')
					.appendTo('body');
			}
			
			// Check if modal has allready been initialized
			if (elmModal.data('cosyModal')){
				// Return true
				return true;
			}
			
			// Extends options with default configuration
			options = $.extend({}, $.cosyModal.configuration, options);
			
			// Set id in options
			options.id = elmModal.attr('id');
			
			// Set counter in options
			options.counter = $.cosyModal.counter;
			
			// Add "cosyModal" class
			elmModal.addClass('cosyModal');
			
			// Get or create the "close" element
			elmClose = elmModal.find('.close');
			if (!elmClose.length){
				elmClose = $('<div></div>')
					.attr('class', 'close')
					.html('&times;')
					.click(function(e){
						$(this).parents('.cosyModal').cosyModal('hide');
					})
					.appendTo(elmModal);
			}
			else{
				elmClose.click(function(e){
					$(this).parents('.cosyModal').cosyModal('hide');
				});
			}
			
			// Check for custom close elements
			elmModal.find('.cosyModal-close').each(function(index, elm){
				$(elm).click(function(e){
					$(this).parents('.cosyModal').cosyModal('hide');
				});
			});
			
			// Set modal specific data
			elmModal.data('cosyModal', options);
			
			// Move element to the body element
			elmModal.detach().appendTo('body');
			
			// Set max height for the modal
			maxHeight = $(window).height();
			maxHeight-= (elmModal.outerHeight(true) - elmModal.height());
			if (maxHeight < 100){
				maxHeight = 100;
			}
			
			// Set CSS for the modal
			elmModal.css({
				width : options.width,
				height : options.height,
				maxHeight : maxHeight
			});
			elmModal.css({
				marginTop : -elmModal.outerHeight(true),
			});
			
			// Make sure the modal is hidden
			elmModal.hide();
			
			// Increment the modal counter
			$.cosyModal.counter++;
			
			// Return true
			return true;
		},
		
		show : function(elmModal){
			// Check if we're animating
			if ($.cosyModal.animating){
				// Return void (there no more to do now)
				return;
			}
			
			// Get modal element
			elmModal = $(elmModal);
			if (!elmModal){
				// Element was not found
				return false;
			}
			
			// Get modal configuration
			modalConfig = elmModal.data('cosyModal');
			if (!modalConfig){
				// Configuration is not set
				return false;
			}
			
			// Trigger "show" event
			elmModal.trigger('cosyModalShow', [ elmModal[0] ]);
			
			// Set initial CSS for the element
			elmModal.css({
				display : 'block',
				opacity : 0
			});
			
			// Set animation options
			animateOptions = {
				marginTop : 50,
				opacity : 1
			};
			
			// We're now animating
			$.cosyModal.animating = true;
			
			// Animate the modal element
			elmModal.animate(animateOptions, modalConfig.showTime, function(){
				$(this).show();
				$.cosyModal.animating = false;
				
				// Listen for keydown events
				$(document).on('keydown.cosyModal', function(e){
					// If pressed key is ESCAPE
					if (e.keyCode == 27){
						// Close modals
						$('.cosyModal:visible').cosyModal('hide');
					}
				});
				
				// Trigger "showed" event
				$(this).trigger('cosyModalShowed', [ this ]);
			});
			
			// Get overlay element
			elmOverlay = $('#cosyModal-overlay');
			
			// Check if overlay element was found
			if (elmOverlay.length){
				// Close modal on click
				elmOverlay.bind('click', function(){
					//$.cosyModal.hide($('.cosyModal')[0].id);
					$('.cosyModal:visible').cosyModal('hide');
				});
				
				// Set initial CSS for the overlay
				elmOverlay.css({
					display : 'block',
					opacity : 0
				});
				
				// Animate the overlay
				elmOverlay.animate({ opacity : 1 }, modalConfig.showTime, function(){ $(this).show(); });
			}
			
			// Return true
			return true;
		},
		
		hide : function(elmModal){
			// Check if we're animating
			if ($.cosyModal.animating){
				// Return void (there no more to do now)
				return;
			}
			
			// Get modal element
			elmModal = $(elmModal);
			if (!elmModal){
				// Element was not found
				return false;
			}
			
			// Get modal configuration
			modalConfig = elmModal.data('cosyModal');
			if (!modalConfig){
				// Configuration is not set
				return false;
			}
			
			// Trigger "hide" event
			elmModal.trigger('cosyModalHide', [ elmModal[0] ]);
			
			// Set initial CSS for the element
			elmModal.css({
				display : 'block',
				opacity : 1
			});
			
			// Set animation options
			animateOptions = {
				marginTop : -elmModal.outerHeight(true),
				opacity : 0
			};
			
			// We're now animating
			$.cosyModal.animating = true;
			
			// Animate the modal element
			elmModal.animate(animateOptions, modalConfig.hideTime, function(){
				$(this).hide();
				$.cosyModal.animating = false;
				
				// Remove keydown event
				$(document).off('keydown.cosyModal');
				
				// Trigger "hided" event
				$(this).trigger('cosyModalHided', [ this ]);
			});
			
			// Get overlay element
			elmOverlay = $('#cosyModal-overlay');
			// Check if overlay element was found
			if (elmOverlay.length){
				// Set initial CSS for the overlay
				elmOverlay.css({
					display : 'block',
					opacity : 1
				});
				
				// Animate the overlay
				elmOverlay.animate({ opacity : 0.0 }, modalConfig.showTime, function(){ $(this).hide(); });
			}
			
			// Return true
			return true;
		}
	};
	
	// Add jQuery instance methods
	$.fn.extend({
		cosyModal : function(){
			if (typeof(arguments[0]) == 'string'){
				switch (arguments[0]){
					case 'show':
					case 'open':
						return this.each(function(){
							$.cosyModal.show(this);
						});
					break;
					case 'hide':
					case 'close':
						return this.each(function(){
							$.cosyModal.hide(this);
						});
					break;
				}
			}
			else{
				options = arguments[0];
				return this.each(function(){
					$.cosyModal.init(this, options);
				});
			}
		}
	});
	
	// Detect and bind show links
	$(document).ready(function(){
		$('a[rel="modal:show"]').each(function(index, elm){
			if (elm.href.indexOf('#')){
				$(this.href.substr(this.href.indexOf('#'))).cosyModal();
				
				$(this).on('click.cosyModal', function(e){
					e.preventDefault();
					$(this.href.substr(this.href.indexOf('#'))).cosyModal('show');
				});
			}
		});
	});
	
	// Detect and bind hide links
	$(document).ready(function(){
		$('a[rel="modal:hide"]').each(function(index, elm){
			if (elm.href.indexOf('#')){
				$(this).on('click.cosyModal', function(e){
					e.preventDefault();
					$(this.href.substr(this.href.indexOf('#'))).cosyModal('hide');
				});
			}
		});
	});
})(jQuery);