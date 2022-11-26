const Project = ({project}) => {
  
  return(
    <div className="p-2 pr-2 md:w-1/3 lg:w-1/4
                    border-2 border-color4 
                    bg-color1/20
                    drop-shadow-xl
                    relative
                    mx-2
                    ">
      <div className="relative block">
        <h2 className="md:text-xl lg:text-3xl m-2">{project.name}</h2>
        <hr width="100%" className="mx-auto"/>
        <div className="m-2 flex py-6">
          <div>Technologies:</div> 
          <div className="mx-1"><ul>{project.tech.map(tech => <li>{tech}</li>)}</ul></div>
        </div>
        <p className="m-2">
          Link: <a href={`https://www.${project.url}`}>{project.url}</a>
        </p>
      </div>
    </div>
  )


  /*
  return(
    <div className="p-6 max-w-sm mx-auto
                    bg-color4/80 hover:bg-color4/70
                    text-color4
                    rounded-xl drop-shadow-xl flex items-center space-x-4
                    ">
    <img src={project.icon} alt="JS Logo"/>
    <div className="shrink-0"><h4 className="text-xl font-medium">{project.name}</h4><p>{project.url}</p></div>
    </div>
  )*/
}

const Projects = ({projects}) => {
  console.log(projects)
  return(
    <div className="container mx-auto px-7 py-10">
      <div className="-m-4 flex flex-wrap">
      {projects.map(project => 
        <Project
          key={project.id}
          project={project}
        />
        )}
      </div>
    </div>
  )
}

export default Projects