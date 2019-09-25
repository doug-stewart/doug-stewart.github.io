const targetElement = document.querySelector('article');

bodyScrollLock.disableBodyScroll(targetElement);

window.onresize = function() {
  var overflow = document.body.scrollHeight - window.innerHeight;
  
  window.scrollTo(0, 0);
  document.querySelector('html').style.setProperty('--screen-overflow', overflow + 'px');
};
