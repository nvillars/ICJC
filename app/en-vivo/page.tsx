export default function EnVivoPage() {
  return (
    <main aria-labelledby="envivo-heading" className="min-h-screen bg-gradient-to-b from-[#0A4D9C] to-[#0CB9C5] flex flex-col items-center py-10 text-white">
      <header className="w-full max-w-2xl flex flex-col items-center gap-4 mb-8">
        <img src="/brand/logo.svg" alt="Logo IC Jesucristo es el Camino" className="w-20 h-20 rounded-full shadow-lg border-4 border-white bg-white" />
        <h1 id="envivo-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg text-center">
          En Vivo
        </h1>
        <p className="text-lg md:text-xl font-medium text-white/90 text-center max-w-xl">
          Transmisión en vivo de nuestros servicios y eventos especiales.
        </p>
      </header>
      <section className="w-full max-w-3xl bg-white/90 rounded-lg shadow p-6 text-[#0A4D9C] flex flex-col items-center">
        <p className="mb-4 font-semibold">Próximamente: integración automática con Facebook Live y fallback al último sermón.</p>
        {/* Aquí irá el embed dinámico o fallback */}
      </section>
    </main>
  )
}
