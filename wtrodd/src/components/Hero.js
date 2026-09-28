const Hero = () => (
  <section id="top" className="relative overflow-hidden border-b border-white/5">
    {/* Ambient accent wash. Decorative only. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[128px]"
    />

    {/* No container here — <main> already supplies max-width and gutter. */}
    <div className="relative pb-24 pt-20 md:pt-28">
      <h1 className="max-w-3xl">
        <span className="mb-6 block font-mono text-sm text-orange-400">william trodd</span>
        <span className="block text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
          developer, educator,{' '}
          <span className="text-orange-400">creator</span>
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-orange-400 animate-blink motion-reduce:animate-none"
          />
        </span>
      </h1>

      <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
        <p>
          I've been working as a computer science teacher for 5 years, passing on my knowledge to the next generation of developers.
          I've taught Python, Kotlin, JavaScript, and in my own development journey have used Java and TypeScript.
          Lately I've been focussed on full-stack web development with the aim of moving into the climate tech sector.
        </p>
        <p>
          I'm a big fan of FOSS, having relied on it to get me through school, and I'm always on the lookout for new interesting projects to support.
        </p>
      </div>

      <p className="mt-10 font-mono text-sm text-zinc-500">
        teacher <span className="text-orange-400">&rarr;</span> full-stack <span className="text-orange-400">&rarr;</span> climate tech
      </p>
    </div>
  </section>
)

export default Hero
