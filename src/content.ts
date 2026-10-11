/*
 * Site copy. Every capability below is taken from the ARAM ERP for Temples product
 * brochure. The testimonial is the client-supplied one. Do not add other customers,
 * statistics, testimonials, certifications or capabilities that aren't in the product.
 */

export const contact = {
  email: 'kapplabs@kannanware.com',
  phone: '+91 91507 66678',
  phoneHref: 'tel:+919150766678',
  site: 'https://www.kapplabs.com/',
}

export const nav: [label: string, href: string][] = [
  ['Overview', '#institution'],
  ['Platform', '#platform'],
  ['How we work', '#how'],
  ['Reviews', '#reviews'],
  ['FAQ', '#faq'],
  ['Contact', '#contact'],
]

/** Overview points beside the dashboard. */
export const overviewPoints = [
  'Devotees, sevas, panchangam and annadhanam',
  'Cashbook, banking and finance',
  'Projects, festivals and assets',
  'Reports trustees can read at a glance',
]

/** Before ARAM (typical manual office) → with ARAM. Each "after" maps to a brochure module. */
export const beforeAfter: { before: string; after: string }[] = [
  { before: 'Devotee details spread across registers and receipt books', after: 'One profile per devotee — family, spiritual details and donation history' },
  { before: 'Seva bookings written by hand; priests get the list late', after: 'Sevas booked and receipted, with a clear seva report for priests' },
  { before: 'Cash counted and balanced by hand at the end of the day', after: 'Cashbook with denomination counting, variance tracking and day closure' },
  { before: 'Deposits, cheques and UPI payments matched in spreadsheets', after: 'Deposits, cheques and UPI references reconciled with the bank' },
  { before: 'Reports put together by hand before every committee meeting', after: 'Trial balance, P&L, balance sheet and cash flow, ready for trustees' },
  { before: 'Little record of who changed what, and when', after: 'Role-based access, MFA, and activity and audit logs' },
]

/** How a temple gets started with ARAM ERP. */
export const howWeWork = [
  { title: 'Walkthrough', text: 'We start with how your office works today — donations, sevas, cash, banking and reports.' },
  { title: 'Set up', text: 'ARAM ERP is configured around your temple: your sevas, accounts, bank accounts and staff roles.' },
  { title: 'Train', text: 'Office staff, priests, trustees and administrators each learn the part their role uses.' },
  { title: 'Go live', text: 'Your team runs the day in ARAM ERP, with our team there to help as you settle in.' },
]

export type ModuleId =
  | 'devotees' | 'sevas' | 'panchangam' | 'annadhanam'
  | 'cashbook' | 'banking' | 'finance' | 'projects'
  | 'assets' | 'reports'

export type Module = { id: ModuleId; name: string; summary: string; details: string[]; links: ModuleId[] }

/** The pillared hall: ten modules, held up by one foundation of security and governance. */
export const modules: Module[] = [
  { id: 'devotees', name: 'Devotees', summary: 'Devotee profiles, family records, spiritual details and donation history.', details: ['Profiles & families', 'Spiritual details', 'Donation history'], links: ['sevas', 'annadhanam', 'cashbook'] },
  { id: 'sevas', name: 'Sevas', summary: 'Seva bookings, rituals, schedules, receipts and service execution — with a clear working view for priests.', details: ['Bookings & schedules', 'Receipts', 'Priest-facing seva reports'], links: ['devotees', 'panchangam', 'cashbook', 'reports'] },
  { id: 'panchangam', name: 'Panchangam', summary: 'Plan temple activities using tithi, nakshatra, festivals and the ritual calendar.', details: ['Tithi & nakshatra', 'Festivals', 'Ritual calendar'], links: ['sevas', 'projects'] },
  { id: 'annadhanam', name: 'Annadhanam', summary: 'Annadhanam bookings, sponsors, meal planning and service fulfilment.', details: ['Bookings & sponsors', 'Meal planning', 'Fulfilment'], links: ['devotees', 'cashbook'] },
  { id: 'cashbook', name: 'Cashbook', summary: 'Daily receipts and payments, cash balances, denomination counting, variance tracking and day closure.', details: ['Receipts & payments', 'Denomination counting', 'Day closure'], links: ['devotees', 'sevas', 'annadhanam', 'banking', 'finance'] },
  { id: 'banking', name: 'Banking', summary: 'Bank accounts, deposits, withdrawals, cheque lifecycle, UPI references and reconciliation.', details: ['Deposits & withdrawals', 'Cheques & UPI references', 'Reconciliation'], links: ['cashbook', 'finance'] },
  { id: 'finance', name: 'Finance', summary: 'GL accounts, vendor-linked expenses with approvals, budgets and full accounting control.', details: ['GL accounts', 'Expenses & approvals', 'Budgets'], links: ['cashbook', 'banking', 'projects', 'assets', 'reports'] },
  { id: 'projects', name: 'Projects & events', summary: 'Projects, festivals and events — with budgets, collections, expenses and progress.', details: ['Festivals & events', 'Budgets & collections', 'Progress'], links: ['panchangam', 'finance', 'reports'] },
  { id: 'assets', name: 'Assets', summary: 'Assets, inventory, equipment, valuables and property across their lifecycle.', details: ['Inventory & equipment', 'Valuables', 'Property lifecycle'], links: ['finance'] },
  { id: 'reports', name: 'Reports', summary: 'Trial balance, P&L, balance sheet, cash flow, and project and category-wise reports.', details: ['Financial statements', 'Cash flow', 'Project & category reports'], links: ['sevas', 'finance', 'projects'] },
]

