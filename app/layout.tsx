import '../styles/globals.css'

export const metadata = {
  title: 'IC Jesucristo es el Camino',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="bg-brand p-4 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-lg font-semibold">IC Jesucristo es el Camino</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
