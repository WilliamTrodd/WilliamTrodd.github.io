const Footer = () => (
  <footer id="contact" className="border-t border-white/5">
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-2xl font-medium tracking-tight text-zinc-100 sm:text-3xl">
        Get in touch
      </h2>
      <p className="mt-3 max-w-xl leading-relaxed text-zinc-400">
        The best place to find me and my work is GitHub.
      </p>

      <a
        href="https://github.com/WilliamTrodd"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-sm text-zinc-200 transition-colors hover:border-orange-400/50 hover:text-orange-400"
      >
        GitHub
        <span aria-hidden="true">&#8599;</span>
      </a>

      <p className="mt-12 font-mono text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} William Trodd &middot; built with React &amp; Tailwind
      </p>
    </div>
  </footer>
)

export default Footer
