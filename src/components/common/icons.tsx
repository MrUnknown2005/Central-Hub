import type { ComponentProps } from 'react'

/** Brand / social glyphs that lucide no longer ships as first-class icons.
 *  Typed as plain SVG components so they interop with lucide icons. */

export function GitHubIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.98 3.23 9.2 7.71 10.69.56.1.77-.24.77-.54 0-.27-.01-1.15-.02-2.09-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .17 2.63-.79 2.63-.79.09-.72.39-1.2.71-1.48-2.51-.29-5.15-1.25-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .94-.3 3.1 1.16.9-.25 1.86-.37 2.82-.38.96 0 1.92.13 2.82.38 2.15-1.46 3.09-1.16 3.09-1.16.61 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.28-5.16 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.48-1.5 7.71-5.71 7.71-10.69C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  )
}

export function LinkedInIcon({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  )
}

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