export const foundation = {
  name: 'Security & governance',
  summary: 'Role-based permissions for staff, priests, trustees and administrators, MFA, activity and audit logs, backups and restore.',
}

/** How an offering moves through the system — each step maps to a module above. */
export const offeringJourney = [
  { step: 'Offering', module: 'Devotees & sevas', text: 'A devotee books a seva, sponsors annadhanam or makes a donation — recorded against their profile and history.' },
  { step: 'Receipt', module: 'Sevas & cashbook', text: 'A receipt is issued for the booking or donation as it is received.' },
  { step: 'Cashbook', module: 'Cashbook', text: 'The day’s receipts and payments are counted by denomination, balanced and closed.' },
  { step: 'Bank', module: 'Banking', text: 'Deposits, cheques and UPI references are recorded and reconciled with the bank.' },
  { step: 'Report', module: 'Reports', text: 'Collections flow into cash flow, project and category-wise reports for trustees.' },
]

export const testimonial = {
  initials: 'SR',
  name: 'Sri Raghavendra Mutt',
  place: 'Nanganallur, Chennai',
  quote: 'Daily collections, sevas, and reports are clear at a glance now. What used to take a full day of reconciliation takes minutes.',
  before: '1 day',
  after: 'Minutes',
}

export const faqs: { q: string; a: string }[] = [
  { q: 'What does ARAM ERP cover?', a: 'Devotees, sevas, panchangam, annadhanam, cashbook, banking, finance, projects and events, assets and reports — one integrated platform for the administrative work of a temple, on a single foundation of security and governance.' },
  { q: 'Who in the temple uses it?', a: 'Office staff, priests, trustees and administrators. Each person gets role-based permissions, so they see and change only what their role needs.' },
  { q: 'Can priests see the day’s sevas?', a: 'Yes. Seva bookings, schedules and receipts feed a clear, priest-facing seva report for the day, so the people performing the service know exactly what is booked.' },
  { q: 'How does the daily cash closing work?', a: 'The cashbook records the day’s receipts and payments, supports denomination counting, tracks any variance and closes the day — so the books match the cash in hand.' },
  { q: 'Are bank deposits, cheques and UPI payments tracked?', a: 'The banking module records deposits and withdrawals, follows each cheque through its lifecycle, keeps UPI references and reconciles them against your bank accounts.' },
  { q: 'Does it follow the temple calendar?', a: 'Panchangam is built in — tithi, nakshatra, festivals and the ritual calendar — so sevas, festivals and events can be planned around it.' },
  { q: 'What reports can trustees get?', a: 'Trial balance, profit and loss, balance sheet and cash flow, along with project-wise and category-wise reports — ready when the committee meets.' },
  { q: 'How is our data protected?', a: 'Role-based permissions, multi-factor authentication, activity and audit logs, and backups with restore.' },
  { q: 'How do we get started?', a: 'Tell us how your office handles donations, payments, banking, people and reports today using the form below. We will plan a walkthrough around the questions your team actually carries.' },
]
