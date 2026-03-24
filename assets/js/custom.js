(function ($) {
	
	"use strict";

	// Theme toggle (dark/light)
	(function initTheme() {
		var savedTheme = localStorage.getItem('theme') || 'dark';
		document.documentElement.setAttribute('data-theme', savedTheme);
		updateThemeIcon(savedTheme);
	})();

	function updateThemeIcon(theme) {
		var iconDesktop = document.querySelector('.theme-icon');
		var iconMobile = document.querySelector('.theme-icon-mobile');
		var btnDesktop = document.getElementById('theme-toggle');
		var btnMobile = document.getElementById('theme-toggle-mobile');
		var iconClass = theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o';
		var titleText = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

		if (iconDesktop) {
			iconDesktop.className = 'fa theme-icon ' + iconClass;
		}
		if (iconMobile) {
			iconMobile.className = 'fa theme-icon-mobile ' + iconClass;
		}
		if (btnDesktop) {
			btnDesktop.title = titleText;
		}
		if (btnMobile) {
			btnMobile.title = titleText;
		}
	}

	$(document).on('click', '#theme-toggle, #theme-toggle-mobile', function() {
		var html = document.documentElement;
		var current = html.getAttribute('data-theme') || 'dark';
		var next = current === 'dark' ? 'light' : 'dark';
		html.setAttribute('data-theme', next);
		localStorage.setItem('theme', next);
		updateThemeIcon(next);
	});

	// Tabs / Accordion (accordion on mobile, tabs on desktop)
	$(function() {
		var currentTabsMode = null;

		function initTabsAccordion() {
			var isMobile = $(window).width() < 992;
			var nextMode = isMobile ? 'mobile' : 'desktop';
			var $wrapper = $('.tabs-accordion-wrapper');
			var $items = $wrapper.find('.tab-accordion-item');
			var $triggers = $wrapper.find('.tab-trigger');
			var $panels = $wrapper.find('.tab-panel');

			// Prevent collapsing open mobile panel on resize/scroll jitter
			if (currentTabsMode === nextMode) {
				return;
			}
			currentTabsMode = nextMode;

			if (isMobile) {
				// Mobile: accordion - content appears under each tab
				$panels.hide().attr('aria-hidden', 'true');
				$triggers.attr('aria-expanded', 'false');
				$items.removeClass('ui-tabs-active');

				function handleTriggerClick(e) {
					e.preventDefault();
					var $item = $(this).closest('.tab-accordion-item');
					var $panel = $item.find('.tab-panel');
					var isOpen = $panel.is(':visible');

					$panels.slideUp(200).attr('aria-hidden', 'true');
					$triggers.attr('aria-expanded', 'false');
					$items.removeClass('ui-tabs-active');

					if (!isOpen) {
						$panel.slideDown(200).attr('aria-hidden', 'false');
						$(this).attr('aria-expanded', 'true');
						$item.addClass('ui-tabs-active');
					}
				}

				$triggers.off('click.tabsAccordion keydown.tabsAccordion')
					.on('click.tabsAccordion', handleTriggerClick)
					.on('keydown.tabsAccordion', function(e) {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							$(this).trigger('click');
						}
					});
			} else {
				// Desktop: tabs - triggers in left column, panels in right
				$panels.show().attr('aria-hidden', 'false');
				$triggers.off('click.tabsAccordion keydown.tabsAccordion');

				$triggers.on('click', function(e) {
					e.preventDefault();
					var $item = $(this).closest('.tab-accordion-item');
					var $targetPanel = $item.find('.tab-panel');

					$panels.hide().attr('aria-hidden', 'true');
					$targetPanel.show().attr('aria-hidden', 'false');
					$items.removeClass('ui-tabs-active');
					$item.addClass('ui-tabs-active');
				});

				// Show first panel by default
				$panels.hide().attr('aria-hidden', 'true');
				$items.removeClass('ui-tabs-active');
				$items.first().addClass('ui-tabs-active').find('.tab-panel').show().attr('aria-hidden', 'false');
			}
		}

		initTabsAccordion();
		$(window).on('resize', function() { initTabsAccordion(); });
	});

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	$('.schedule-filter li').on('click', function() {
        var tsfilter = $(this).data('tsfilter');
        $('.schedule-filter li').removeClass('active');
        $(this).addClass('active');
        if (tsfilter == 'all') {
            $('.schedule-table').removeClass('filtering');
            $('.ts-item').removeClass('show');
        } else {
            $('.schedule-table').addClass('filtering');
        }
        $('.ts-item').each(function() {
            $(this).removeClass('show');
            if ($(this).data('tsmeta') == tsfilter) {
                $(this).addClass('show');
            }
        });
    });


	// Window Resize Mobile Menu Fix
	mobileNav();


	// Scroll animation init
	window.sr = new scrollReveal();
	

	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) + 1
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Page loading animation
	 $(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}

})(window.jQuery);

