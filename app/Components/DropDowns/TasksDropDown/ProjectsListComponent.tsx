import { getIconComponent } from "@/app/functions/IconsActions";
import {
  ProjectWithSelection,
  useTaskFormContext,
} from "../../Window/TasksWindow";
import { useEffect, useRef } from "react";

export default function ProjectsListComponent() {
  const {
    updateAllProjectsObject: { updateAllProjects },
    openTasksDropDownObject: { setOpenTasksDropDown, openTasksDropDown },
    projectObject: { setProject },
  } = useTaskFormContext();

  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectsRef.current &&
        !projectsRef.current.contains(event.target as Node)
      ) {
        setOpenTasksDropDown(false);
        setProject(null);
      }
    }

    function handleResize() {
      setOpenTasksDropDown(false);
    }

    if (openTasksDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [openTasksDropDown, setOpenTasksDropDown]);

  return (
    <div
      ref={projectsRef}
      className="shadow-xl rounded-xl flex flex-col gap-2 p-1 text-slate-600 bg-white"
    >
      {updateAllProjects.map((singleProject, index) => (
        <SingleProject
          key={index}
          singleProject={singleProject}
          index={index}
        />
      ))}
    </div>
  );
}

function SingleProject({
  singleProject,
  index,
}: {
  singleProject: ProjectWithSelection;
  index: number;
}) {
  const {
    projectObject: { setProject },
    updateAllProjectsObject: { setUpdateAllProjects },
    openTasksDropDownObject: { setOpenTasksDropDown },
  } = useTaskFormContext();
  function updateTheProject(index: number) {
    setProject(singleProject);

    setUpdateAllProjects((prevState) =>
      prevState.map((sProject, i) => ({
        ...sProject,
        isSelected: index === i,
      })),
    );

    setOpenTasksDropDown(false);
  }
  return (
    <div
      onClick={() => updateTheProject(index)}
      className={`${singleProject.isSelected && "bg-orange-50 border border-orange-200"} p-2 rounded-md flex gap-4`}
    >
      <span>{getIconComponent(singleProject.icon)}</span>
      <span>{singleProject.title}</span>
    </div>
  );
}
