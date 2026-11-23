(() => {
  'use strict';

  const dedication = 'I am eternally grateful to Ukrainian defenders for protecting my home and family from russian invaders. '
    + 'Please consider supporting Ukraine through these organisations.';

  const fundraiserGroups = [
    {
      title: 'Humanitarian aid',
      fundraisers: [
        {
          name: 'UNITED24',
          url: 'https://u24.gov.ua/',
          description: 'Ambulances for Ukrainian hospitals.',
        },
        {
          name: 'Razom for Ukraine',
          url: 'https://www.razomforukraine.org/donate-to-ukraine/',
          description: 'Civilian relief and recovery through local organisations.',
        },
        {
          name: 'Australia for UNHCR',
          url: 'https://www.unrefugees.org.au/emergency-response/ukraine-emergency/',
          description: 'Supporting civilians by providing emergency cash for essentials, repairing damaged homes, and giving children and parents psychological support.',
        },
      ],
    },
    {
      title: 'Aid with military options',
      fundraisers: [
        {
          name: 'Sternenko Community Foundation',
          url: 'https://www.sternenkofund.org/en',
          description: 'Equipment and drones for Ukraine’s Defence Forces.',
        },
        {
          name: 'Come Back Alive',
          url: 'https://savelife.in.ua/en/about-foundation-en/',
          description: 'Military aid and training.',
        },
        {
          name: 'Prytula Foundation',
          url: 'https://prytulafoundation.org/en',
          description: 'Military aid and humanitarian support for civilians.',
        },
      ],
    },
  ];

  function createFundraiserColumn({ title, fundraisers }) {
    const column = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = title;
    const list = document.createElement('ul');
    list.className = 'fundraiser-links';
    list.setAttribute('role', 'list');

    for (const { name, url, description, language } of fundraisers) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = name;
      if (language) link.lang = language;
      const note = document.createElement('span');
      note.className = 'fundraiser-description';
      note.textContent = description;
      item.append(link, note);
      list.append(item);
    }

    column.append(heading, list);
    return column;
  }

  const footer = document.querySelector('[data-fundraisers]');
  if (footer) {
    // Keep the shared layout here so the main page and book need the same one file.
    const styles = document.createElement('style');
    styles.textContent = `
      .site-fundraisers .fundraiser-columns {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.2rem clamp(1rem, 2.5vw, 2rem);
      }
      .site-fundraisers .fundraiser-columns :is(h2, h3) {
        margin: 0 0 0.45rem;
        color: var(--text, #f1eae0);
        font: 650 0.98rem/1.35 var(--sans, system-ui, sans-serif);
        letter-spacing: normal;
      }
      .site-fundraisers .fundraiser-columns p { max-width: 42ch; }
      .site-fundraisers .fundraiser-columns .fundraiser-links {
        display: grid;
        gap: 0.65rem;
      }
      @media (max-width: 40rem) {
        .site-fundraisers .fundraiser-columns { grid-template-columns: minmax(0, 1fr); }
      }
    `;
    document.head.append(styles);

    const columns = document.createElement('div');
    columns.className = 'fundraiser-columns';
    const description = document.createElement('div');
    const heading = footer.querySelector('h2');
    const intro = document.createElement('p');
    intro.textContent = dedication;
    description.append(heading, intro);
    columns.append(description, ...fundraiserGroups.map(createFundraiserColumn));
    footer.replaceChildren(columns);
  }

  const siteHostname = 'makstheuastronomer.github.io';
  const anchorSelector = 'a[href]';

  function setLinkDefault(link) {
    const href = link.getAttribute('href');
    if (!href?.trim() || link.hasAttribute('download')) return;

    let destination;
    try {
      destination = new URL(href, link.baseURI);
    } catch {
      return;
    }
    if (destination.protocol !== 'https:' && destination.protocol !== 'http:') return;
    if (destination.hostname === siteHostname || destination.origin === window.location.origin) return;

    if (!link.hasAttribute('target')) link.target = '_blank';
    if (link.target.toLowerCase() === '_blank') link.relList.add('noopener', 'noreferrer');
  }

  document.querySelectorAll(anchorSelector).forEach(setLinkDefault);

  // Citations in the disc sandbox are inserted when the selection changes.
  const newLinks = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.matches(anchorSelector)) setLinkDefault(node);
        node.querySelectorAll(anchorSelector).forEach(setLinkDefault);
      }
    }
  });
  newLinks.observe(document.body, { childList: true, subtree: true });
})();
