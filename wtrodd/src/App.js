import Nav from './components/Nav'
import Hero from './components/Hero'
import Block from './components/Block'
import ProjectRow from './components/ProjectRow'
import Footer from './components/Footer'
import ToolRow from './components/ToolRow'
import projects from './data/projects'
import tools from './data/tools'

const App = () => (
  <>
    <Nav />

    <main className="mx-auto max-w-5xl px-6">
      <Hero />

      <section id="about" aria-labelledby="about-heading" className="pt-20">
        <h2 id="about-heading" className="mb-2 font-mono text-sm uppercase tracking-widest text-zinc-500">
          About
        </h2>

        <Block index="01" title="Web Development">
          Developing software for the web gives us an incredible opportunity to share tools with the world.
          Despite working in Computer Science education for the last 5 years, my background is in Environmental Science.
          I'm very interested in the future of climate tech, and how we can apply CS solutions to climate problems.
        </Block>

        <Block index="02" title="Working in Schools">
          Working in education has shown me the importance of access to information.
          I believe that all students should have equal opportunities, and this extends into my support for FOSS development.
        </Block>
      </section>

      <section id="tools" aria-labelledby="tools-heading" className="pt-20">
        <h2 id="tools-heading" className="mb-2 font-mono text-sm uppercase tracking-widest text-zinc-500">
          Tools
        </h2>
        <p className="mb-2 max-w-xl text-sm leading-relaxed text-zinc-500">
          Free browser-based tools I've built for teaching computer science. Everything runs on your device.
        </p>
        <ul>
          {tools.map((tool, i) => (
            <ToolRow
              key={tool.id}
              index={String(i + 1).padStart(2, '0')}
              tool={tool}
            />
          ))}
        </ul>
      </section>

      <section id="work" aria-labelledby="work-heading" className="pt-20 pb-24">
        <h2 id="work-heading" className="mb-2 font-mono text-sm uppercase tracking-widest text-zinc-500">
          Work
        </h2>
        <ul>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              index={String(i + 1).padStart(2, '0')}
              project={project}
            />
          ))}
        </ul>
      </section>
    </main>

    <Footer />
  </>
)

export default App
