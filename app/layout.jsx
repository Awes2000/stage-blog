import './globals.css'

export const metadata = {
  title: 'Awes Zoretic – Stage Blog',
  description: 'Stage blog voor Mediacollege Amsterdam',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
