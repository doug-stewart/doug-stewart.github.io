// percentage decrease is 56.077147%

$(function() {

	// Set default outerWidths/outerHeights
	var height =  $(window).outerHeight() - 1;
	var width =  $(window).outerWidth() - 1;
	var top = 86;
	var left = 140;
	var leftShift = 424;
	var topShift = 238;
	var cardHeightSmall = 173;
	var cardWidthSmall = 280;
	var cardHeightMedium = 250;
	var cardWidthMedium = 410;
	var horizontalSpacing = 14;

	function horizontalShift(way) {
		var currentCard = $('.card.focus');
		var curLeft = parseInt($('.deck.focus .cards').attr('data-left'));
		if (way == 'next') {
			var newCard = $(currentCard).next();
			var newLeft = curLeft - leftShift;
		};
		if (way == 'prev') {
			var newCard = $(currentCard).prev();
			var newLeft = curLeft + leftShift;
		};

		$('.deck.focus .cards').attr('data-left', newLeft).css('left', newLeft);
		$(currentCard).removeClass('active');
		$(currentCard).removeClass('focus');
		$(newCard).addClass('focus');
		$(newCard).addClass('active');
	}

	function verticalShift(way) {
		var currentTop = parseInt($('.decks').attr('data-top'));
		var currentDeck = $('.deck.focus');
		var currentCard = $('.card.focus');
		var currentCardCount = $(currentCard).index();
		var currentCardCountLeft = -Math.floor(currentCardCount * (cardWidthSmall + horizontalSpacing) - cardWidthSmall / 2);

		if (way == 'down') {
			var newDeck = $(currentDeck).next();
			var newTop = currentTop - topShift;
		};

		if (way == 'up') {
			var newDeck = $(currentDeck).prev();
			var newTop = currentTop + topShift;      
		};

		var newCardCount = $(newDeck).children().children('.active').index();
		var newCardCountLeft = -Math.floor(newCardCount * (cardWidthMedium + horizontalSpacing) - left);

		console.log(currentTop);

		$('.decks').attr('data-top', newTop).css('top', newTop);
		$(currentDeck).removeClass('focus').children('.cards').attr('data-left', currentCardCountLeft).css('left', currentCardCountLeft).children(currentCard).removeClass('focus');
		$(newDeck).addClass('focus').children('.cards').attr('data-left', newCardCountLeft).css('left', newCardCountLeft).children('.deck.focus .card.active').addClass('focus');
	}

	$('.decks').attr('data-top', top).css('top', top);
	$('.decks').outerHeight(height).outerWidth(width);
	$('.deck').outerWidth(width);
	$('.cards').css('left', left).attr('data-left', left);

	// Hide loading gif
	$('body').addClass('ready');

	// Navigation watchers
	$(document.documentElement).keydown(function (event) {
		// Left key
		if (event.keyCode == 37 && $('.deck.focus .card.focus').index() > 0 ) {
			horizontalShift('prev');
		};
		// Right key
		if (event.keyCode == 39 && $('.deck.focus .card').length - 1 > $('.deck.focus .card.focus').index()) {
			horizontalShift('next');
		};
		// Up key
		if (event.keyCode == 38 && $('.deck.focus').index() > 0) {
			verticalShift('up');
		};
		// Down key
		if (event.keyCode == 40 && $('.deck').length - 1 > $('.deck.focus').index() ) {
			verticalShift('down');
		};
		// 1 key, show all
		if (event.keyCode == 49) {
			$('.box').addClass('filter-show-all').removeClass('filter-show-local').removeClass('filter-show-remote');
		};
		// 2 key, show local
		if (event.keyCode == 50) {
			$('.box').addClass('filter-show-local').removeClass('filter-show-all').removeClass('filter-show-remote');
			$('.focus.remote').removeClass('focus');
		};
		// 3 key, show remote
		if (event.keyCode == 51) {
			$('.box').addClass('filter-show-remote').removeClass('filter-show-all').removeClass('filter-show-local');
			$('.focus.local').removeClass('focus');
		};
	});
});