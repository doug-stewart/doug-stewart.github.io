// Menu
const button = document.querySelector('[data-js-menu-toggle]');
const close = document.querySelector('[data-js-menu-close]');
const menu = document.querySelector('#global-nav');
const menuLinks = document.querySelectorAll('#global-nav a');

const closeMenu = () => {
  button.focus();
  button.setAttribute('aria-label', 'Menu expanded');
  menu.setAttribute('aria-hidden', true);
  menu.classList.remove('is-visible');
  menuLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
};

const openMenu = () => {
  button.removeAttribute('aria-label');
  menu.removeAttribute('aria-hidden');
  menu.classList.add('is-visible');
  menuLinks[0].focus();
  menuLinks.forEach((link) => link.removeAttribute('tabindex'));
};

button.addEventListener('click', () => {
  menu.getAttribute('aria-hidden') ? openMenu() : closeMenu();
});

close.addEventListener('click', () => {
  menu.getAttribute('aria-hidden') ? openMenu() : closeMenu();
});

document.addEventListener('click', (event) => {
  if (
    menu.classList.contains('is-visible') &&
    event.target.classList.contains('menu')
  )
    closeMenu();
});

document.addEventListener('keydown', (Event) => {
  if (
    Event.key === 'Escape' &&
    menu.getAttribute('aria-hidden') === null &&
    document.activeElement.closest('.menu')
  )
    closeMenu();
});

// Lightbox
const openLightbox = (source, image) => {
  const lightbox = `<div class="modal" aria-modal="true">
    <button class="modal__close" data-js-lightbox-close>Close</button>
    <div class="modal__media" data-js-lightbox-close>
      <img class="modal__img" alt="" src="${image}" />
    </div>
  </div>`;

  source.setAttribute('data-js-lightbox-source', true);
  document.body.classList.add('has-modal');
  document.body.insertAdjacentHTML('beforeend', lightbox);

  const img = document.querySelector('.modal__img');

  img.onload = () => {
    Promise.resolve(img.naturalHeight !== 0).then(() => {
      img.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'center',
      });
    });
  };
};

document.addEventListener('click', (event) => {
  const lightboxLink =
    event.target.closest('[data-js-lightbox-open]') ||
    event.target.hasAttribute('data-js-lightbox-open');

  if (lightboxLink) {
    event.preventDefault();
    openLightbox(lightboxLink, lightboxLink.href);
  }

  if (event.target.hasAttribute('data-js-lightbox-close')) {
    document.querySelector('.modal').remove();
    document.body.classList.remove('has-modal');
  }
});

// Slideshow
const setupSlideshows = () => {
  const slideshows = document.querySelectorAll('.slideshow');
  const navHtml = `<button class="slideshow__prev" data-js-slideshow-prev>Previous</button>
    <button class="slideshow__next" data-js-slideshow-next>Next</button>`;

  slideshows.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll('.slideshow__item');

    if (slides.length === 1) return;

    slideshow.setAttribute('data-js-slideshow-num', '0');
    slideshow.insertAdjacentHTML('beforeend', navHtml);
    slideshow.querySelector('.slideshow__list').scrollTo(0, 0);

    slideshow
      .querySelector('[data-js-slideshow-next]')
      .addEventListener('click', () => {
        const count = parseInt(slideshow.getAttribute('data-js-slideshow-num'));
        const newCount = slides.length - 1 === count ? 0 : count + 1;

        slideshow.setAttribute('data-js-slideshow-num', newCount);
        slides[newCount].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      });

    slideshow
      .querySelector('[data-js-slideshow-prev]')
      .addEventListener('click', () => {
        const count = parseInt(slideshow.getAttribute('data-js-slideshow-num'));
        const newCount = count === 0 ? slides.length - 1 : count - 1;

        slideshow.setAttribute('data-js-slideshow-num', newCount);
        slides[newCount].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      });

    const scrollCallback = (entries) => {
      entries.forEach((entry) => {
        entry.isIntersecting
          ? slideshow.setAttribute(
              'data-js-slideshow-num',
              entry.target.getAttribute('data-js-slideshow-index')
            )
          : null;
      });
    };

    const scrollObserver = new IntersectionObserver(scrollCallback, {
      root: slideshow.querySelector('.slideshow__list'),
      rootMargin: '0px',
      threshold: 1,
    });

    slides.forEach((slide) => scrollObserver.observe(slide));
  });
};

window.onload = setupSlideshows();
