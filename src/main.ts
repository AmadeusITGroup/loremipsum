import './style.css'
import { notes, renderMarkdown, signals, type Note } from './content'

type Route =
  | { name: 'home' }
  | { name: 'context' }
  | { name: 'notes' }
  | { name: 'note'; slug: string }

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

const icons = {
  arrow: '<span aria-hidden="true">↗</span>',
  arrowRight: '<span aria-hidden="true">→</span>',
  check: '<span aria-hidden="true">✓</span>',
  menu: '<span aria-hidden="true">☰</span>',
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${date}T12:00:00`),
  )
}

function getRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')

  if (hash.startsWith('note/')) {
    return { name: 'note', slug: decodeURIComponent(hash.replace('note/', '')) }
  }

  if (hash === 'context') return { name: 'context' }
  if (hash === 'notes') return { name: 'notes' }
  return { name: 'home' }
}

function navLink(href: string, label: string, active = false): string {
  return `<a class="nav-link${active ? ' is-active' : ''}" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`
}

function renderHeader(route: Route): string {
  const active = route.name

  return `
    <header class="site-header shell">
      <a class="site-mark" href="#/" aria-label="Sample sandbox home">
        <span class="site-mark-symbol" aria-hidden="true">S</span>
        <span><strong>Sample</strong><small>landing sandbox</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icons.menu}<span class="sr-only">Toggle navigation</span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main navigation">
        ${navLink('#/', 'Home', active === 'home')}
        ${navLink('#/context', 'Context', active === 'context')}
        ${navLink('#/notes', 'Notes', active === 'notes' || active === 'note')}
        <a class="nav-cta" href="#/notes">Browse notes ${icons.arrow}</a>
      </nav>
    </header>
  `
}

function renderFooter(): string {
  return `
    <footer class="site-footer shell">
      <div class="footer-brand">
        <a class="site-mark" href="#/" aria-label="Sample sandbox home">
          <span class="site-mark-symbol" aria-hidden="true">S</span>
          <span><strong>Sample</strong><small>landing sandbox</small></span>
        </a>
        <p>Placeholder structure for checking a small static publication flow.</p>
      </div>
      <div class="footer-links">
        <div><p class="eyebrow">Explore</p><a href="#/context">Context</a><a href="#/notes">Notes</a></div>
        <div><p class="eyebrow">Checks</p><a href="#/note/lorem-prima">Sample note ${icons.arrow}</a><a href="#/">Return home ${icons.arrow}</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Sample sandbox</span><span>Placeholder content · Static output</span></div>
    </footer>
  `
}

function renderPill(label: string): string {
  return `<span class="pill">${escapeHtml(label)}</span>`
}

function renderNoteCard(note: Note, featured = false): string {
  return `
    <article class="note-card${featured ? ' note-card-featured' : ''}">
      <div class="note-card-top"><span class="category-label">${escapeHtml(note.category)}</span><span>${escapeHtml(note.readTime)}</span></div>
      <h3><a href="#/note/${encodeURIComponent(note.slug)}">${escapeHtml(note.title)}</a></h3>
      <p>${escapeHtml(note.deck)}</p>
      <div class="note-card-bottom"><span>${formatDate(note.date)}</span><a class="text-link" href="#/note/${encodeURIComponent(note.slug)}">Read ${icons.arrowRight}</a></div>
    </article>
  `
}

function renderHero(): string {
  return `
    <section class="hero shell">
      <div class="hero-copy">
        <p class="kicker"><span class="kicker-dot"></span>Sample / 01</p>
        <h1>Shape the signal.<br /><em>Keep it moving.</em></h1>
        <p class="hero-lede">Lorem ipsum dolor sit amet, consectetur adipiscing elit. A small front door for testing pages, paths, and placeholder ideas.</p>
        <div class="hero-actions"><a class="button button-primary" href="#/notes">Read the notes ${icons.arrow}</a><a class="button button-quiet" href="#/context">View context ${icons.arrowRight}</a></div>
      </div>
      <div class="hero-art" role="img" aria-label="A sample board showing three connected placeholder steps">
        <div class="sample-board" aria-hidden="true">
          <div class="board-toolbar"><span class="window-controls"><i></i><i></i><i></i></span><span>sample / signal-board</span></div>
          <div class="board-heading"><span class="board-symbol">∿</span><div><small>Placeholder path</small><strong>Make the next part visible</strong></div><span class="board-status">Ready</span></div>
          <div class="board-lines"><span><i>+</i> Vestibulum ante</span><span><i>+</i> Integer posuere</span><span><i>+</i> Donec quam</span></div>
          <div class="board-path"><span>Start</span><i></i><span>Shape</span><i></i><span>Share</span></div>
          <div class="board-note"><span class="avatar-stack"><i>A</i><i>B</i><i>+</i></span><strong>Aligned for testing</strong><span class="board-check">✓</span></div>
        </div>
        <div class="art-label art-label-one"><span>01</span>Lorem ipsum</div>
        <div class="art-label art-label-two"><span>02</span>Dolor sit</div>
        <div class="art-label art-label-three"><span>03</span>Amet share</div>
      </div>
      <div class="scroll-cue"><span class="scroll-line"></span><span>Scroll to explore</span></div>
    </section>
  `
}

function renderSignalStrip(): string {
  return `
    <section class="signal-strip" aria-label="Sample signals">
      <div class="shell signal-grid">
        <p class="signal-intro"><span class="eyebrow">Sample signals</span><strong>Small parts, one clear path.</strong></p>
        ${signals.map((signal) => `<div class="signal-item"><span class="signal-number">${escapeHtml(signal.number)}</span><div><h3>${escapeHtml(signal.title)}</h3><p>${escapeHtml(signal.text)}</p></div></div>`).join('')}
      </div>
    </section>
  `
}

function renderFeatured(): string {
  const featured = notes.find((note) => note.featured) ?? notes[0]
  const supporting = notes.filter((note) => note.slug !== featured.slug).slice(0, 2)

  return `
    <section class="shell section-block">
      <div class="section-heading"><div><p class="eyebrow">From the sample</p><h2>Ideas worth <em>testing.</em></h2></div><a class="text-link" href="#/notes">View all notes ${icons.arrowRight}</a></div>
      <div class="featured-grid">${renderNoteCard(featured, true)}<div class="supporting-notes">${supporting.map((note) => renderNoteCard(note)).join('')}</div></div>
    </section>
  `
}

function renderMap(): string {
  return `
    <section class="dark-section">
      <div class="shell dark-grid">
        <div class="dark-copy"><p class="eyebrow eyebrow-light">A simple model</p><h2>Less noise.<br /><em>More direction.</em></h2><p>Placeholder systems work best when each part has a visible job. This block gives the layout a dark contrast section and a responsive content map to exercise.</p><a class="button button-light" href="#/context">See the context ${icons.arrow}</a></div>
        <div class="signal-map" role="img" aria-label="A sample map connecting questions, patterns, and outcomes">
          <div class="map-column"><span class="map-eyebrow">Inputs</span><span class="map-card"><i>?</i>Questions</span><span class="map-card"><i>+</i>Patterns</span><span class="map-card"><i>↗</i>Changes</span></div>
          <div class="map-bridge"><span class="bridge-line"></span><div class="bridge-card"><small>Sample<br />system</small><strong>Notice</strong><strong>Shape</strong><strong>Share</strong></div><span class="bridge-arrow">→</span></div>
          <div class="map-column map-outcomes"><span class="map-eyebrow">Outputs</span><span class="map-card">Clearer paths<i>✓</i></span><span class="map-card">Useful notes<i>↗</i></span><span class="map-card">Shared context<i>∞</i></span></div>
        </div>
      </div>
    </section>
  `
}

function renderHome(): string {
  return `${renderHero()}${renderSignalStrip()}${renderFeatured()}${renderMap()}<section class="shell invitation"><p class="eyebrow">A final placeholder</p><h2>Have a thought,<br /><em>an edge or a question?</em></h2><a class="button button-primary" href="#/context">Continue exploring ${icons.arrow}</a></section>`
}

function renderPageHero(kicker: string, title: string, lede: string, className = ''): string {
  return `<section class="page-hero shell ${className}"><p class="kicker"><span class="kicker-dot"></span>${escapeHtml(kicker)}</p><h1>${title}</h1><p class="page-lede">${escapeHtml(lede)}</p></section>`
}

function renderContext(): string {
  return `
    ${renderPageHero('The sample context', 'A small system for<br /><em>checking the edges.</em>', 'Lorem ipsum explains the shape without making any claim. Use this page to test long headings, supporting copy, and the transition into a card grid.')}
    <section class="shell context-intro"><div class="context-statement"><span class="quote-mark">“</span><p>Make the path legible, leave the edges soft, and let the next useful thing be easy to find.</p><span class="quote-attribution">— Placeholder principle / 01</span></div><div class="context-aside"><p class="eyebrow">What this checks</p><p>Navigation, semantic sections, contrast, spacing, and content that wraps without breaking the layout.</p></div></section>
    <section class="principles-section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Three small rules</p><h2>Structure, not <em>noise.</em></h2></div></div><div class="principles-grid"><article><span class="principle-number">01</span><h3>Keep it clear</h3><p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p></article><article><span class="principle-number">02</span><h3>Keep it useful</h3><p>Curabitur blandit tempus porttitor. Donec sed odio dui.</p></article><article><span class="principle-number">03</span><h3>Keep it light</h3><p>Etiam porta sem malesuada magna mollis euismod.</p></article></div></div></section>
    <section class="shell context-next"><div><p class="eyebrow">A practical route</p><h2>Notes make the<br /><em>test repeatable.</em></h2></div><div><p>Each Markdown file becomes a small route. Add one, change one, or use the existing examples to check the content pipeline.</p><a class="text-link" href="#/notes">Open the notes ${icons.arrowRight}</a></div></section>
  `
}

function renderNotes(): string {
  return `
    ${renderPageHero('The sample notes', 'Useful fragments,<br /><em>made navigable.</em>', 'Fake guides, field notes, and stories exercise the Markdown loader, metadata, filtering, and article view.')}
    <section class="shell notes-content"><div class="notes-toolbar"><div><p class="eyebrow">Content as code</p><p>New placeholder notes live in <code>src/content/notes</code>. Write Markdown, build the site, and check the result.</p></div><div class="filter-list" role="group" aria-label="Filter notes"><button class="filter-button is-selected" type="button" data-filter="all">All</button><button class="filter-button" type="button" data-filter="Guide">Guides</button><button class="filter-button" type="button" data-filter="Field note">Field notes</button><button class="filter-button" type="button" data-filter="Story">Stories</button></div></div><div class="notes-grid" id="notes-grid">${notes.map((note) => `<div class="note-item" data-category="${escapeHtml(note.category)}">${renderNoteCard(note)}</div>`).join('')}</div></section>
    <section class="notes-band"><div class="shell notes-band-grid"><div><p class="eyebrow eyebrow-light">Placeholder report</p><h2>Proof of <em>packaging.</em></h2></div><p>Build output, artifact upload, base paths, and a clean preview are the only claims this little fixture needs to make.</p></div></section>
  `
}

function renderNote(note: Note): string {
  return `
    <article class="article-page shell"><a class="back-link" href="#/notes">${icons.arrowRight} Back to notes</a><div class="article-header"><div class="note-card-top"><span class="category-label">${escapeHtml(note.category)}</span><span>${escapeHtml(note.readTime)}</span></div><h1>${escapeHtml(note.title)}</h1><p class="article-deck">${escapeHtml(note.deck)}</p><div class="article-meta"><span>${formatDate(note.date)}</span>${note.tags.map(renderPill).join('')}</div></div><div class="article-layout"><aside class="article-aside"><p class="eyebrow">In this note</p><p>Placeholder ideas, sample structure, and a small route to inspect.</p><a class="text-link" href="#/context">See context ${icons.arrow}</a></aside><div class="article-body">${renderMarkdown(note.body)}</div></div></article>
  `
}

function renderNotFound(): string {
  return `${renderPageHero('No route found', 'Let’s try<br /><em>another path.</em>', 'This placeholder route does not exist. Return to the sample home page and continue checking the navigation.')}<section class="shell not-found-action"><a class="button button-primary" href="#/">Back home ${icons.arrow}</a></section>`
}

function bindInteractions(): void {
  const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
  const nav = document.querySelector<HTMLElement>('.site-nav')

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('is-open') ?? false
    menuToggle.setAttribute('aria-expanded', String(isOpen))
  })

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open')
      menuToggle?.setAttribute('aria-expanded', 'false')
    })
  })

  document.querySelectorAll<HTMLButtonElement>('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-selected'))
      button.classList.add('is-selected')
      const filter = button.dataset.filter ?? 'all'
      document.querySelectorAll<HTMLElement>('.note-item').forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter
      })
    })
  })
}

function render(): void {
  const route = getRoute()
  let content: string

  if (route.name === 'home') {
    content = renderHome()
  } else if (route.name === 'context') {
    content = renderContext()
  } else if (route.name === 'notes') {
    content = renderNotes()
  } else {
    const note = notes.find((item) => item.slug === route.slug)
    content = note ? renderNote(note) : renderNotFound()
  }

  if (!app) return

  app.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a>${renderHeader(route)}<main id="main-content" tabindex="-1">${content}</main>${renderFooter()}`
  window.scrollTo({ top: 0, behavior: 'instant' })
  bindInteractions()
}

window.addEventListener('hashchange', render)
render()
