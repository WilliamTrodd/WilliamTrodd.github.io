import { ArrowRightIcon } from '@heroicons/react/24/outline'

const ToolRow = ({ index, tool }) => (
  <li>
    <a
      href={tool.url}
      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-t border-white/5 px-2 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-[4rem_1fr_auto] md:gap-8"
    >
      <span className="self-start pt-1 font-mono text-sm text-zinc-600 transition-colors group-hover:text-orange-400">
        {index}
      </span>

      <span>
        <span className="block text-xl font-medium tracking-tight text-zinc-100 transition-colors group-hover:text-orange-400 sm:text-2xl">
          {tool.name}
        </span>
        <span className="mt-2 block max-w-xl text-sm leading-relaxed text-zinc-400">
          {tool.blurb}
        </span>
        <span className="mt-2 block font-mono text-xs text-zinc-500">
          {tool.topic}
        </span>
      </span>

      <ArrowRightIcon
        aria-hidden="true"
        className="h-5 w-5 self-start text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      />
    </a>
  </li>
)

export default ToolRow
