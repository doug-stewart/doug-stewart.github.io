$(document).on('mouseenter', '.hero > g', function() {
  var target = $(this);
  var parent = $(this).parent();

  $(target).remove().appendTo(parent);

}).on('mouseleave', '.hero > g', function() {
  var target = $(this);
  var parent = $(this).parent();
  var spot = $(this).attr('data-order');

  if (spot >= $(this).parent().children().length) {
    $(target).remove().appendTo(parent);

  } else {
    $(target).remove();
    $(parent).children(':nth-child(' + spot + ')').before(target);
  }
});
