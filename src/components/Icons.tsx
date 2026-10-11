type Props = { size?: number }

export const ArrowIcon = ({ size = 16 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CheckIcon = ({ size = 16 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CrossIcon = ({ size = 16 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export const MenuIcon = ({ size = 22, open = false }: Props & { open?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {open
      ? <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      : <path d="M3 8h16M3 14h16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />}
  </svg>
)
