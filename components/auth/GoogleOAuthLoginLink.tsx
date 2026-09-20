type GoogleOAuthLoginLinkProps = {
  href: string
  children: string
}

/**
 * Stile allineato al bottone Payload `btn btn--style-primary btn--size-large` (login Admin).
 * Classe CSS in `app/globals.css` — necessaria perché `a { color: inherit }` annulla le utility Tailwind sul testo.
 */
export function GoogleOAuthLoginLink({ href, children }: GoogleOAuthLoginLinkProps) {
  return (
    <a href={href} className="google-oauth-login-button">
      {children}
    </a>
  )
}
