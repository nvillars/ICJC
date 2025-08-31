export default function NosotrosPage() {
  return (
    <main aria-labelledby="nosotros-heading" className="min-h-screen bg-gradient-to-b from-[#0A4D9C] to-[#0CB9C5] flex flex-col items-center py-10 text-white">
      <header className="w-full max-w-2xl flex flex-col items-center gap-4 mb-8">
        <img src="/brand/logo.svg" alt="Logo IC Jesucristo es el Camino" className="w-20 h-20 rounded-full shadow-lg border-4 border-white bg-white" />
        <h1 id="nosotros-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg text-center">
          Nosotros
        </h1>
        <p className="text-lg md:text-xl font-medium text-white/90 text-center max-w-xl">
          Conoce nuestra historia, visión y equipo pastoral.
        </p>
      </header>
      <section className="w-full max-w-3xl bg-white/90 rounded-lg shadow p-6 text-[#0A4D9C]">
        <p className="mb-4 font-semibold">Próximamente: información institucional y equipo.</p>
        {/* Aquí irá el contenido dinámico desde MongoDB */}
      </section>
    </main>
  )
}
