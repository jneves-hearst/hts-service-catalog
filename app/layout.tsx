import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HTS Service Catalog",
  description: "Browse and request Hearst Technology Services offerings",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      {/* Inline script runs before React hydrates — prevents flash of wrong theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
        {children}
      </body>
    </html>
  )
}
