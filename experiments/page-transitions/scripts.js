/*
  TO-DO:
  - Convert function to use defined in and out pairs(this is passed in on initial call)
  - Have a cancel that can decide to execute what happens next or not
  - Have a reset command that cleans the DOM
*/

// Search based on query string
function Transition() {
  this.initialize();
};

Transition.prototype = {
  initialize: function() {
    var here = this;
    var _container = document.querySelector('[data-segue="container"]');
    var _target = document.querySelector('[data-segue="target"]');
    var _href;

    // Create progress UI
    var progressUI = document.createElement('span')

    progressUI.classList.add('c_segue--progress');
    document.body.appendChild(progressUI);

    // Listen for navigation clicks
    document.addEventListener('click', function(event) {
      var link = event.target;
      var href = link.href

      // Polyfill for .matches() funciton
      var matches = function(element, selector) {
        return (element.matches || element.msMatchesSelector || element.webkitMatchesSelector).call(element, selector);
      };

      if (
        // If it's a link...
        matches(event.target, 'a[href], a[href] *') &&
        // And it's an internal link...
        (location.hostname === link.hostname || !link.hostname.length) &&
        // And there's no modifier key or button...
        !(event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button == 1))
      ) {
        event.preventDefault();

        // If the link isn't to current page
        if (location.href != link.href) {
          here.contentOut(href);
        };
      };
    }, false);

    // Using browser back and forward buttons just refreshes the page
    window.onpopstate = function() {
      window.location.href = location.href;
    };
  },

  change: function(passedHref) {
    var here = this;
    var content = new XMLHttpRequest();
    var href = passedHref || location.href;

    // Load new content
    content.open('GET', href, true);

    content.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Get new content for page
        var markup = document.implementation.createHTMLDocument()
        markup.documentElement.innerHTML = this.response;

        var title = markup.querySelector('title').innerText;
        var article = markup.querySelector('.c_page--article').innerHTML;
        var classes = markup.querySelector('.c_page--outer').classList.value;

        // Update Browser State
        window.history.pushState(null, title, href);
        document.title = title;

        // Update HTML
        here.updateNav();
        document.querySelector('.c_page--outer').classList = classes;
        document.querySelector('.c_page--article').innerHTML = article;

        // Animate current content out
        here.contentIn();

      } else {
        console.error(this.status, this.statusText);
      }
    };

    content.onerror = function() {
      console.error(this.status, this.statusText);
    };

    content.send();
  },

  contentIn: function() {
    var here = this;
    var container = document.querySelector('.c_page--outer');
    var content = document.querySelector('.c_page--inner');
    var bar = document.querySelector('.c_segue--progress');

    // Listen for animation completion on content in
    var animationOver = function(event) {
      // Check to make sure it's the target because this listener bubbles
      if (event.target == this) {
        content.removeEventListener('animationend', animationOver, false);

        bar.classList.remove('loading');
        bar.classList.add('complete');
      };
    };

    content.addEventListener('animationend', animationOver, false);

    // Listen for transition completion on progress bar
    var transitionOver = function(event) {
      bar.removeEventListener('transitionend', transitionOver, false);

      bar.classList.remove('complete');
      bar.classList.add('hide');
    }

    bar.addEventListener('transitionend', transitionOver, false);

    // Listen for hiding progress bar to complete
    var progressBarHidden = function(event) {
      // Check to make sure it's the target because this listener bubbles
      if (event.target == this) {
        content.removeEventListener('animationend', progressBarHidden, false);
        bar.classList.remove('hide');
      };
    };

    bar.addEventListener('animationend', progressBarHidden, false);

    // Start animation
    container.classList.add('a_content--in');
  },

  contentOut: function(href) {
    var here = this;
    var container = document.querySelector('.c_page--outer');
    var content = document.querySelector('.c_page--inner');
    var bar = document.querySelector('.c_segue--progress');

    // Listen for animation completion
    var contentOutFinished = function(event) {
      // Check to make sure it's the target because this listener bubbles
      if (event.target == this) {
        content.removeEventListener('animationend', contentOutFinished, false);
        here.change(href);
      };
    };

    content.addEventListener('animationend', contentOutFinished, false);

    // Start animation
    container.classList.add('a_content--out');
    bar.classList.add('loading');
  },

  updateNav: function() {
    var links = document.querySelectorAll('.c_nav--link');
    var active = document.querySelector('.c_nav--link.active');

    if (active) {
      active.classList.remove('active');
    };

    Array.prototype.forEach.call(links, function(link){
      if (link.href == location.href) {
        link.classList.add('active');
      };
    });
  }
};

// Create search instance
document.addEventListener('DOMContentLoaded', function() {
  var transition = new Transition();
});
