$(document).ready(function(){

	window.scrollTo(0, 1);

	//These store different elements of an item being manipulated
	//So that items can be references across anonymous setTimeout functions
	var v = {};
	v.$itemMod = null;
	v.$item = null;
	v.$itemInput = null;
	v.$itemModClone = null;
	v.$itemColorPicker = null;

	//These variables store the number of incomplete items before / after an item
	//As a reference to calculate the distance an item needs to move to be completed or un-completed
	var afterCount, beforeCount;

	//Variable stores the gesture event
	var releasePoint;

	//The spacer is placed (and maintained) between incomplete and complete items
	var spacer = $('#spacer');
	var hanger = $('.hanger');
	var newItemTop = $('.body').children('#new-item-top');
	var bodyClasses = $('body, .mod');

	//These booleans get set and unset throughout functions
	//So that we can ensure only one gestural reaction can happen at a time
	var wait = true;
	var focus = false;
	var itemMotion = false; 
	var scroll = false;
	var opensub = false;
	

	var itemModTemplate = $('#item-mod-template .item-mod');
	
	//Don't let anything happen right when the page loads.
	//Command+R to refresh would register as a keydown event.
	setTimeout(function(){
		wait = false;
	}, 100);

	setTimeout(function(){
		$('.item-mod').eq(1).find('.item').addClass('bounce-once');
	}, 500);

	setTimeout(function(){
		$('.bounce-once').removeClass('bounce-once');
	}, 1500);

	// Pull to Create Task - Drag Events
	$(document).hammer({drag_min_distance: 0}).on('drag', '.mod', function(event){
		if ( opensub == true ) { return; }
		
		if (event.gesture.deltaY > 65 ) {
			console.log("after "+event.gesture.deltaY);
			newItemTop.find('input').val('Release to Create Item');
			$('.body').css('margin-top', ((event.gesture.deltaY) - 65)+"px");
			newItemTop.css('height', "65px");
		} else {
				//$(window).scrollTop(0);
				newItemTop.css('height', event.gesture.deltaY+"px");
				newItemTop.find('.item')
				.css('background-color', 'hsl(14, 80%, '+((event.gesture.deltaY)-10)+'%)')
				.css('border-color', 'hsl(14, 80%, '+((event.gesture.deltaY)-24)+'%)');
				newItemTop.find('input').val('Pull to Create Task');
				newItemTop.css('-webkit-transform', 'rotateX('+(90-(((event.gesture.deltaY)/65)*90))+'deg)');
			}
			if (event.gesture.deltaY > 20 || event.gesture.deltaY < -20) {
				scroll = true;
			}
		});

	// Pull to Create Task - Drag End Events
	$(document).hammer({drag_min_distance: 0}).on('dragend', '.mod', function(event){
		if ( opensub == true ) { return; }
		
		if (event.gesture.deltaY > 65 ) {
			$('.body').addClass('slide-back').css('margin-top','0px');
			newItemTop.css('height', "0px");
			$('.mod').prepend(itemModTemplate.clone());
			
			$('.item-mod.new input').focus();
			$('.mod .item-mod.new').removeClass('new');
			setTimeout(function() {
				$('.body').removeClass('slide-back');
			}, 200);
		} else {
			newItemTop
			.addClass('animate-back')
			.css('height', "0px")
			.css('-webkit-transform', 'rotateX(90deg)');
			setTimeout(function() {
				newItemTop
				.removeClass('animate-back')
				.attr('style','');
			}, 100);
		}
		scroll = false;
	});


	// Drag Item X - Drag Events
	$(document).hammer({drag_block_vertical: false}).on('drag', '.item-mod', function(event){
		if ( itemMotion == true ) { return; }
		if ( scroll == true ) { return; }
		if ( opensub == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemColorPicker = v.$itemMod.find('.colorpicker');
		v.$itemInput = $(this).find('.item').find('input');

		var dragX = event.gesture.deltaX;
		//console.log(dragX);
		v.$item.css('margin-left',dragX+'px');

		if ( event.gesture.deltaY > 15 || event.gesture.deltaY < -15 ) {
			dragX = 0;
		}

		var dragY = event.gesture.deltaY;
		v.$item.css('margin-left',dragX+'px');
		 // console.log(dragX);
		//If item is not done...
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			 // console.log(dragX);
			//If scroll enters the done position
			if ( dragX > 111 ) {
				v.$itemMod
				.css('background-position-x', (dragX-111)+"px")
				.addClass('check');
				v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
				v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
				v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			//orange
		} else if (dragX > 40 &&dragX < 70){
			console.log("cube1");
			v.$itemColorPicker.find('.cube1').css('border','2px solid white');
			v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#ed7c5b');
			v.$item.css('border-bottom-color','#ca4016');
			//blue
		}else if (dragX >= 70 &&dragX < 90){
			v.$itemColorPicker.find('.cube2').css('border','2px solid white');
			v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube3').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#88bddb');
			v.$item.css('border-bottom-color','#3b92c4');
			//green
		}else if (dragX >= 90 &&dragX < 111){
			v.$itemColorPicker.find('.cube3').css('border','2px solid white');
			v.$itemColorPicker.find('.cube1').css('border','2px solid #e7dfd0');
			v.$itemColorPicker.find('.cube2').css('border','2px solid #e7dfd0');
			v.$item.css('background-color','#40837a');
			v.$item.css('border-bottom-color','#1e3e39');
		//If scroll enters the clear position
	}else if ( dragX < -111 ) {
		v.$itemMod.css('background-position-x', (dragX+111)+"px");

			//Anywhere in between
		} else {
			v.$itemMod
			.css('background-position-x', '0px')
			.removeClass('check');
		}
		//If item is done
	} else {
			//If scroll enters the un-do position
			if ( dragX > 55 ) {
				v.$itemMod
				.css('background-position-x', (dragX-111)+"px")
				.removeClass('done');

			//If scroll enters the clear position
		} else if ( dragX < -55 ) {
			v.$itemMod.css('background-position-x', (dragX+111)+"px");
			//Anywhere in between
		} else {
			v.$itemMod
			.css('background-position-x', '0px')
			.addClass('done');
				//v.$itemInput.prop('disabled', true);
			}
		}

	});//eo touchmove

	// Clears leftover styles on items when dragging begins
	$(document).hammer().on('dragstart', '.item-mod', function(){
		$(this).attr('style','');
	});

	// Creates an extra reference for items that were done
	// And that soon might be manipulated
	$(document).hammer().on('dragstart', '.item-mod.done', function(){
		$(this).addClass('was-done');
	});

	// Drag Item X - Drag End Events
	$(document).hammer().on('dragend', '.item-mod', function(event){
		if ( scroll == true ) { return; }
		if ( opensub == true ) { return; }
		v.$itemMod = $(this);
		v.$item = v.$itemMod.find('.item');
		v.$itemInput = $(this).find('.item').find('input');

		releasePoint = event.gesture.deltaX;

		//If item is not done
		if (!v.$itemMod.hasClass('done') && !v.$itemMod.hasClass('was-done')) {
			v.$itemMod.attr('style','');
			//And release point is in the 'done' zone
			if ( releasePoint > 111 ) {
				itemMotion = true;
				v.$item
				.addClass('slide-back')
				.css('margin-left','0px');
				afterCount = v.$itemMod.nextAll().not('.done').length;
				// v.$itemColorPicker.css('display','none');
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");
				//Delay for item to momentum-scroll back, then do the move
				setTimeout( function(){
					v.$itemColorPicker.css('display','none');
					v.$item.removeClass('slide-back');
					v.$itemMod
					.css('background-image','none')
					.addClass('done')
					.removeClass('check');
					v.$itemModClone = v.$itemMod.clone();
					v.$itemModClone
					.insertAfter(v.$itemMod)
					.addClass('shrink');
					spacer.addClass('make-space');
					v.$itemMod
					.addClass('remove')
					.css('-webkit-transform', 'translate(0px,'+((afterCount-1)*65)+'px)');
				},200 );
				//Delay for another 0.5s for item move to occur, then clean up the leftovers
				setTimeout(function() {
					v.$itemModClone
					.insertAfter(spacer)
					.removeClass('shrink');
					v.$itemMod.hide().remove();
					spacer.removeClass('make-space');
					
					itemMotion = false;
				}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				},200 );
			}
		//If item is done
	} else {
			//And release point is in the un-do position
			if ( releasePoint > 55 ) {
				itemMotion = true;
				v.$item
				.addClass('slide-back')
				.css('margin-left','0px');
				beforeCount = v.$itemMod.prevAll('.done').length;
				v.$itemMod.css('background-position-x', ((-60)-($(this).scrollLeft()))+"px");

				setTimeout( function(){
					v.$itemColorPicker.css('display','inline');
					v.$item.removeClass('slide-back');
					v.$itemMod.removeClass('done was-done check');
					spacer.addClass('make-space');
					v.$itemModClone = v.$itemMod.clone();
					v.$itemModClone
					.insertAfter(v.$itemMod)
					.addClass('shrink');
					v.$itemMod
					.addClass('remove')
					.css('-webkit-transform', 'translate(0px,'+(-(beforeCount+1)*65)+'px)');
				}, 200);
				
				setTimeout(function() {
					v.$itemModClone.insertBefore(spacer).removeClass('shrink');
					v.$itemMod.hide().remove();
					spacer.removeClass('make-space');
					itemMotion = false;

				}, 600);
			} else {
				itemMotion = true;
				v.$item.addClass('slide-back').css('margin-left','0px');
				setTimeout( function(){
					v.$item.removeClass('slide-back');
					itemMotion = false;
				}, 200);
			}
		} //eo if item is done / not done

		//No matter what, if release point is in the clear position
		if ( releasePoint < -55 ) {
			itemMotion = true;
			v.$itemMod.find('.colorpicker').css('margin-left','-100px');
			v.$itemMod.css('background-image', 'none');
			v.$item
			.addClass('slide-out')
			.css('margin-left','-320px');
			v.$itemMod.addClass('shrink-after gone');
			setTimeout(function() {
				v.$itemMod.remove();
				itemMotion = false;
			}, 400);
		}

		
		
	});




	// A doubletap on an item triggers focus on the input within that item
	$(document).hammer().on('doubletap', '.item', function(){
		if ( focus == true || $(this).parent().hasClass('done') ) { return; }
		$(this).find('input').removeAttr("disabled").focus();
		$(this).closest('.item-mod').addClass('focus');
		bodyClasses.addClass('focus');
	});

	var subModTemplate = $('#sub-mod-template .sub-mod');
	
	$(document).hammer().on('tap', '.option', function(){
		
		//console.log($(this).closest('.item-mod').children('.sub-mod').length);
		
		var hassub = $(this).closest('.item-mod').children('.sub-mod').length;
		var subheight = $(this).closest('.item-mod').find('.sub-mod').height();
		var mod = $(this).closest('.item-mod');
		var submod = $(this).closest('.item-mod').find('.sub-mod');
	    //$(this).closest('.item-mod').find('.sub-mod').css('background-color','red');
	    //$(this).closest('.item-mod').find('.sub-mod').find('.sub-item-mod').css('background-color','red');
	    if (hassub<=0){
	    	console.log('sub');
		// get the current item mod and put it on the top
		var itemMod = $(this).closest('.item-mod');
		
		//clone the sub mode and attach to the current item mod
		var cloned = subModTemplate.clone();
		console.log(cloned);
		cloned.insertAfter(itemMod.find('.item'));
		//move it under the current item mod
		cloned.css('margin-top','-72');

		//drop down animation
		setTimeout(function() {
			cloned.addClass('slide-back').css('margin-top','0px');
		}, 100);
		//make the add buttom clickable.
		setTimeout(function() {
			cloned.find('.sub-item-mod').css('z-index','1');
			cloned.removeClass('slide-back');
			mod.addClass('open');
			cloned.find('input').focus();
			opensub=true;
		}, 300);
		
	}
	else{
		//close the sub
		if (mod.hasClass('open')){
			console.log('slide-back');
			submod.css('z-index','-2');
			submod.find('.sub-item-mod').css('z-index','-2');
			submod.addClass('slide-back').css('margin-top',-(subheight)+'px');
			setTimeout(function() {
				console.log('remove slide-back');
				console.log(submod);
				submod.removeClass('slide-back');
			}, 200);
			setTimeout(function() {
				submod.css('display','none');
				mod.removeClass('open');
				opensub=false;
			}, 300);
			//open the sub
		}else if (!mod.hasClass('open')){
			submod.css('display','block');
			submod.addClass('slide-back').css('margin-top','0px');
			mod.addClass('open');
			submod.css('z-index','3');
			
			setTimeout(function(){
				submod.removeClass('slide-back');
				submod.find('.sub-item-mod').css('z-index','3');
				opensub=true;
			},200)
		}
	}
});
$(document).hammer().on('tap', '.sub-item-mod-add', function(){
	console.log('add buttom');
	var cloned = subModTemplate.find('#content').clone();
	console.log(cloned);
	
	var itemMod = $(this).closest('.sub-item-mod').find('.sub-item').last();
	//console.log($(this).closest('.sub-item-mod').children().length);

	cloned.insertAfter(itemMod);
	cloned.css('margin-top','-45');
	setTimeout(function() {
		cloned.addClass('slide-back').css('margin-top','0px');
	}, 100);
	setTimeout(function() {
		cloned.removeClass('slide-back');
		cloned.find('input').focus();
	}, 300);
});
$(document).hammer().on('tap', '.delete', function(){
	console.log('delete');
	var sub = $(this).closest('.sub-item');
	sub.addClass('slide-back').css('margin-left','-220px');
	
	setTimeout(function(){
		sub.removeClass('slide-back');
		sub.find('.delete').css('height','0px');
		sub.find('input').css('height','0px');
		sub.css('padding','0px');
		sub.css('height','0px');
	},200);
	setTimeout(function(){
		//sub.remove()
	},600);
	
});
//double tap on the sub to edit it
$(document).hammer().on('doubletap', '.sub-item input', function(){
	console.log($(this).find('input'));
	//$(this).find('input').focus();
	$(this).removeAttr("disabled").focus();
});

	// Whenever focus on an input occurs, add some reference classes
	// So we know that an item is currently being edited
	$(document).on('focus','input',function(){
		bodyClasses.addClass('focus');
		$(this).closest('.item-mod').addClass('focus');
	});

	// Whenever an item is done being edited, close everything up.
	// If the item has no contents, trash it.
	$(document).on('blur','input', function(){
		// var hanger = $('.hanger');
		var itemMod = $(this).closest('.item-mod');
		// hanger.css('-webkit-transform','rotateX(-90deg)');
		$(this).attr("disabled", "disabled");
		bodyClasses.removeClass('focus');
		itemMod.removeClass('focus');
		// hanger.attr('style','');
		var value = $(this).val();
		if (value == "" || value == 0) {
			// itemMod
			// 	.css('-webkit-overflow-scrolling','none')
			// 	.css('background-image', 'none')
			// 	.addClass('transition')
			// 	.addClass('shrink-after gone');
			// itemMod.find('.item')
			// 	.css('left', releasePoint+'px')
			// 	.css('position','absolute')
			// 	.addClass('slide-out')
			// 	.css('margin-left','-320px')
			// 	.addClass('shrink-after gone');
			// setTimeout(function() {
			// 	itemMod.remove();
			// 	// hanger.attr('style','');
			// 	focus = false;
			// }, 400);
} else {
	setTimeout(function() {
				// hanger.attr('style','');
				focus = false;
			}, 400);
}
});

	// When ENTER key is pressed, lock up the input. (Triggers blur event)
	$(document).on('keyup', 'input', function (e) {
		if (e.keyCode == 13) {
			$(this).attr("disabled", "disabled").blur();
		}
	});

	// If a valid char keyCode is struck, create a new item.
	// Currently buggy if you start typing too fast.
	$(document).on('keyup',function(e){
		if (wait == true || focus == true) { return; }
		var keycode = e.keyCode;
		var valid = 
	        (keycode > 47 && keycode < 58)   || // number keys
	        (keycode > 64 && keycode < 91)   || // letter keys
	        (keycode > 95 && keycode < 112) // numpad keys
	        if (!bodyClasses.hasClass('focus') && valid) {
	        	$('#new-item-trigger').trigger('tap');
	        	wait = true;
	        	setTimeout(function() {
	        		$('.item-mod.focus').find('.item').find('input').val(String.fromCharCode(e.which));
	        		wait = false;
	        	}, 400);
	        } else if (bodyClasses.hasClass('focus') && e.keyCode == 27) {
	        	$('.item-mod.focus').find('input').val('').blur();
	        }
	    });


});