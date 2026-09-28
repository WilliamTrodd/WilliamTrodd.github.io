const links = ['tools', 'work', 'about', 'contact']

const Nav = () => (
  <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a href="#top" className="font-mono text-sm text-zinc-200 transition-colors hover:text-orange-400">
        <span className="text-orange-400">~/</span>wt
      </a>
      <nav aria-label="Primary">
        <ul className="flex items-center gap-6">
          {links.map(link => (
            <li key={link}>
              <a
                href={`#${link}`}
                className="font-mono text-sm text-zinc-500 transition-colors hover:text-zinc-100"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
)

export default Nav
