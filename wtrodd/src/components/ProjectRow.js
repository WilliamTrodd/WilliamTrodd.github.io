import { ArrowUpRightIcon } from '@heroicons/react/24/outline'

const ProjectRow = ({ index, project }) => (
  <li>
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-t border-white/5 px-2 py-8 transition-colors hover:bg-white/[0.03] md:grid-cols-[4rem_1fr_auto] md:gap-8"
    >
      <span className="font-mono text-sm text-zinc-600 transition-colors group-hover:text-orange-400">
        {index}
      </span>

      <span>
        <span className="block text-xl font-medium tracking-tight text-zinc-100 transition-colors group-hover:text-orange-400 sm:text-2xl">
          {project.name}
        </span>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-zinc-500">
          {project.tech.map(tech => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </span>

      <ArrowUpRightIcon
        aria-hidden="true"
        className="h-5 w-5 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-orange-400 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
      />
    </a>
  </li>
)

export default ProjectRow
