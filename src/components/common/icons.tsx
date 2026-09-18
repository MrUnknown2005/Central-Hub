import type { ComponentProps } from 'react'

/** The Central Hub mark: an asterisk (a reference / index mark), monochrome.
 *  Inherits currentColor so it reads as ink beside the wordmark. Matches the favicon. */
export function HubMark({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="5.1" y1="8" x2="18.9" y2="16" />
        <line x1="5.1" y1="16" x2="18.9" y2="8" />
      </g>
    </svg>
  )
}
