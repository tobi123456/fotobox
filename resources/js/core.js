var L10N = {};
var photoBooth = (function(){
	config = {};
	// vars
	var public = {},
		loader = $('#loader'),
		startPage = $('#start'),
		countDown = 3,
		//timeToLive = 90000,
		timeToLive = 5000,
		qr = false,
		timeOut,
		saving = false,
		gallery = $('#gallery'),
		processing = false,
		pswp = {},
		timer = null,
		imageList = new Array(),
		resultPage =  $('#result');

	// timeOut function
	public.resetTimeOut = function(){
		//gallery is not implemented
		timeOut = setTimeout(function(){
			console.log("fire timeout");
			//public.openGallery();
			window.location = window.location.origin;
		}, timeToLive);
	}

	// reset whole thing
	public.reset = function(){
		loader.hide();
		clearTimeout(timeOut);
		qr = false;
		$('.qr').html('').hide();
		$('.qrbtn').removeClass('active').attr('style','');
		$('.loading').text('');
		gallery.removeClass('open');
		$('.galInner').hide();
		$('.resultInner').css({'bottom' : '-100px'});
		$('.spinner').hide();
	}

	// init
	public.init = function(options){
		public.l10n();
		public.reset();
		//public.resetTimeOut();
		var w = window.innerWidth;
		var h = window.innerHeight;
		$('#wrapper').width(w).height(h);
		$('.galleryInner').width(w *3);
		$('.galleryInner').height(h);
		$('.galleryInner div').width(w);
		$('.galleryInner').css({'left':-w});
		loader.width(w).height(h);
		$('.stages').hide();
		public.initPhotoSwipeFromDOM('#galimages');

		startPage.show();
		public.pedalLEDOn();
	}

	// Tobias addon
	public.checkPedalStatus = function ()
	{
		$.ajax({
				url: 'get_pedalStatus.php',
				cache: false,
				success:function(result){
					console.log("data=" + result);
					if(result == "true"){
						console.log("take a pic");
						if(!processing){
							public.pedalLEDOff();
							public.reset();
							loader.slideDown('slow','easeOutBounce', function(){
								public.countdown(countDown, $('#counter'));
							});
						}
					} else {
						console.log("take no pic");
						//wait 200ms
						timer = setTimeout(function () {
							public.checkPedalStatus();
						}, 400);
					}
				},
				error : function(xhr, status, error){
					public.errorPic(result);
				}
			});
	}
	
	public.resetPedalStatus = function ()
	{
		clearTimeout(timer);
		
		$.ajax({
				url: 'reset_pedalStatus.php',
				cache: false,
				async : false,
				success:function(result){
					console.log("pedal reset war ok");
					public.checkPedalStatus();
				},
				error : function(xhr, status, error){
					public.errorPic(result);
				}
			});
	}
	
	public.pedalLEDOff = function ()
	{
			$.ajax({
				url: 'set_pedalLed.php?action=off',
				cache: false,
				async : false,
				success:function(result){
					console.log("pedal LED set off ok");
				},
				error : function(xhr, status, error){
					public.errorPic(result);
				}
			});
	}
	
	public.pedalLEDOn = function ()
	{
			$.ajax({
				url: 'set_pedalLed.php?action=on',
				cache: false,
				async : false,
				success:function(result){
					console.log("pedal LED set on ok");
				},
				error : function(xhr, status, error){
					public.errorPic(result);
				}
			});
	}
	
	// check for resizing
	public.handleResize = function(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		$('#wrapper').width(w).height(h);
		$('#loader').width(w).height(h);
	}

	public.l10n = function(elem){
		elem = $(elem || 'body');
		elem.find('[data-l10n]').each(function(i,item){
			item = $(item);
			item.html(L10N[item.data('l10n')]);
		});
	}

	// Cheese
	public.cheese = function() {
		$('#counter').text('');
	  	$('.loading').html(L10N.cheese);
	  	public.takePic();
	}

	// take Picture
	public.takePic = function(){
		processing = true;
		setTimeout(function () {
			$('#counter').text('');
			$('.spinner').show();
		    $('.loading').html(L10N.busy);
		}, 1000);
		$.ajax({
            url: 'takePic.php',
            dataType : "json",
            cache: false,
            success:function(result){
				//console.log(result);
				//alert("stopp");
            	if(result.error){
            		public.errorPic(result);
            	} else {
            		public.renderPic(result);
            	}
            },
            error : function(xhr, status, error){
            	public.errorPic(result);
            }
        });
	}

	// Show error Msg and reset
	public.errorPic = function(result){
		setTimeout(function () {
			$('.spinner').hide();
			public.resetPedalStatus();
			$('.loading').html(L10N.error + '<br /><a class="btn" href="/">'+L10N.reload+'</a>');
			setTimeout(function () {
			//after 2 second the error message is hidden again and reload page
				console.log("reload page");
				window.location = window.location.origin;
				
			}, 3000);
		}, 1100);
	}

	// Render Picture after taking
	public.renderPic = function(result){
		// Add QR Code Image
//		$('.qr').html('');
//		$('<img src="qrcode.php?filename='+result.img+'"/>').load(function(){
//			$(this).appendTo($('.qr'));
//			$('<p>').html(L10N.qrHelp).appendTo($('.qr'));
//		});

//		// Add Image to gallery and slider
//		public.addImage(result.img);

		// Add Image
		$('<img src="get_image.php?name='+ result.img +'&type=image" class="original">').load(function() {
		$('#result').css({'background-image' : 'url(get_image.php?name='+ result.img +'&type=image)'});
			startPage.fadeOut(400, function(){
				resultPage.fadeIn(400, function(){
					setTimeout(function () {
						processing = false;
					    loader.slideUp('fast');
						public.pedalLEDOn();
						public.resetPedalStatus();
					}, 400);
					setTimeout(function () {
						$('.resultInner').stop().animate({
							'bottom': '50px'
						}, 400).removeClass('hidden');
					}, 400);
					clearTimeout(timeOut);
					public.resetTimeOut();
				});
			});
		});
	}

//	// add image to Gallery
//	public.addImage = function(image){
//		$('<a>').html('<img src="get_image.php?name='+ image +'&type=thumb" />').data('size','1920x1280').attr('href','/fotoBoothImages/'+image+'?new=1').appendTo($('#galimages'));
//	}

	// Open Gallery Overview
	//public.openGallery = function(elem) {
	public.openGallery = function() {
		
	//get image list
		$.ajax({
		url: 'get_images.php',
		cache: false,
		async : false,
		success:function(imageListStr){
			console.log("get images ok" + imageListStr);
			imageList = imageListStr.split("\n");
			
				  //display galery
			  var pos = new Object();
			  pos.left = 0;
			  pos.top = 0;
			  gallery.css({
				'left': pos.left,
				'top' : pos.top
			  })
			  .data('left', pos.left)
			  .data('top', pos.top)
			  .addClass('open')
			  .animate({
				'width':'102%',
				'height':'100%',
				'top':0,
				'left': 0
			  },300, function(){
				$('.galInner').show();
				gallery.css({'overflow-y': 'scroll'});
			  });
			//display first image
			$('#galimages').html('<img src="get_image.php?name='+ imageList[0] +'&type=thumb" />');
			
			//display infobox
			}
		});
	}

	$(window).resize(public.handleResize);

	// Open QR Code in Gallery

//	// Take Picture Button
//	$('.takePic, .newpic').click(function(e){
//		e.preventDefault();
//		var target = $(e.target);
//		if(target.hasClass('gallery')){
//		  public.openGallery(target);
//		} else {
//  		if(!processing){
//  			public.reset();
//  			loader.slideDown('slow','easeOutBounce', function(){
//  				public.countdown(countDown, $('#counter'));
//  			});
//  		}
//    }
//	});

//	// Open Gallery Button
//	$('#result .gallery, #start .gallery').click(function(e){
//		e.preventDefault();
//		public.openGallery($(this));
//	});

	// Close Gallery Overview
	$('.close_gal').click(function(e){
		e.preventDefault();
		$('.galInner').hide();
		gallery.css({'overflow-y': 'visible'});
		$('#gallery').animate({
			'width':'200px',
	        'height':'70px',
	        'left': $('#gallery').data('left'),
	        'top': $('#gallery').data('top')
		},300, function(){
        $('#gallery').removeClass('open');
      });
	});

	$('.tabbox ul li').click(function(){
		var elem = $(this),
			target = $('.'+elem.data('target'));
			if(!elem.hasClass('active')){
				$('.tabbox ul li').removeClass('active');
				$('.tab').removeClass('active');
				elem.addClass('active');
				target.addClass('active');
			}
	});
//	// QR in gallery
//	$(document).on('click', '.gal-qr-code', function(e){
//		e.preventDefault();
//
//		var pswpQR = $('.pswp__qr');
//		if(pswpQR.hasClass('qr-active')){
//			pswpQR.removeClass('qr-active').fadeOut('fast');
//		} else {
//			pswpQR.empty();
//			var img = pswp.currItem.src;
//			img = img.replace('/fotoBoothImages/','');
//			$('<img>').attr('src','qrcode.php?filename='+img).appendTo(pswpQR);
//
//			pswpQR.addClass('qr-active').fadeIn('fast');
//		}
//	});

//	$('#result').click(function(e){
//		var target = $(e.target);
//
//		// Menü in and out
//		if (!target.hasClass('qrbtn') && target.closest('.qrbtn').length == 0 && !target.hasClass('newpic') && !target.hasClass('resetBtn') && !target.hasClass('gallery') && qr != true && !target.hasClass('homebtn')){
//			if($('.resultInner').hasClass('hidden')) {
//				$('.resultInner').stop().animate({
//					'bottom': '50px'
//				}, 400).removeClass('hidden');
//			} else {
//				$('.resultInner').stop().animate({
//					'bottom': '-100px'
//				}, 400).addClass('hidden');
//			}
//		}
//
//		if(qr && !target.hasClass('qrbtn')) {
//			$('.qrbtn').removeClass('active');
//			$('.qr').hide();
//			$('.qrbtn').animate({
//				'width' : 200,
//				'height' : 70,
//				'left' : 205,
//				'margin-left': 0,
//				'top' : 0
//			}, 250 );
//			qr = false;
//		}
//
//		// Go to Home
//		if(target.hasClass('homebtn')){
//			window.location = window.location.origin;
//		}
//
//		// Qr in and out
//		if(target.hasClass('qrbtn') || target.closest('.qrbtn').length > 0){
//			if(qr) {
//				$('.qrbtn').removeClass('active');
//				$('.qrbtn').animate({
//					'width' : 200,
//					'height' : 70,
//					'left' : 205,
//					'margin-left': 0,
//					'top' : 0
//				}, 250 );
//				qr = false;
//			} else{
//				qr = true;
//				$('.qrbtn').addClass('active');
//
//				$('.qrbtn').animate({
//					'width' : 500,
//					'height' : 600,
//					'left' : '50%',
//					'margin-left': -265,
//					'top' : - 625
//				}, 250, function(){
//					$('.qr').fadeIn('fast');
//				});
//			}
//		}
//	});

//	// Show QR Code
//	$('.qrbtn').click(function(e){
//		e.preventDefault();
//	});
//
//	$('.homebtn').click(function(e){
//		e.preventDefault();
//	});

	// Countdown Function
	public.countdown = function(calls, element){
		count = 0;
		current = calls;
		var timerFunction =  function () {
	    element.text(current);
	    current --;
	    TweenLite.to(element, 0.0, {
			scale : 8,
			opacity: 0.2
		});
		TweenLite.to(element, 0.75, {
			scale : 1,
			opacity: 1
		});

	    if (count < calls) {
	      window.setTimeout(timerFunction, 1000);
	    } else {
	      public.cheese();
	    }
	     count++;
	  };
	  timerFunction();
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	////// PHOTOSWIPE FUNCTIONS /////////////////////////////////////////////////////////////

	public.initPhotoSwipeFromDOM = function(gallerySelector){

		// select all gallery elements
		var galleryElements = document.querySelectorAll( gallerySelector );
		for(var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i+1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = public.photoswipeParseHash();
		if(hashData.pid > 0 && hashData.gid > 0) {
			public.openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
		}
	}

	var onThumbnailsClick = function(e) {
	    e = e || window.event;
	    e.preventDefault ? e.preventDefault() : e.returnValue = false;

	    var eTarget = e.target || e.srcElement;

	    var clickedListItem = closest(eTarget, function(el) {
	        return el.tagName === 'A';
	    });

	    if(!clickedListItem) {
	        return;
	    }

	    var clickedGallery = clickedListItem.parentNode;

	    var childNodes = clickedListItem.parentNode.childNodes,
	        numChildNodes = childNodes.length,
	        nodeIndex = 0,
	        index;

	    for (var i = 0; i < numChildNodes; i++) {
	        if(childNodes[i].nodeType !== 1) {
	            continue;
	        }

	        if(childNodes[i] === clickedListItem) {
	            index = nodeIndex;
	            break;
	        }
	        nodeIndex++;
	    }

	    if(index >= 0) {
	        public.openPhotoSwipe( index, clickedGallery );
	    }
	    return false;
	};

	public.photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
	    params = {};

	    if(hash.length < 5) { // pid=1
	        return params;
	    }

	    var vars = hash.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        if(!vars[i]) {
	            continue;
	        }
	        var pair = vars[i].split('=');
	        if(pair.length < 2) {
	            continue;
	        }
	        params[pair[0]] = pair[1];
	    }

	    if(params.gid) {
	    	params.gid = parseInt(params.gid, 10);
	    }

	    if(!params.hasOwnProperty('pid')) {
	        return params;
	    }
	    params.pid = parseInt(params.pid, 10);
	    return params;
	};

	// Get Items for Photoswipe Gallery
	public.parseThumbnailElements = function(el) {
	    var thumbElements = el.childNodes,
	        numNodes = thumbElements.length,
	        items = [],
	        el,
	        childElements,
	        thumbnailEl,
	        size,
	        item;

	    for(var i = 0; i < numNodes; i++) {
	        el = thumbElements[i];

	        // include only element nodes
	        if(el.nodeType !== 1) {
	          continue;
	        }

	        childElements = el.children;
	        size = $(el).data('size').split('x');

	        // create slide object
	        item = {
				src: el.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				author: el.getAttribute('data-author')
	        };

	        item.el = el; // save link to element for getThumbBoundsFn

	        if(childElements.length > 0) {
	          item.msrc = childElements[0].getAttribute('src'); // thumbnail url
	          if(childElements.length > 1) {
	              item.title = childElements[1].innerHTML; // caption (contents of figure)
	          }
	        }


			var mediumSrc = el.getAttribute('data-med');
          	if(mediumSrc) {
            	size = el.getAttribute('data-med-size').split('x');
            	// "medium-sized" image
            	item.m = {
              		src: mediumSrc,
              		w: parseInt(size[0], 10),
              		h: parseInt(size[1], 10)
            	};
          	}
          	// original image
          	item.o = {
          		src: item.src,
          		w: item.w,
          		h: item.h
          	};

	        items.push(item);
	    }

	    return items;
	};

	public.openPhotoSwipe = function(index, galleryElement, disableAnimation) {
	    var pswpElement = document.querySelectorAll('.pswp')[0],
	        gallery,
	        options,
	        items;

		items = public.parseThumbnailElements(galleryElement);

	    // define options (if needed)
	    options = {
	        index: index,

	        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

	        getThumbBoundsFn: function(index) {
	            // See Options->getThumbBoundsFn section of docs for more info
	            var thumbnail = items[index].el.children[0],
	                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	                rect = thumbnail.getBoundingClientRect();

	            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	        },
	        shareEl: false,
	        zoomEl: false,
	        fullscreenEl: false,
	        addCaptionHTMLFn: function(item, captionEl, isFake) {
				if(!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
				return true;
	        }

	    };

		var radios = document.getElementsByName('gallery-style');
		for (var i = 0, length = radios.length; i < length; i++) {
		    if (radios[i].checked) {
		        if(radios[i].id == 'radio-all-controls') {

		        } else if(radios[i].id == 'radio-minimal-black') {
		        	options.mainClass = 'pswp--minimal--dark';
			        options.barsSize = {top:0,bottom:0};
					options.captionEl = false;
					options.fullscreenEl = false;
					options.shareEl = false;
					options.bgOpacity = 0.85;
					options.tapToClose = true;
					options.tapToToggleControls = false;
		        }
		        break;
		    }
		}

	    if(disableAnimation) {
	        options.showAnimationDuration = 0;
	    }

	    // Pass data to PhotoSwipe and initialize it
	    pswp = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

	    // see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
		    useLargeImages = false,
		    firstResize = true,
		    imageSrcWillChange;

		pswp.listen('beforeResize', function() {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
		    realViewportWidth = pswp.viewportSize.x * dpiRatio;


		    if(realViewportWidth >= 1200 || (!pswp.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
		    	if(!useLargeImages) {
		    		useLargeImages = true;
		        	imageSrcWillChange = true;
		    	}

		    } else {
		    	if(useLargeImages) {
		    		useLargeImages = false;
		        	imageSrcWillChange = true;
		    	}
		    }

		    if(imageSrcWillChange && !firstResize) {
		        pswp.invalidateCurrItems();
		    }

		    if(firstResize) {
		        firstResize = false;
		    }

		    imageSrcWillChange = false;

		});

		pswp.listen('gettingData', function(index, item) {
		    if( useLargeImages ) {
		        item.src = item.o.src;
		        item.w = item.o.w;
		        item.h = item.o.h;
		    } else {
		        item.src = item.m.src;
		        item.w = item.m.w;
		        item.h = item.m.h;
		    }
		});

		pswp.listen('beforeChange', function() {
			$('.pswp__qr').removeClass('qr-active').fadeOut('fast');
		});

		pswp.listen('close', function() {
			$('.pswp__qr').removeClass('qr-active').fadeOut('fast');
		});

	    pswp.init();


	};

	// find nearest parent element
	var closest = function closest(el, fn) {
	    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};
	//////////////////////////////////////////////////////////////////////////////////////////


//	// clear Timeout to not reset the gallery, if you clicked anywhere
//	$(document).click(function(event) {
//		if(startPage.is(':visible')){
//
//		}else {
//			clearTimeout(timeOut);
//			public.resetTimeOut();
//		}
//	});
/// Disable Right-Click
//if(!isdev){
//	$(this).bind("contextmenu", function(e) {
//       e.preventDefault();
//   });
//

	return public;
})();

// Init on domready
$(function(){
	photoBooth.init();
});

