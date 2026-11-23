import React, { useRef } from "react";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Key } from "@mui/icons-material";
import { useContextApp } from "@/app/contextApp";
import { Task } from "@/app/Data/AllProjects";

export default function TasksSubHeader() {
  return (
    <div className="mt-24 flex justify-between items-center">
      <MyProjectsText />
      <SortByButton />
    </div>
  );
}

function MyProjectsText() {
  const {
    chosenProjectObject: { chosenProject, setChosenProject },
    allProjectsObject: { allProjects },
    openProjectsDropDownObject: {
      openProjectsDropDown,
      setOpenProjectsDropDown,
    },
    dropDownPositionsObject: { setDropDownPositions },
  } = useContextApp();

  //Calculate the total number of tasks in all projects
  function allTasksInAllProjects() {
    return allProjects.reduce((acc, project) => acc + project.tasks.length, 0);
  }

  // function that return the completed tasks
  function calculateCompletedTasks(tasks: Task[]) {
    return tasks.filter((task) => task.status === "Completed").length;
  }

  //If no project is chosen, return the total number of tasks of all projects
  //otherwise return the number of completed tasks of the chosen project

  const totalTasks = chosenProject
    ? chosenProject.tasks.length
    : allTasksInAllProjects();

  // If no project is chosen, return the completed tasks of all projects
  //otherwise return all completed tasks of chosen projects by using the function calculateCompletedTasks
  //

  // const allCompletedTasksOfAllProject = allProjects.forEach((project) => {
  //   let allCompletedTasks = 0;
  //   project.tasks.forEach((task) => {
  //     if (task.status === "Completed") allCompletedTasks++;
  //   });

  //   return allCompletedTasks;
  // });
  const completedTasks = chosenProject
    ? calculateCompletedTasks(chosenProject.tasks)
    : allProjects.reduce(
        (acc, project) => acc + calculateCompletedTasks(project.tasks),
        0,
      );

  // Calculate the completed percentage
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const projectTitleRef = useRef<HTMLLIElement>(null);

  function handleOpenDropDownProjects(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (projectTitleRef.current) {
      const rect = projectTitleRef.current.getBoundingClientRect();
      const { top, left } = rect;

      setDropDownPositions({
        top: top + window.scrollX + 40,
        left: left + window.scrollY,
      });
    }

    setOpenProjectsDropDown(!openProjectsDropDown);
  }

  return (
    <div className="flex items-center max-sm:gap-2 gap-3 ">
      <div className="w-[41px] -mt-1 flex justify-center items-center h-[44px] rounded-md bg-orange-100">
        <SplitscreenIcon
          sx={{ fontSize: "21px" }}
          className="text-orange-600"
        />
      </div>

      <ul className="flex flex-col gap-[7px] max-sm:gap-2.5">
        <li
          ref={projectTitleRef}
          onClick={handleOpenDropDownProjects}
          className="text-[17px] font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <div className="text-slate-700 flex gap-2 items-center">
            <span className="text-lg">
              {chosenProject?.title || "All Projects"}
            </span>
            <span className="bg-slate-700 text-white text-[14px] p-0.5 px-2 rounded-md max-[420px]:hidden">
              {totalTasks}
            </span>
          </div>
          <KeyboardArrowDownIcon className="text-slate-600 text-lg" />
        </li>

        <div className="flex gap-1 items-center ">
          <li className="flex flex-row items-center justify-center gap-4 max-sm:w-[170px] max-[420px]:w-[130px]">
            <div className="text-[12px] w-[280px] h-1 bg-slate-200 rounded-md overflow-auto">
              <div
                style={{ width: `${completionPercentage}%` }}
                className="h-full bg-orange-600 rounded-r-xl"
              ></div>
            </div>
            <p className="text-[12px] text-slate-400 ml-3">{`${completionPercentage.toFixed(0)}% Completed`}</p>
          </li>
        </div>
      </ul>
    </div>
  );
}

function SortByButton() {
  const {
    openSortingDropDownObject: { openSortingDropDown, setOpenSortingDropDown },
    sortingDropDownPositionsObject: { setSortingDropDownPositions },
    sortingOptionsObject: { sortingOptions },
  } = useContextApp();

  const sortingContainer = useRef<HTMLDivElement>(null);

  let sortingLabel = "";

  const flatten = sortingOptions
    .flatMap((option) => option.options)
    .find((option) => option.selected);

  if (flatten) {
    if (flatten.label === "A-Z" || flatten.label === "Z-A") {
      sortingLabel = `Order ${flatten.label}`;
    } else {
      sortingLabel = `${flatten.label} Tasks`;
    }
  }

  function handleOpenSortingDropDown() {
    if (sortingContainer.current) {
      const rect = sortingContainer.current?.getBoundingClientRect();
      setSortingDropDownPositions({
        top: rect.top + 30,
        left: rect.left + 10,
        width: rect.width,
      });
    }
    setOpenSortingDropDown(!openSortingDropDown);
  }
  return (
    <div
      ref={sortingContainer}
      className="flex max-sm:flex-col text-[15px] font-semibold gap-3"
    >
      <span className="text-slate-300">Sort By</span>
      <div
        onClick={handleOpenSortingDropDown}
        className="flex gap-1 items-center cursor-pointer"
      >
        <span className="text-slate-800">{sortingLabel}</span>
        <KeyboardArrowDownIcon sx={{ fontSize: "19px" }} />
      </div>
    </div>
  );
}
