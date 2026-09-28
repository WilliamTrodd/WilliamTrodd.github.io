/**
 * A numbered, rule-separated block. `index` is the mono eyebrow ("01"),
 * `title` becomes the h3 the eyebrow labels.
 */
const Block = ({ index, title, children }) => (
  <div className="grid gap-4 border-t border-white/5 py-10 md:grid-cols-[6rem_1fr] md:gap-8">
    <p className="font-mono text-sm text-orange-400">{index}</p>
    <div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-zinc-100 sm:text-2xl">{title}</h3>
      <div className="max-w-2xl leading-relaxed text-zinc-400">{children}</div>
    </div>
  </div>
)

export default Block
