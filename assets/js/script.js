//オープニング
var DelayLogo		=	6.5; //ロゴの表示時間(秒)
var DelayBackground	=	5; //背景画像の表示時間(秒)
var svgs			=	{};

$(function () {
	var scenes	=	[1, 2, 3, 4];
	var devices	=	["pc", "sp"];

	for(j in devices) {

		svgs[devices[j]]	=	[];

		for(i in scenes) {
			var scene	=	scenes[i];

			if(scenes[i] == 4 && devices[j] == "sp") {
				continue;
			}
			else if(scenes[i] == 3 && devices[j] == "pc") {
				continue;
			}

			svgs[devices[j]][scene]	=	lottie.loadAnimation({
				container	:	$(".scene"+ scene +" .svg."+ devices[j]).get(0),
				renderer	:	 "svg",
				loop		:	false,
				autoplay	:	false,
				path		:	"/assets/json/"+ devices[j] +"/scene"+ scenes[i] +".json"
			});
		}
	}
});

$(window).on("load", function () {
	$(".scene1 .first").delay(DelayLogo * 1000).fadeOut(function () {
		$(".scene1 .second").fadeIn();
		$("#Header .logo").fadeIn();
	});
});

$(function () {
	var media	=	window.matchMedia("(max-width:768px)");

	//スライダー
	var SlideCurrent	=	0;

	$(".slider").on("init", function(e, slick) {
		$(".number .current").text(slick.currentSlide + 1);
		$(".number .total").text(slick.slideCount);
	}).on("beforeChange", function(e, slick, current, next) {
		$(".current").text(next + 1);

		SlideCurrent	=	next;

		$(".slider .slick-slide").removeClass("active");
		
		if(current == 0 && next == slick.slideCount - 1) {
			$(".slider .slick-slide[data-slick-index=-1]").addClass("active");
		}
		else if(current == slick.slideCount - 1 && next == 0) {
			$(".slider .slick-slide[data-slick-index="+ slick.slideCount +"]").addClass("active");
		}
	});
	
	$(".slider").slick({
		centerMode		:	true,
		centerPadding	:	0,
		arrows			:	false,
	});

	$(".move .prev").on("click", function () {
		$(".slider").slick("slickGoTo", (SlideCurrent - 1));
	});

	$(".move .next").on("click", function () {
		$(".slider").slick("slickGoTo", (SlideCurrent + 1));
	});
	
	if(!media.matches) {
		initPC();

		$(".scene .wrapper").on("wheel", function (e) {
			var delta	=	e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);

			if(delta < 0){
				var scrollHeight	=	$(this).children(".inner").height();
				var scrollPosition	=	$(this).height() + $(this).scrollTop();

				if((scrollHeight - scrollPosition) / scrollHeight >= 0.05) {
					e.stopPropagation();
				}
			} else {
				if($(this).scrollTop() > 0) {
					e.stopPropagation();
				}
			}
		});

		//ホームアニメーション
		function animation() {
			$(".backgrounds.pc div:last-child").delay(DelayBackground * 1000).fadeOut(800, function () {
				$(".backgrounds.pc").prepend($(this).remove().show());

				animation();
			});
		}

		animation();
	}
	else {
		initSP();
	}

	media.addListener(function () {
		if(!media.matches) {
			$(".scene1 .scroll").off("click.init");
			$(window).off("scroll.init");

			initPC();
		}
		else {
			$.scrollify.destroy();
			$("body").css("overflow", "");

			$("#Header .menus li").off("click.init");
			$(".scene1 .scroll").off("click.init");

			initSP();
		}
	});

	function initPC() {
		//スクロール
		var lock	=	false;
		var allow	=	false;
		var current	=	1;
		
		var options	=	{
			section		:	".scene",
			scrollSpeed	:	0,
			scrollbars	:	false,
			updateHash	:	false,
			before		:	function (index, elements) {
				if(!lock) {
					lock	=	true;
					
					$(".scene"+ (index + 1)).stop().css({opacity: "0"});
					$(".scene"+ current).stop().animate({opacity: "0"}, function () {
						$(this).show();
						allow	=	true;
						
						$.scrollify.move(parseInt(index));
					});

					return false;
				}
				else if(allow) {
					allow	=	false;
					
					return true;
				}
				else {
					return false;
				}
			},
			after	:	function (index) {
				if(index == 7) {
					lock	=	false;

					$.scrollify.destroy();
					$("body").css("overflow", "");

					$("html, body").scrollTop($(".scene8").offset().top);
					$(".scene"+ (index + 1)).stop().css({opacity: "0"}).animate({opacity: "1"});
					$("#Header .change").addClass("white");
				}
				else {
					for(var i = 1; i <= 8; i++) {
						$(".scene"+ i).css({opacity: "1"});
					}

					$(".scene"+ (index + 1)).stop().css({opacity: "0"}).animate({opacity: "1"}, function () {
						if(svgs["pc"][index + 1]) {
							svgs["pc"][index + 1].play();
						}
						
						lock	=	false;
						
						$.scrollify.disable();
						$.scrollify.enable();

						for(var i = 1; i <= 8; i++) {
							$(".scene"+ i).css({opacity: 1});
						}
					});
				}

				if(index != 0) {
					$("#Header .logo").show();
				}
				
				if(index == 7) {
					$("#Header .change").addClass("white");
				}
				else {
					$("#Header .change").removeClass("white");
				}

				current	=	index + 1;
			}
		}

		$(window).on('beforeunload', function() {
			$(window).scrollTop(0); 
		});

		$.scrollify(options);

		$(window).on("scroll", function () {
			if($(".scene8").offset().top < $(window).scrollTop() + 10) {
			}
			else {
				$("#Header .change").removeClass("white");

				if($("body").css("overflow") != "hidden") {
					$.scrollify(options);

					for(var i = 1; i <= 8; i++) {
						$(".scene"+ i).css({opacity: 0});
					}
					
					setTimeout(function () {
						for(var i = 1; i <= 8; i++) {
							$(".scene"+ i).animate({opacity: 1});
						}
					}, 500);
					$.scrollify.move(6);
				}
			}
		}).trigger("scroll");

		$("#Header .move").on("click.init", function () {
			var index	=	$(this).attr("data-move");

			if($("body").css("overflow") != "hidden" && index != 7) {
				$.scrollify(options);

				for(var i = 1; i <= 8; i++) {
					$(".scene"+ i).css({opacity: 0});
				}
			}
			
			$.scrollify.move(parseInt(index));
		});

		$(".scene1 .scroll").on("click.init", function () {
			$.scrollify.move(1);
		});

		$(".scene8").on("wheel", function (e) {
			e.stopPropagation();
		});

		if($(".scene2").offset().top <= $(window).scrollTop()) {
			$("#Header .logo").show();
		}

		svgs["pc"][1].play();
	}

	function initSP() {
		$(".scene1 .scroll").on("click.init", function () {
			$("html, body").animate({
				scrollTop	:	$(".scene2").offset().top,
			});
		});

		$(".scene1").css("height", "");
		
		$(window).on("scroll.init", function () {
			for(key in svgs["sp"]) {
				if($(".scene"+ key +" .svg.sp").length != 0) {
					var center	=	$(".scene"+ key +" .svg.sp").offset().top - $(window).innerHeight() / 2;

					if(center <= $(window).scrollTop()) {

						svgs["sp"][key].play();
					}
				}
			}

			for(var i = 7; i >= 1; i--) {
				if($(".scene"+ i).is(":visible")) {
					var center	=	$(".scene"+ i).offset().top - $(window).innerHeight() / 2;

					if(center <= $(window).scrollTop()) {
						var current	=	$(".backgrounds.sp > div:last-child").attr("data-index");

						if(current != i) {
							$(".backgrounds.sp div:last-child").before($(".backgrounds.sp [data-index="+ i +"]").remove());

							$(".backgrounds.sp div:last-child").fadeOut(800, function () {
								$(".backgrounds.sp").prepend($(this).remove().show());
							});
						}

						break;
					}
				}
			}
			
			if($(".scene8").offset().top <= $(window).scrollTop() + ($("#Header").height())) {
				$("#Header .change").addClass("white");
			}
			else {
				$("#Header .change").removeClass("white");
			}
		}).trigger("scroll");
	
		svgs["sp"][1].play();
		
		$("#Header .move").on("click", function () {
			var index	=	parseInt($(this).attr("data-move"));

			$("#Header .menu").removeClass("active");
			$("#Header .menus").stop().slideUp(function () {
				$("html, body").animate({
					scrollTop	:	$(".scene"+ (index + 1)).offset().top,
				});
			});
		});
	}

	//SPメニュー
	$("#Header .menu").on("click", function () {
		$(this).toggleClass("active");

		if($(this).hasClass("active")) {
			$("#Header .menus").stop().slideDown();
			$("#Header .change").removeClass("white");
		}
		else {
			$("#Header .menus").stop().slideUp();

			$(window).trigger("scroll");
		}
	});
	
	//モーダル
	$("a.modal.open").on("click", function () {
		var $target	=	$(this);
		scroll		=	$("html, body").scrollTop();

		var width	=	$("body").innerWidth();

		$("body").css({
			overflow	:	"hidden",
		});

		$("body").css({
			paddingRight	:	$("body").innerWidth() - width,
		});

		$("#Modal .contents").html($target.attr("data-template"));
		$("#Modal").stop().fadeIn().css({
			display	:	"flex",
		});
	});

	$("#Modal.close, #Modal .close").on("click", function () {
		$("#Modal").fadeOut(function () {
			if(media.matches) {
				$("body").css({
					overflow	:	"",
				});
			}
			
			$("body").css({
				paddingRight	:	"",
			});
		});
	});

	$("#Modal .contents").on("click", function (e) {
		if($(e.target).is(":not(.close)")) {
			e.stopPropagation();
		}
	});
});