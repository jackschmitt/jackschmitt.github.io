(() => {
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('main .section[id]'));

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section highlighting via IntersectionObserver
  const headerHeight = header.offsetHeight;
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: `-${headerHeight + 10}px 0px -60% 0px`,
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));

  // Scroll-triggered fade/slide animation
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Project detail modal
  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const projectCards = Array.from(document.querySelectorAll('.project-card[data-modal]'));
  let lastFocusedEl = null;

  function openModal(slug) {
    const tpl = document.getElementById(`tpl-${slug}`);
    if (!tpl) return;
    modalContent.innerHTML = '';
    modalContent.appendChild(tpl.content.cloneNode(true));
    setupGalleries(modalContent);
    lastFocusedEl = document.activeElement;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalContent.scrollTop = 0;
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openModal(card.dataset.modal);
    });
    card.addEventListener('keydown', (e) => {
      if (e.target.closest('a')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.modal);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Gallery lightbox: click any photo/video in a project's gallery to view
  // it larger, with prev/next to step through the rest of that gallery.
  const lightbox = document.getElementById('lightbox');
  const lightboxStage = document.getElementById('lightbox-stage');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  let currentGallery = [];
  let currentIndex = 0;
  let lastLightboxFocus = null;

  function renderLightboxItem() {
    const item = currentGallery[currentIndex];
    lightboxStage.innerHTML = '';
    if (item.type === 'video') {
      const iframe = document.createElement('iframe');
      iframe.src = item.src;
      iframe.title = item.caption || 'Video';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      lightboxStage.appendChild(iframe);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || item.caption || '';
      lightboxStage.appendChild(img);
    }
    const multi = currentGallery.length > 1;
    lightboxPrev.style.display = multi ? '' : 'none';
    lightboxNext.style.display = multi ? '' : 'none';
    lightboxCaption.textContent = item.caption || '';
    lightboxCounter.textContent = multi ? `${currentIndex + 1} / ${currentGallery.length}` : '';
  }

  function openLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    lastLightboxFocus = document.activeElement;
    renderLightboxItem();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxStage.innerHTML = '';
    if (lastLightboxFocus) lastLightboxFocus.focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    renderLightboxItem();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    renderLightboxItem();
  }

  function setupGalleries(container) {
    container.querySelectorAll('.modal-gallery').forEach(galleryEl => {
      const items = Array.from(galleryEl.querySelectorAll('.gallery-item'));
      const media = [];
      items.forEach(item => {
        const img = item.querySelector('img');
        const iframe = item.querySelector('iframe');
        const caption = item.querySelector('figcaption')?.textContent.trim() || '';
        if (img) {
          media.push({ type: 'image', src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', caption });
        } else if (iframe) {
          media.push({ type: 'video', src: iframe.getAttribute('src'), caption: caption || iframe.getAttribute('title') || '' });
        }
      });
      let mediaIndex = 0;
      items.forEach(item => {
        if (!item.querySelector('img, iframe')) return; // skip unfilled placeholders
        const index = mediaIndex++;
        item.classList.add('gallery-item-clickable');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `View larger: ${media[index].caption || 'gallery item'}`);
        item.addEventListener('click', () => openLightbox(media, index));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(media, index);
          }
        });
      });
    });
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  let touchStartX = null;
  lightboxStage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });
  lightboxStage.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) (dx < 0 ? showNext : showPrev)();
    touchStartX = null;
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
      return;
    }
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });
})();
