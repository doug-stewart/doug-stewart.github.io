var heroTargets = document.querySelectorAll('.hero_targets > path');

heroTargets.forEach(function(item, i){

  item.addEventListener('click', function(event) {
    event.preventDefault();

    var iframe = `<iframe class="modal--iframe" width="720" height="405" src="https://www.youtube.com/embed/${this.getAttribute('data-video')}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;

    document.querySelector('.modal').classList.add('show');
    document.querySelector('.modal--vid').innerHTML = iframe;
  }, false);

  item.addEventListener('mouseenter', function(event) {
    var graphic = '.' + (this.getAttribute('class').replace(/(target)/g, 'graphic'));

    this.parentNode.appendChild(this);
    document.querySelector(graphic).classList.add('focus');
  }, false);

  item.addEventListener('mouseleave', function(event) {
    var graphic = '.' + (this.getAttribute('class').replace(/(target)/g, 'graphic'));
    document.querySelector(graphic).classList.remove('focus');
  }, false);

});

document.querySelector('.modal--close').addEventListener('click', function(event) {
  event.preventDefault();

  var iframe = document.querySelector('.modal--iframe');

  document.querySelector('.modal').classList.remove('show');
  document.querySelector('.modal--vid').removeChild(iframe);
}, false);
