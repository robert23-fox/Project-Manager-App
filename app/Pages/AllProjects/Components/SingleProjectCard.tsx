import React, { useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Project } from "@/app/Data/AllProjects";
import { getIconComponent } from "@/app/functions/IconsActions";
import { useContextApp } from "@/app/contextApp";
import { LibraryAdd } from "@mui/icons-material";

export default function SingleProjectCard({ project }: { project: Project }) {
  const progressPercentage = calculateProgressPercentage(
    project.tasks.length,
    project.tasks.filter((task) => task.status === "Completed").length,
  );
  return (
    <div className="bg-white rounded-lg p-5 flex flex-col gap-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader project={project} />
      <CardBody project={project} />
      <CardFooter project={project} progressPercentage={progressPercentage} />
    </div>
  );
}
function CardHeader({ project }: { project: Project }) {
  const {
    openDropDownObject: { setOpenDropDown },
    dropDownPositionsObject: { setDropDownPositions },
    selectedProjectObject: { setSelectedProject },
    chosenProjectObject: { setChosenProject },
    sideBarMenuObject: { setSideBarMenu },
  } = useContextApp();

  const threeDotsRef = useRef<HTMLDivElement>(null);

  function openDropDown(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (threeDotsRef.current) {
      const rect = threeDotsRef.current.getBoundingClientRect();
      const { top, left } = rect;

      setDropDownPositions({
        top: top + window.scrollY + 30,
        left: left + window.scrollX,
      });

      setSelectedProject(project);
    }

    setOpenDropDown(true);
  }

  function handleShowAllTasksOfProject() {
    setChosenProject(project);

    // Go to the all tasks page by using the side menu items
    setSideBarMenu((prevState) =>
      prevState.map((item) => ({
        ...item,
        isSelected: item.id === 2 ? true : false,
      })),
    );
  }

  return (
    <div className="flex justify-between items-center gap-4 mb-4">
      <div
        className="flex flex-row gap-2 hover:scale-105 cursor-pointer"
        onClick={handleShowAllTasksOfProject}
      >
        <div className="bg-orange-600 text-white p-2 rounded-md">
          {getIconComponent(project.icon, "text-white", "23px")}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <p className="text-slate-300 text-sm font-semibold">
            {calculateDaysLeft(project.createdAt)}{" "}
            {calculateDaysLeft(project.createdAt) > 1 ? "days" : "day"}
          </p>
        </div>
      </div>
      <div
        ref={threeDotsRef}
        className="hover:scale-105 hover:bg-slate-200 rounded-full"
        onClick={openDropDown}
      >
        <MoreVertIcon className="ml-auto cursor-pointer" />
      </div>
    </div>
  );
}

function CardBody({ project }: { project: Project }) {
  const {
    openTasksWindowObject: { setOpenTasksWindow },
    chosenProjectObject: { setChosenProject },
    projectClickedObject: { setProjectClicked },
    allProjectsObject: { allProjects },
  } = useContextApp();

  function openTheTaskWindow() {
    setOpenTasksWindow(true);
    // get the project when we want to add the task
    const findProject = allProjects.find((proj) => proj.id === project.id);

    if (findProject) {
      setProjectClicked(findProject);
    }
  }
  return (
    <div className="h-[120px]">
      {project.tasks.length === 0 && (
        <div
          onClick={openTheTaskWindow}
          className="flex flex-col gap-2 justify-center items-center text-slate-400 opacity-80 hover:text-orange-400 hover:scale-105"
        >
          <LibraryAdd />
          <span>No task created yet...</span>
        </div>
      )}
      <ul className="flex flex-col gap-2 ">
        {project.tasks.slice(0, 3).map((task) => (
          <li key={task.id} className="flex items-start gap-2">
            <CircleIcon
              style={{ fontSize: 12 }}
              className="text-slate-400 mt-1"
            />
            <p className="text-slate-400 text-sm">
              {truncateString(task.title, 40)}
            </p>
          </li>
        ))}
        {project.tasks.length > 3 && (
          <p className="text-orange-400 mt-2">{`+${project.tasks.length - 3} ${project.tasks.length - 3 === 1 ? "task" : "tasks"}`}</p>
        )}
      </ul>
    </div>
  );
}

function CardFooter({
  project,
  progressPercentage,
}: {
  project: Project;
  progressPercentage: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between">
        <p
          className={` text-sm ${
            progressPercentage === 100
              ? "text-green-400"
              : progressPercentage === 0
                ? "text-blue-500"
                : "text-orange-400"
          }`}
        >
          {progressPercentage === 100
            ? "Completed"
            : progressPercentage === 0
              ? "Planned"
              : "In Progress"}
        </p>
        <span className="text-sm">{progressPercentage}%</span>
      </div>
    </div>
  );
}

function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength);
  }

  return str;
}

function calculateDaysLeft(creationDate: string): number {
  const now = new Date();
  const creation = new Date(creationDate);
  const differenceInTime = now.getTime() - creation.getTime();
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
}

function calculateProgressPercentage(
  totalTasks: number,
  completedTasks: number,
): number {
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}
