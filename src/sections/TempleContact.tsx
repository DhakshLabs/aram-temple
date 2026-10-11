import { useState, type FormEvent } from 'react'
import { ArrowIcon } from '../components/Icons'
import { contact } from '../content'
import './TempleContact.css'

const fields = [
  { name: 'name', label: 'Full Name', type: 'text', autoComplete: 'name', required: true },
  { name: 'institution', label: 'Temple / Institution', type: 'text', autoComplete: 'organization', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', required: false },
] as const

/** The form has no backend: it opens the visitor's email app with the message composed. */
export function TempleContact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? '').trim()
    const subject = `ARAM ERP walkthrough — ${value('institution')}`
    const body = [
      `Name: ${value('name')}`,
      `Temple / Institution: ${value('institution')}`,
      `Email: ${value('email')}`,
      ...(value('phone') ? [`Phone: ${value('phone')}`] : []),
      '',
      value('message'),
    ].join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contact" className="section section--tint contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact__card" data-reveal>
          <div className="contact__intro">
            <p className="kicker">Contact</p>
            <h2 id="contact-title" className="statement contact__title">Plan a <em>walkthrough.</em></h2>
            <p className="contact__lede">Tell us how your office handles donations, payments, banking and reports today. We’ll shape the walkthrough around your questions.</p>
            <ul className="contact__ways">
              <li>
                <span className="contact__way-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </span>
                <span><small>Email</small><a href={`mailto:${contact.email}`}>{contact.email}</a></span>
              </li>
              <li>
                <span className="contact__way-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                </span>
                <span><small>Phone</small><a href={contact.phoneHref}>{contact.phone}</a></span>
              </li>
              <li>
                <span className="contact__way-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                </span>
                <span><small>Product</small><span>ARAM ERP · A product of <a href={contact.site}>Kapplabs</a></span></span>
              </li>
            </ul>
          </div>

          <form className="contact__form" onSubmit={onSubmit}>
            {fields.map((field) => (
              <label className="field" key={field.name}>
                <span>{field.label}</span>
                <input name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.required} />
              </label>
            ))}
            <label className="field field--wide">
              <span>Message</span>
              <textarea name="message" rows={4} />
            </label>
            <div className="contact__submit">
              <button className="button contact__button" type="submit">Send message <ArrowIcon /></button>
              <p className="contact__note" role="status">{sent ? 'Your email app should now be open with this message ready to send.' : ''}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
