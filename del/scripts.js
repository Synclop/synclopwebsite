function localTime(evt){
	var el = this;
	var time = el.innerHTML;
	var format = el.getAttribute('data-format');
	var m = moment.utc(time,format);
	var _localTime = m.local().format(format);
	el.innerHTML = _localTime;
}

function logCallback(el){
	$('.time',el).each(localTime);
}

/***************** Waypoints ******************/

$(document).ready(function() {

	$('.time').each(localTime);

	$('.wp1').waypoint(function() {
		$('.wp1').addClass('animated fadeInLeft');
	}, {
		offset: '75%'
	});
	$('.wp2').waypoint(function() {
		$('.wp2').addClass('animated fadeInUp');
	}, {
		offset: '75%'
	});
	$('.wp3').waypoint(function() {
		$('.wp3').addClass('animated fadeInDown');
	}, {
		offset: '55%'
	});
	$('.wp4').waypoint(function() {
		$('.wp4').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});
	$('.wp5').waypoint(function() {
		$('.wp5').addClass('animated fadeInUp');
	}, {
		offset: '75%'
	});
	$('.wp6').waypoint(function() {
		$('.wp6').addClass('animated fadeInDown');
	}, {
		offset: '75%'
	});

	(function(){
		var $form = $('#Form')
		,	form_check_url='/form_check'
		,	cached_fields
		,	get_cached_field
		,	check_form,current_field
		,	visited_fields
		,	bypass_visited=false
		,	isValid=true
		,	do_submit = false
		;
		if($form.length){
			cached_fields = {};
			visited_fields = {};
			get_cached_field = function(name){
				var field;
				if(!cached_fields.hasOwnProperty(name)){
					field = $('#id_'+name,$form);
					cached_fields[name] = field.length ? field : false;
				}
				return cached_fields[name];
			};
			$('.form-control',$form).each(function(){get_cached_field(this.name);});
			field_reset = function(field){
				field.siblings('.glyphicon').remove();
				var errors = field.siblings('.alert');
				errors.slideUp(400,function(){errors.remove();});
			};
			field_success = function(field){
				field.parent().removeClass('has-error').addClass('has-success');
				$('<span class="glyphicon glyphicon-ok form-control-feedback"></span>').insertAfter(field);
			};
			field_error = function(field,text){
				field.parent().removeClass('has-success').addClass('has-error');
				$('<div class="alert alert-danger">' + text + '</div>').insertAfter(field).hide().slideDown();
				$('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').insertAfter(field).hide().fadeIn();
			};
			check_form = function(data){
				var i,l,err,field,doCheck,name,fieldWasValid;
				if(!data.valid){
					ìsValid = true;
					for(i=0,l=data.errors.length;i<l;i++){
						err = data.errors[i];
						name = err.name;
						field = get_cached_field(name);
						if(field && (bypass_visited || visited_fields[name])){
							fieldWasValid = field.data('valid');
							doCheck = (err.required || field.val());
							if(doCheck){
								if(err.valid && !fieldWasValid || !err.valid && fieldWasValid){
									field_reset(field);
								}
								if(err.valid){
									field.data('valid',true);
									if(!fieldWasValid){
										field_success(field);
									}
								}else{
									isValid = false;
									field.data('valid',false);
									if(fieldWasValid!==false){
										field_error(field,err.text);
									}
								}
							}
						}
					}
				}else{
					for(i in cached_fields){
						field = cached_fields[i];
						if(!field){continue;}
						doCheck = field.val(); //if the form is valid, then all required fields have been filled, no need to check for required
						if(doCheck){
							field_reset(field);
							field_success(field);
						}
					}
				}
				return isValid;
			};
		
			$form.on('blur','input',function(evt){
				current_field = get_cached_field(this.name);
				if(current_field){
					visited_fields[this.name] = true;
					$.ajax({
						url:form_check_url
					,	data:$form.serialize()
					,	success: check_form
					});
				}
			}).on('submit',function(evt){
				if(do_submit){return true;}
				evt.preventDefault();
				$.ajax({
					url:form_check_url
				,	data:$form.serialize()
				,	success: function(data){
						bypass_visited = true;
						if(check_form(data)){
							do_submit = true;
							$form.submit();
						}
						bypass_visited = false;
					}
				});
				return false;
			});
		}
	})();

});

/***************** Slide-In Nav ******************/

$(window).load(function() {

	$('.nav_slide_button').click(function() {
		$('.pull').slideToggle();
	});

});

/***************** Smooth Scrolling ******************/

$(function() {

	$('a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 2000);
				return false;
			}
		}
	});

});

/***************** Nav Transformicon ******************/

document.querySelector("#nav-toggle").addEventListener("click", function() {
	this.classList.toggle("active");
});

/***************** Overlays ******************/

$(document).ready(function(){
    if (Modernizr.touch) {
        // show the close overlay button
        $(".close-overlay").removeClass("hidden");
        // handle the adding of hover class when clicked
        $(".img").click(function(e){
            if (!$(this).hasClass("hover")) {
                $(this).addClass("hover");
            }
        });
        // handle the closing of the overlay
        $(".close-overlay").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            if ($(this).closest(".img").hasClass("hover")) {
                $(this).closest(".img").removeClass("hover");
            }
        });
    } else {
        // handle the mouseenter functionality
        $(".img").mouseenter(function(){
            $(this).addClass("hover");
        })
        // handle the mouseleave functionality
        .mouseleave(function(){
            $(this).removeClass("hover");
        });
    }
});

/***************** Flexsliders ******************/

$(window).load(function() {

	$('#portfolioSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: false,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

	$('#servicesSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: true,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

	$('#teamSlider').flexslider({
		animation: "slide",
		directionNav: false,
		controlNav: true,
		touch: true,
		pauseOnHover: true,
		start: function() {
			$.waypoints('refresh');
		}
	});

});