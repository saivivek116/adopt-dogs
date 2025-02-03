// app/layout.tsx
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // your tailwind styles
import { SWRConfig } from 'swr'
import fetcher from '@/lib/fetcher'
import { AuthProvider } from '../context/AuthContext'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fetch Dogs App',
  description: 'Find dogs a New Home!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SWRConfig
            value={{
              fetcher,
              // You can customize revalidateOnFocus, etc.
              // revalidateOnFocus: false,
            }}
          >
            {children}
          </SWRConfig>
        </AuthProvider>
      </body>
    </html>
  )
}
