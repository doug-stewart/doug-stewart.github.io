let startY = 0;

window.onresize = function() {
  let overflow = document.body.scrollHeight - window.innerHeight;
  
  window.scrollTo(0, 0);
  document.querySelector('html').style.setProperty('--screen-overflow', overflow + 'px');
};

document.addEventListener('touchstart', function(event) {
  startY = event.targetTouches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', function(event) {
  let element = event.target;
  let scrollAmount = (element.scrollTop + element.offsetHeight) / element.scrollHeight;
  let currentY = event.targetTouches[0].clientY - startY;

  if (
    !element.classList.contains('is-scrollable') ||
    element.classList.contains('is-scrollable') && element.scrollTop === 0 && currentY > 0 ||
    element.classList.contains('is-scrollable') && scrollAmount >= 1 && currentY < 0
    
  ) {
    event.preventDefault();
  }
}, { passive: false });
