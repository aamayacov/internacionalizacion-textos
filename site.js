(() => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-site-nav]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      body.classList.toggle('menu-open', !open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      body.classList.remove('menu-open');
    }));
  }

  document.querySelectorAll('.accordion button').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      if (panel) panel.classList.toggle('is-open', !open);
    });
  });

  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
      document.querySelectorAll(`[data-tab-group="${tablist.dataset.group}"]`).forEach(panel => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
    }));
  });

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', () => {
      group.querySelectorAll('.filter-chip').forEach(item => item.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      const target = document.querySelector(group.dataset.resultTarget || '[data-filter-message]');
      if (target) target.textContent = chip.dataset.message || `Mostrando opciones para: ${chip.textContent.trim()}`;
    }));
  });

  document.querySelectorAll('[data-opportunity-search]').forEach(finder => {
    const input = finder.querySelector('input[type="search"]');
    const button = finder.querySelector('.search-button');
    const feedback = finder.querySelector('[aria-live="polite"]');
    const experience = finder.querySelector('.finder-select select');
    const runSearch = () => {
      const query = input?.value.trim();
      const type = experience?.value || 'Todas las experiencias';
      if (feedback) feedback.textContent = query
        ? `Búsqueda preparada para “${query}” · ${type}.`
        : `Selecciona filtros o escribe una institución, ciudad o país · ${type}.`;
    };
    button?.addEventListener('click', runSearch);
    input?.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); runSearch(); }
    });
  });

  document.querySelectorAll('[data-demo-form]').forEach(form => {
    const topic = new URLSearchParams(window.location.search).get('tipo');
    const topicSelect = form.querySelector('#interes');
    const topicMap = { experiencia: 'Experiencia internacional', cooperacion: 'Cooperación académica', entrante: 'Movilidad entrante' };
    if (topicSelect && topicMap[topic]) topicSelect.value = topicMap[topic];
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const message = form.querySelector('.form-message');
      if (message) {
        message.textContent = 'Tu solicitud quedó preparada. En una implementación conectada, aquí se enviaría al equipo de Internacionalización UVP.';
        message.classList.add('is-visible');
        message.focus();
      }
    });
  });
})();
