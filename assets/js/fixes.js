/* BuildEngineer Pro - mobile/project filter fixes */
(function () {
  'use strict';

  function refresh() {
    const filter = document.getElementById('projectFilter');

    if (filter && !filter.dataset.bound) {
      filter.dataset.bound = '1';
      filter.addEventListener('change', function () {
        if (typeof currentProject !== 'undefined') {
          currentProject = this.value || null;
        }
        if (typeof shell === 'function') shell();
      });
    }

    document.querySelectorAll('.muted').forEach(function (el) {
      if (el.textContent.includes('IndexedDB-style browser storage via data URLs')) {
        el.textContent = 'Files are stored locally in this browser using data URLs for testing.';
      }
    });

    // Close the mobile navigation after tapping a navigation item.
    document.querySelectorAll('#sidebar a, #sidebar button').forEach(function (el) {
      if (!el.dataset.mobileBound) {
        el.dataset.mobileBound = '1';
        el.addEventListener('click', function () {
          if (window.innerWidth <= 760) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('open');
          }
        });
      }
    });
  }

  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && typeof closeModal === 'function') closeModal();
  });

  refresh();
})();
