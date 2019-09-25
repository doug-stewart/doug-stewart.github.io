// Search based on query string
function Transition() {
  this.initialize();
};

Transition.prototype = {
  initialize: function() {
    var here = this;

    // Create progress UI
    var progressUI = document.createElement('span')

    progressUI.classList.add('c_progress--bar');
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

    // Identify selectors to animate in
    var content = document.querySelector('.c_page--article');
    var container = document.querySelector('.c_page--inner');
    var progress = document.querySelector('.c_progress--bar');

    // Animate content
    var contentInSequence = [
      {
        e: progress,
        p: { width: ['100%', 0] },
        o: {
          duration: 100,
          queue: false
        }
      },
      {
        e: container,
        p: { width: '50vw' },
        o: { duration: 200 }
      },
      {
        e: content,
        p: { opacity: 1 },
        o: { duration: 200 }
      },
      {
        e: progress,
        p: { opacity: 0 },
        o: {
          duration: 200,
          complete: function() {
            here.reset();
          }
        }
      }
    ];

    Velocity(progress, 'stop');
    Velocity.RunSequence(contentInSequence);
  },

  contentOut: function(href) {
    var here = this;

    // Identify selectors to animate out
    var content = document.querySelector('.c_page--article');
    var container = document.querySelector('.c_page--inner');
    var progress = document.querySelector('.c_progress--bar');

    var contentOutSequence = [
      {
        e: content,
        p: { opacity: 0 },
        o: { duration: 200 }
      },
      {
        e: container,
        p: { width: '100%' },
        o: {
          duration: 200,
          complete: function() {
            setTimeout(function(){
              here.change(href);
            }, 4000);
          }
        }
      },
      {
        e: progress,
        p: { width: ['80%', 0] },
        o: { duration: 6000 }
      }
    ];

    Velocity.RunSequence(contentOutSequence);
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
  },

  reset: function() {
    var content = document.querySelector('.c_page--article');
    var container = document.querySelector('.c_page--inner');
    var progress = document.querySelector('.c_progress--bar');

    // Stop all Velocity animations
    Velocity(content, 'stop', true);
    Velocity(container, 'stop', true);
    Velocity(progress, 'stop', true);

    // Remove all Style attributes to reset
    content.removeAttribute('style');
    container.removeAttribute('style');
    progress.removeAttribute('style');
  }
};

// Create search instance
document.addEventListener('DOMContentLoaded', function() {
  var transition = new Transition();
});
