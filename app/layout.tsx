// Layout root pass-through: ogni route group gestisce il proprio documento html/body (vedi payload-pattern/01-architettura.mdc).
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return children
}
