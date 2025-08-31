export default function Home() {
  return (
    <main aria-labelledby="main-heading" className="min-h-screen bg-gradient-to-b from-[#0A4D9C] to-[#0CB9C5] flex flex-col items-center justify-center text-white">
      <header className="w-full max-w-2xl flex flex-col items-center gap-4 py-10">
        <img src="/brand/logo.svg" alt="Logo IC Jesucristo es el Camino" className="w-24 h-24 rounded-full shadow-lg border-4 border-white bg-white" />
        <h1 id="main-heading" className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg text-center">
          IC Jesucristo es el Camino
        </h1>
        <p className="text-lg md:text-2xl font-medium text-white/90 text-center max-w-xl">
          Llamados a restaurar los principios perdidos de la iglesia reformada.
        </p>
      </header>
      <nav aria-label="Navegación principal" className="flex flex-wrap gap-4 mb-8">
        <a href="/sermones" className="bg-white/90 text-[#0A4D9C] px-5 py-2 rounded font-semibold shadow hover:bg-white focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-[#0CB9C5] transition">Sermones</a>
        <a href="/eventos" className="bg-white/90 text-[#0A4D9C] px-5 py-2 rounded font-semibold shadow hover:bg-white focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-[#0CB9C5] transition">Eventos</a>
        <a href="/ministerios" className="bg-white/90 text-[#0A4D9C] px-5 py-2 rounded font-semibold shadow hover:bg-white focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-[#0CB9C5] transition">Ministerios</a>
        <a href="/en-vivo" className="bg-[#0CB9C5] text-white px-5 py-2 rounded font-semibold shadow hover:bg-[#0A4D9C] focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-white transition">Ver en vivo</a>
      </nav>
      <section className="text-center max-w-xl mb-8">
        <p className="text-white/80 text-base md:text-lg">Síguenos en&nbsp;
          <a href="https://www.facebook.com/ICJCOficial/?locale=es_LA" target="_blank" rel="noopener" className="underline hover:text-[#0CB9C5] focus:outline focus:ring-2 focus:ring-white">Facebook</a>
          &nbsp;y acompaña nuestros servicios, devocionales y eventos.
        </p>
      </section>
      <footer className="mt-auto py-6 text-white/70 text-sm text-center w-full">
        © {new Date().getFullYear()} IC Jesucristo es el Camino. Lima, Perú.
      </footer>
    </main>
  )
}
