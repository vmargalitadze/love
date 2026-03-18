(function () {
  var initMenu = function () {
    var burger = document.querySelector('.burger');
    var overlay = document.querySelector('.nav-overlay');
    var panel = document.querySelector('.nav-panel');
    var body = document.body;
    var panelLinks = document.querySelectorAll('.nav-panel-link');

    if (!burger || !overlay || !panel) return;

    var openMenu = function () {
      overlay.setAttribute('aria-hidden', 'false');
      panel.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Закрыть меню');
      body.classList.add('nav-open');
    };

    var closeMenu = function () {
      overlay.setAttribute('aria-hidden', 'true');
      panel.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      body.classList.remove('nav-open');
    };

    var toggleMenu = function () {
      if (body.classList.contains('nav-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    burger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    for (var i = 0; i < panelLinks.length; i++) {
      panelLinks[i].addEventListener('click', closeMenu);
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && body.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  };

  var initStudentsCarousel = function () {
    var students = document.querySelector('.students');
    if (!students) return;

    var imagesWrap = students.querySelector('.students-images');
    if (!imagesWrap) return;

    var images = imagesWrap.querySelectorAll('img');
    if (!images || images.length <= 1) return;

    var getVisibleCount = function () {
      return window.innerWidth <= 768 ? 1 : 3;
    };

    // First visible image index (not the count).
    var activeStartIndex = 0;
    for (var i = 0; i < images.length; i++) {
      if (images[i].classList.contains('is-active')) {
        activeStartIndex = i;
        break;
      }
    }

    var setActive = function (startIndex) {
      var visibleCount = Math.min(getVisibleCount(), images.length);
      activeStartIndex = (startIndex + images.length) % images.length;

      for (var j = 0; j < images.length; j++) {
        images[j].classList.remove('is-active');
      }

      for (var k = 0; k < visibleCount; k++) {
        var idx = (activeStartIndex + k) % images.length;
        images[idx].classList.add('is-active');
      }
    };

    setActive(activeStartIndex);

    var prev = function () {
      setActive(activeStartIndex - 1);
    };

    var next = function () {
      setActive(activeStartIndex + 1);
    };

    var buttons = students.querySelectorAll('.students-button');
    for (var k = 0; k < buttons.length; k++) {
      (function (btn) {
        var arrows = btn.querySelectorAll('img');
        if (!arrows || arrows.length < 2) return;

        arrows[0].addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          prev();
        });

        arrows[1].addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          next();
        });
      })(buttons[k]);
    }

    window.addEventListener('resize', function () {
      // Update visible count when switching between mobile/desktop.
      setActive(activeStartIndex);
    });
  };

  var initTeachersCarousel = function () {
    var wraps = document.querySelectorAll('.teachers-carousel-wrap');
    if (!wraps || wraps.length === 0) return;

    for (var w = 0; w < wraps.length; w++) {
      (function (wrap) {
        if (!wrap || wrap.dataset.carouselInit === 'true') return;

        var root = wrap.closest('section') || document;
        var prevBtn = root.querySelector('.teachers-arrow-prev');
        var nextBtn = root.querySelector('.teachers-arrow-next');
        if (!prevBtn || !nextBtn) return;

        var itemsRow = wrap.querySelector('.teachers-items');
        var items = itemsRow ? itemsRow.querySelectorAll('.teachers-item') : null;
        if (!items || items.length <= 1) return;

        wrap.dataset.carouselInit = 'true';

        var getStep = function () {
          if (items.length >= 2) {
            var step = items[1].offsetLeft - items[0].offsetLeft;
            if (step > 0) return step;
          }
          return items[0].getBoundingClientRect().width || 280;
        };

        var updateButtons = function () {
          var maxScroll = wrap.scrollWidth - wrap.clientWidth;
          var left = wrap.scrollLeft;
          var atStart = left <= 1;
          var atEnd = left >= maxScroll - 1;

          prevBtn.disabled = atStart;
          nextBtn.disabled = atEnd;
          prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
          nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
        };

        var scrollByStep = function (dir) {
          var step = getStep();
          wrap.scrollBy({ left: dir * step, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', function (e) {
          e.preventDefault();
          scrollByStep(-1);
        });

        nextBtn.addEventListener('click', function (e) {
          e.preventDefault();
          scrollByStep(1);
        });

        wrap.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);

        updateButtons();
      })(wraps[w]);
    }
  };

  var initScrollToCall = function () {
    var callSection = document.getElementById('call') || document.querySelector('.call');
    if (!callSection) return;

    var scrollToCall = function () {
      callSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () {
        var firstInput = callSection.querySelector('input, textarea, select, button');
        if (firstInput && typeof firstInput.focus === 'function') firstInput.focus();
      }, 350);
    };

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (!target) return;

      var btn = target.closest ? target.closest('button, a') : null;
      if (!btn) return;

      var text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
      if (text !== 'Записаться') return;

      e.preventDefault();
      scrollToCall();
    });
  };

  var initCoursesToggle = function () {
    var courses = document.querySelector('.courses');
    if (!courses) return;

    var toggle = courses.querySelector('.courses-toggle');
    if (!toggle) return;

    var cardsWrap = courses.querySelector('.courses-cards');
    var cards = cardsWrap ? cardsWrap.querySelectorAll('.cards-box') : null;
    var cardsCount = cards ? cards.length : 0;
    if (cardsCount <= 4) {
      toggle.style.display = 'none';
      courses.classList.remove('is-expanded');
      return;
    }

    var labelEl = toggle.querySelector('p') || toggle;
    var collapsedText = (labelEl.textContent || '').trim() || 'Все курсы';
    var expandedText = 'Скрыть курсы';

    var setExpanded = function (expanded) {
      if (expanded) {
        courses.classList.add('is-expanded');
        toggle.setAttribute('aria-expanded', 'true');
        labelEl.textContent = expandedText;
      } else {
        courses.classList.remove('is-expanded');
        toggle.setAttribute('aria-expanded', 'false');
        labelEl.textContent = collapsedText;
      }
    };

    setExpanded(false);

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      setExpanded(!courses.classList.contains('is-expanded'));
    });
  };

  var initMasterToggle = function () {
    var master = document.querySelector('.master');
    if (!master) return;

    var toggle = master.querySelector('.master-toggle');
    if (!toggle) return;

    var box = master.querySelector('.master-box');
    var items = box ? box.querySelectorAll('.master-item') : null;
    var itemsCount = items ? items.length : 0;
    if (itemsCount <= 3) {
      toggle.style.display = 'none';
      master.classList.remove('is-expanded');
      return;
    }

    var labelEl = toggle.querySelector('p') || toggle;
    var collapsedText = (labelEl.textContent || '').trim() || 'Все мастер-классы';
    var expandedText = 'Скрыть мастер-классы';

    var setExpanded = function (expanded) {
      if (expanded) {
        master.classList.add('is-expanded');
        toggle.setAttribute('aria-expanded', 'true');
        labelEl.textContent = expandedText;
      } else {
        master.classList.remove('is-expanded');
        toggle.setAttribute('aria-expanded', 'false');
        labelEl.textContent = collapsedText;
      }
    };

    setExpanded(false);

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      setExpanded(!master.classList.contains('is-expanded'));
    });
  };

  var initLessensCarousel = function () {
    var wrap = document.querySelector('.lessens-carousel-wrap');
    var prev = document.querySelector('.lessens-arrow-prev');
    var next = document.querySelector('.lessens-arrow-next');
    if (!wrap) return;
    if (wrap.dataset.carouselInit === 'true') return; // prevent double-binding
    if (!prev || !next) return;

    var items = wrap.querySelectorAll('.lessens-item');
    if (!items || items.length <= 1) return;

    wrap.dataset.carouselInit = 'true';

    var getStep = function () {
      if (items.length >= 2) {
        // Move exactly by the distance between the first two items.
        var step = items[1].offsetLeft - items[0].offsetLeft;
        if (step > 0) return step;
      }

      return items[0].getBoundingClientRect().width || 280;
    };

    var updateButtons = function () {
      var maxScroll = wrap.scrollWidth - wrap.clientWidth;
      var left = wrap.scrollLeft;
      var atStart = left <= 1;
      var atEnd = left >= maxScroll - 1;

      prev.disabled = atStart;
      next.disabled = atEnd;
      prev.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      next.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
    };

    var scrollByStep = function (dir) {
      var step = getStep();
      wrap.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    prev.addEventListener('click', function (e) {
      e.preventDefault();
      if (prev.disabled) return;
      scrollByStep(-1);
    });

    next.addEventListener('click', function (e) {
      e.preventDefault();
      if (next.disabled) return;
      scrollByStep(1);
    });

    wrap.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  };

  var initQuestionsAccordion = function () {
    var headers = document.querySelectorAll('.question-header');
    if (!headers || headers.length === 0) return;

    headers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.question-item');
        var content = document.getElementById(btn.getAttribute('aria-controls'));
        var isOpen = item && item.classList.contains('question-item-open');

        document.querySelectorAll('.question-item').forEach(function (other) {
          other.classList.remove('question-item-open');
          var otherContent = other.querySelector('.question-content');
          if (otherContent) {
            otherContent.hidden = true;
            var otherHeader = other.querySelector('.question-header');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          }
        });

        if (!item) return;
        if (!isOpen) {
          item.classList.add('question-item-open');
          if (content) content.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  var initReviewsCarousel = function () {
    var wrap = document.querySelector('.review-carousel');
    if (!wrap) return;
    if (wrap.dataset.carouselInit === 'true') return;

    var prev = wrap.querySelector('.review-arrow-prev');
    var next = wrap.querySelector('.review-arrow-next');
    if (!prev || !next) return;

    var cardImg = wrap.querySelector('.review-card img');
    if (!cardImg) return;

    var images = ['img/rev2.png', 'img/rev3.png', 'img/rev4.png', 'img/rev5.png'];

    // Find current index from image src (fallback to 0).
    var getCurrentIndex = function () {
      var current = cardImg.getAttribute('src') || '';
      for (var i = 0; i < images.length; i++) {
        if (current.indexOf(images[i]) !== -1) return i;
      }
      return 0;
    };

    var index = getCurrentIndex();

    var setIndex = function (nextIndex) {
      index = (nextIndex + images.length) % images.length;
      cardImg.setAttribute('src', images[index]);
    };

    prev.addEventListener('click', function (e) {
      e.preventDefault();
      setIndex(index - 1);
    });

    next.addEventListener('click', function (e) {
      e.preventDefault();
      setIndex(index + 1);
    });

    wrap.dataset.carouselInit = 'true';
  };

  initMenu();
  initStudentsCarousel();
  initTeachersCarousel();
  initScrollToCall();
  initCoursesToggle();
  initMasterToggle();
  initLessensCarousel();
  initReviewsCarousel();
  initQuestionsAccordion();

  document.addEventListener('teachers:rendered', function () {
    initTeachersCarousel();
  });
})();
