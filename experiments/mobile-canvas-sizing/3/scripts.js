let startY = 0;
window.scrollTo(0, 0);

window.onresize = function() {
  let overflow = document.body.scrollHeight - window.innerHeight;
  
  window.scrollTo(0, 0);
  document.querySelector('html').style.setProperty('--screen-overflow', overflow + 'px');
};

document.addEventListener('touchstart', function(event) {
  startY = document.body.scrollTop;
}, { passive: false });

document.addEventListener('touchmove', function(event) {
  console.log(startY, document.body.scrollTop);
  let element = event.target;
  let scrollAmount = (element.scrollTop + element.offsetHeight) / element.scrollHeight;
  let currentY = event.targetTouches[0].clientY - startY;

  if (!element.classList.contains('is-scrollable')) {
    event.preventDefault();
    console.log('no scroll');
  }

  if (
    element.classList.contains('is-scrollable') &&
    element.style.overflowX == 'hidden'
  ) {
    if (element.scrollTop === 0 && currentY > 0 || scrollAmount >= 1 && currentY < 0) {
      event.preventDefault();
    }
  }
}, { passive: false });

// function preventDefault(event) {
//   console.log('stahp!');
//   event.preventDefault();
// };

// document.body.addEventListener("touchstart", function(event) {
//   startY = document.body.scrollTop;
// }, { passive: false });

// document.body.addEventListener("touchmove", function(event) {
//   console.log(event.target.scrollTop, event.target.scrollLeft);
//   // if (startY !== document.body.scrollTop) {
//   //   event.preventDefault();
//   //   console.log('stahp!');
//   //   window.scrollTo(0, 0);
//   // };
// }, { passive: false });