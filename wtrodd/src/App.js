//import './App.css';
//import jsLogo from './assets/js_logo.svg'
import { useEffect, useState } from 'react'
//import Projects from './components/Projects'
//import Navbar from './components/Navbar'
import { ComputerDesktopIcon, BuildingLibraryIcon, HashtagIcon, CircleStackIcon, CodeBracketIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

const ProjectCard = (props) => (
  <div className="h-96 p-2 my-2 border w-80 border-gray-200 rounded-lg shadow-md  dark:bg-gray-800 dark:border-gray-700">

    <div className="p-5 max-w-1/4 h-full flex flex-col">
      <div className="flex justify-center">{props.icon}</div>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-slate-600 dark:text-white">{props.projectName}</h5>
      <hr/>
      <ul className="mb-3 font-normal text-gray-700 dark:text-slate-400">{props.projectStack.map(tech => <li>{tech}</li>)}</ul>

      <a href={props.projectUrl} className="flex mt-auto w-fit items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-300 rounded-lg hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-700 dark:hover:bg-orange-600 dark:focus:ring-orange-700">
        Read more
        <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </a>
    </div>
  </div>
)

const App = () => {

  const [projects, setProjects] = useState([])
  //const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setProjects([{
      id: 1,
      name: "FullStackOpen - UoH",
      tech: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
      url: "https://github.com/WilliamTrodd/fsopenWTD2.0",
      icon: <CircleStackIcon className="h-16 w-16 text-orange-900 flex my-6" />
    },
    {
      id: 2,
      name: "Portfolio Page",
      tech: ['React', 'Tailwind CSS'],
      url: "#",
      icon: <CodeBracketIcon className="h-16 w-16 text-orange-900 flex my-6" />
    },
    {
      id: 3,
      name: "Maths Game App",
      tech: ['Kotlin'],
      url: "https://github.com/WilliamTrodd/MathsQuizV3",
      icon: <DevicePhoneMobileIcon className="h-16 w-16 text-orange-900 flex my-6" />
    }
    ])
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center bg-slate-100 px-16 py-20 w-full">
        <div className="flex flex-col ">
          <div className="flex flex-col max-w-7xl">
            <p className="text-lg md:text-xl flex mb-2">I'm Will.</p>
            <p className="text-lg md:text-2xl tracking-tighter text-orange-400 mb-6">developer, educator, creator.</p>
            <p className="text-md md:text-lg text-slate-700">
              I've been working as a computer science teacher for 5 years, passing on my knowledge to the next generation of developers.
              I've taught Python, Kotlin, JavaScript, and in my own development journey have used Java and TypeScript.
              Lately I've been focussed on full-stack web development with the aim of moving into the climate tech sector.
              <br />
              <br />
              I'm a big fan of FOSS, having relied on it to get me through school, and I'm always on the lookout for new interesting projects to support.
            </p>
          </div>
        </div>
        <div>
          <p className="text-9xl flex font-mono font-semibold tracking-tight">&lt;WT/&gt;</p>
        </div>
      </div>
      <div className="flex flex-col items-center p-20">
        <ComputerDesktopIcon className="h-16 w-16 text-blue-300 flex my-6" />
        <div className="text-4xl font-bold text-slate-600 flex">Web Development</div>
        <div className="flex py-4">
          Developing software for the web gives us an incredible opportunity to share tools with the world. 
          Despite working in Computer Science education for the last 5 years, my background is in Environmental Science. 
          I'm very interested in the future of climate tech, and how we can apply CS solutions to climate problems.
        </div>
      </div>
      <div className="flex flex-col items-center p-20">
        <BuildingLibraryIcon className="h-16 w-16 text-blue-300 flex my-6" />
        <div className="text-4xl font-bold text-slate-600 flex">Working in Schools</div>
        <div className="flex py-4">
          Working in education has shown me the importance of access to information.
          I believe that all students should have equal opportunities, and this extends into my support for FOSS development.
        </div>
      </div>
      <div className="flex flex-col items-center p-20 w-full">
        <HashtagIcon className="h-16 w-16 text-blue-300 flex my-6" />
        <div className="text-4xl font-bold text-slate-600 flex">My Projects</div>
        <div className="flex flex-col lg:flex-row justify-around w-full my-2 py-2 items-center" >
          {projects.map(project => <ProjectCard key={project.id} projectName={project.name} projectUrl={project.url} icon={project.icon} projectStack={project.tech} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
