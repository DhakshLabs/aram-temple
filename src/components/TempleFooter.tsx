import { contact, nav } from '../content'
import { Brand } from './Brand'

export function TempleFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <div className="site-footer__brand">
          <Brand />
          <p>Unified ERP for faith, service and trust management.</p>
        </div>
        <nav aria-label="Footer">
          <ul>{nav.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </nav>
        <div className="site-footer__contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.phoneHref}>{contact.phone}</a>
        </div>
      </div>
      <div className="wrap site-footer__base">
        <p>© {new Date().getFullYear()} ARAM ERP. A product of <a href={contact.site}>Kapplabs</a>.</p>
        <p lang="ta" className="site-footer__tamil" title="அறம் (aram) — virtue">அறம்</p>
      </div>
    </footer>
  )
}
