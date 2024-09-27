import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CS2 Sharptimer Webpanel',
  description: 'A Next.js webpanel for CS2 Sharptimer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen transition-colors duration-300`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}